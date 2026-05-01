const { stockRegistry, addStock, removeStock } = require("./stock_manager");
const { isAdmin } = require("./admin_access");

function twoColumn(items, productKey) {
  const entries = Object.entries(items);
  const rows = [];

  for (let i = 0; i < entries.length; i += 2) {
    rows.push(
      entries.slice(i, i + 2).map(([itemKey, item]) => ({
        text: `${item.label} — Stock: ${item.stock}`,
        callback_data: `stock_view|${productKey}|${itemKey}`
      }))
    );
  }

  return rows;
}

async function handleAdminStock(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (!isAdmin(query.from.id)) return false;

  if (data === "no_action") return true;

  if (data === "admin_stock") {
    const buttons = Object.entries(stockRegistry).map(([key, product]) => [
      { text: product.title, callback_data: `stock_product|${key}` }
    ]);

    buttons.push([{ text: "⬅ Back Admin", callback_data: "admin_back" }]);

    await bot.sendMessage(chatId, "📊 Stock Dashboard\nSelect product:", {
      reply_markup: { inline_keyboard: buttons }
    });

    return true;
  }

  if (data.startsWith("stock_product|")) {
    const productKey = data.split("|")[1];
    const product = stockRegistry[productKey];

    if (!product) return true;

    const discountItems = {};
    const regularItems = {};
    const otherItems = {};

    for (const [key, item] of Object.entries(product.items)) {
      if ((productKey === "dataimpulse" || productKey === "proxy_ip") && (key.includes("_d_") || key.startsWith("di_"))) {
        discountItems[key] = item;
      } else if ((productKey === "dataimpulse" || productKey === "proxy_ip") && (key.includes("_r_") || key.startsWith("r"))) {
        regularItems[key] = item;
      } else {
        otherItems[key] = item;
      }
    }

    const buttons = [];

    if (Object.keys(discountItems).length > 0) {
      buttons.push([{ text: "🔥 Discount Stock", callback_data: "no_action" }]);
      buttons.push(...twoColumn(discountItems, productKey));
    }

    if (Object.keys(regularItems).length > 0) {
      buttons.push([{ text: "💰 Regular Stock", callback_data: "no_action" }]);
      buttons.push(...twoColumn(regularItems, productKey));
    }

    if (Object.keys(otherItems).length > 0) {
      buttons.push(...twoColumn(otherItems, productKey));
    }

    buttons.push([{ text: "⬅ Back", callback_data: "admin_stock" }]);

    await bot.sendMessage(chatId, `📦 ${product.title}\nManage stock:`, {
      reply_markup: { inline_keyboard: buttons }
    });

    return true;
  }

  if (data.startsWith("stock_view|")) {
    const [, productKey, itemKey] = data.split("|");
    const product = stockRegistry[productKey];
    const item = product?.items[itemKey];

    if (!item) return true;

    await bot.sendMessage(
      chatId,
      `📦 Product: ${product.title}
📊 Package: ${item.label}
📦 Current Stock: ${item.stock}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "➕ Add Stock", callback_data: `stock_add|${productKey}|${itemKey}` },
              { text: "➖ Remove Stock", callback_data: `stock_remove|${productKey}|${itemKey}` }
            ],
            [{ text: "⬅ Back", callback_data: `stock_product|${productKey}` }]
          ]
        }
      }
    );

    return true;
  }

  if (data.startsWith("stock_add|") || data.startsWith("stock_remove|")) {
    const [action, productKey, itemKey] = data.split("|");

    if (action === "stock_add") {
      addStock(productKey, itemKey);
    } else {
      removeStock(productKey, itemKey);
    }

    const item = stockRegistry[productKey]?.items[itemKey];

    await bot.sendMessage(
      chatId,
      `✅ Stock updated!

📊 ${item.label}
📦 New Stock: ${item.stock}`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔄 Refresh", callback_data: `stock_view|${productKey}|${itemKey}` }],
            [{ text: "⬅ Back", callback_data: `stock_product|${productKey}` }]
          ]
        }
      }
    );

    return true;
  }

  return false;
}

module.exports = { handleAdminStock };