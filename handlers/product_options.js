const { showPaymentMethods } = require("./payment");
const { sendOrEdit } = require("./utils");

const pendingOrders = {};

const accountTypes = {
  old_account: "OLD Account",
  new_account: "New Account",
  redeem_code: "Redeem Code"
};

async function showProductOptions(bot, query, order) {
  const chatId = query.message.chat.id;
  pendingOrders[chatId] = order;

  await sendOrEdit(
    bot,
    query,
    `✅ Selected Product

📦 Product: ${order.name}
📊 Package: ${order.package}
💰 Price: ${order.price}

Select account type:`,
    [
      [
        { text: "👴 OLD Account", callback_data: "old_account" },
        { text: "🆕 New Account", callback_data: "new_account" }
      ],
      [{ text: "🎟 Redeem Code", callback_data: "redeem_code" }],
      [{ text: "⬅ Back", callback_data: order.back }]
    ]
  );
}

async function handleProductOptions(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (!accountTypes[data]) return false;

  const order = pendingOrders[chatId];

  if (!order) {
    await bot.sendMessage(chatId, "⚠️ Please select product/package first.");
    return true;
  }

  await showPaymentMethods(bot, chatId, {
    ...order,
    accountType: accountTypes[data]
  });

  delete pendingOrders[chatId];

  return true;
}

module.exports = {
  showProductOptions,
  handleProductOptions
};