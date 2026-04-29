const { stockRegistry, addStock, removeStock } = require("./stock_manager");

function isAdmin(userId) {
  return String(userId) === String(process.env.ADMIN_CHAT_ID);
}

function buildTwoColumnButtons(items, productKey) {
  const entries = Object.entries(items);
  const rows = [];

  for (let i = 0; i < entries.length; i += 2) {
    const row = entries.slice(i, i + 2).map(([key, item]) => ({
      text: `${item.label} (${item.stock})`,
      callback_data: `stock_view_${productKey}_${key}`
    }));
    rows.push(row);
  }

  return rows;
}

async function handleAdminStock(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (!isAdmin(query.from.id)) return false;

  // ===== MAIN DASHBOARD =====
  if (data === "admin_stock") {
    const buttons = Object.entries(stockRegistry).map(([key, product]) => [
      { text: product.title, callback_data: `stock_product_${key}` }
    ]);

    await bot.sendMessage(chatId, "📊 Stock Dashboard", {
      reply_markup: { inline_keyboard: buttons }
    });

    return true;
  }

  // ===== PRODUCT VIEW =====
  if (data.startsWith("stock_product_")) {
    const productKey = data.replace("stock_product_", "");
    const product = stockRegistry[productKey];

    if (!product) return true;

    // 🔥 Discount & Regular আলাদা করা
    const discountItems = {};
    const regularItems = {};

    for (const [key, item] of Object.entries(product.items)) {
      if (key.startsWith("di_")) {
        discountItems[key] = item;
      } else if (key.startsWith("r")) {
        regularItems[key] = item;
      } else {
        discountItems[key] = item; // fallback
      }
    }

    const buttons = [];

    // ===== DISCOUNT TITLE =====
    if (Object.keys(discountItems).length > 0) {
      buttons.push([
        { text: "🔥 Discount Stock", callback_data: "no_action" }
      ]);

      buttons.push(...buildTwoColumnButtons(discountItems, productKey));
    }

    // ===== REGULAR TITLE =====
    if (Object.keys(regularItems).length > 0) {
      buttons.push([
        { text: "💰 Regular Stock", callback_data: "no_action" }
      ]);

      buttons.push(...buildTwoColumnButtons(regularItems, productKey));
    }

    // ===== BACK BUTTON =====
    buttons.push([{ text: "⬅ Back", callback_data: "admin_stock" }]);

    await bot.sendMessage(chatId, `📦 ${product.title}`, {
      reply_markup: { inline_keyboard: buttons }
    });

    return true;
  }

  // ===== VIEW ITEM =====
  if (data.startsWith("stock_view_")) {
    const parts = data.replace("stock_view_", "").split("_");
    const itemKey = parts.pop();
    const productKey = parts.join("_");

    const item = stockRegistry[productKey]?.items[itemKey];
    if (!item) return true;

    await bot.sendMessage(
      chatId,
      `📦 ${item.label}\n📊 Stock: ${item.stock}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "➕ Add",
                callback_data: `stock_add_${productKey}_${itemKey}`
              },
              {
                text: "➖ Remove",
                callback_data: `stock_remove_${productKey}_${itemKey}`
              }
            ],
            [
              {
                text: "⬅ Back",
                callback_data: `stock_product_${productKey}`
              }
            ]
          ]
        }
      }
    );

    return true;
  }

  // ===== ADD / REMOVE =====
  if (data.startsWith("stock_add_") || data.startsWith("stock_remove_")) {
    const isAdd = data.startsWith("stock_add_");
    const raw = data.replace(isAdd ? "stock_add_" : "stock_remove_", "");
    const parts = raw.split("_");
    const itemKey = parts.pop();
    const productKey = parts.join("_");

    if (isAdd) {
      addStock(productKey, itemKey);
    } else {
      removeStock(productKey, itemKey);
    }

    const item = stockRegistry[productKey]?.items[itemKey];

    await bot.sendMessage(
      chatId,
      `✅ Updated\n📦 ${item.label}\n📊 New Stock: ${item.stock}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔄 Refresh",
                callback_data: `stock_view_${productKey}_${itemKey}`
              }
            ],
            [
              {
                text: "⬅ Back",
                callback_data: `stock_product_${productKey}`
              }
            ]
          ]
        }
      }
    );

    return true;
  }

  return false;
}

module.exports = { handleAdminStock };