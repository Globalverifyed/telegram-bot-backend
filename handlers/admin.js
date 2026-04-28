async function handleAdmin(bot, msg) {
  const chatId = msg.chat.id;

  if (String(chatId) !== String(process.env.ADMIN_CHAT_ID)) {
    bot.sendMessage(chatId, "❌ You are not admin.");
    return true;
  }

  bot.sendMessage(chatId, "📊 Admin Dashboard", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📦 Pending Orders", callback_data: "admin_pending" },
          { text: "✅ Delivered Orders", callback_data: "admin_delivered" }
        ],
        [
          { text: "💰 Today Sales", callback_data: "admin_sales" },
          { text: "👥 Customers", callback_data: "admin_customers" }
        ],
        [
          { text: "⚙ Settings", callback_data: "admin_settings" }
        ]
      ]
    }
  });

  return true;
}

async function handleAdminButtons(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (String(query.from.id) !== String(process.env.ADMIN_CHAT_ID)) {
    return false;
  }

  if (data === "admin_pending") {
    bot.sendMessage(chatId, "📦 Pending Orders feature coming soon.");
    return true;
  }

  if (data === "admin_delivered") {
    bot.sendMessage(chatId, "✅ Delivered Orders feature coming soon.");
    return true;
  }

  if (data === "admin_sales") {
    bot.sendMessage(chatId, "💰 Today Sales feature coming soon.");
    return true;
  }

  if (data === "admin_customers") {
    bot.sendMessage(chatId, "👥 Customers feature coming soon.");
    return true;
  }

  if (data === "admin_settings") {
    bot.sendMessage(chatId, "⚙ Settings feature coming soon.");
    return true;
  }

  return false;
}

module.exports = {
  handleAdmin,
  handleAdminButtons
};