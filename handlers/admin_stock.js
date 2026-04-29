const {
  stockRegistry,
  addStock,
  removeStock
} = require("./stock_manager");

function isAdmin(userId) {
  return String(userId) === String(process.env.ADMIN_CHAT_ID);
}

async function handleAdminStock(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (!isAdmin(query.from.id)) return false;

  if (data === "admin_stock") {
    const buttons = Object.entries(stockRegistry).map(([key, product]) => [
      { text: product.title, callback_data: `stock_product_${key}` }
    ]);

    buttons.push([{ text: "⬅ Back Admin", callback_data: "admin_back" }]);

    await bot.sendMessage(chatId, "📊 Stock Dashboard\nSelect product:", {
      reply_markup: { inline_keyboard: buttons }
    });

    return true;
  }

  if (data.startsWith("stock_product_")) {
    const productKey = data.replace("stock_product_", "");
    const product = stockRegistry[productKey];

    if (!product) return true;

    const buttons = Object.entries(product.items).map(([itemKey, item]) => [
      {
        text: `${item.label} — Stock: ${item.stock}`,
        callback_data: `stock_view_${productKey}_${itemKey}`
      }
    ]);

    buttons.push([{ text: "⬅ Back", callback_data: "admin_stock" }]);

    await bot.sendMessage(chatId, `📦 ${product.title}\n\nSelect item:`, {
      reply_markup: { inline_keyboard: buttons }
    });

    return true;
  }

  if (data.startsWith("stock_view_")) {
    const parts = data.replace("stock_view_", "").split("_");
    const itemKey = parts.pop();
    const productKey = parts.join("_");

    const product = stockRegistry[productKey];
    const item = product?.items[itemKey];

    if (!item) return true;

    await bot.sendMessage(
      chatId,
      `📦 Product: ${product.title}\n📊 Package: ${item.label}\n📦 Current Stock: ${item.stock}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "➕ Add Stock", callback_data: `stock_add_${productKey}_${itemKey}` },
              { text: "➖ Remove Stock", callback_data: `stock_remove_${productKey}_${itemKey}` }
            ],
            [{ text: "⬅ Back", callback_data: `stock_product_${productKey}` }]
          ]
        }
      }
    );

    return true;
  }

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
      `✅ Stock updated!\n\n📊 ${item.label}\n📦 New Stock: ${item.stock}`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔄 Refresh", callback_data: `stock_view_${productKey}_${itemKey}` }],
            [{ text: "⬅ Back", callback_data: `stock_product_${productKey}` }]
          ]
        }
      }
    );

    return true;
  }

  return false;
}

module.exports = { handleAdminStock };