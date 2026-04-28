const { showMainMenu } = require("./menu");

async function handleSupport(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "back_main") {
    showMainMenu(bot, chatId);
    return true;
  }

  if (data === "join_channel") {
    bot.sendMessage(chatId, "📢 Join our channel:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "👉 Join Channel", url: process.env.CHANNEL_URL }],
          [{ text: "⬅ Back", callback_data: "back_main" }]
        ]
      }
    });

    return true;
  }

  if (data === "hotline") {
    bot.sendMessage(chatId, "☎ Contact Support:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "💬 Message Admin", url: process.env.SUPPORT_URL }],
          [{ text: "⬅ Back", callback_data: "back_main" }]
        ]
      }
    });

    return true;
  }

  if (data === "others") {
    bot.sendMessage(chatId, "📦 Others section coming soon.", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "⬅ Back", callback_data: "back_main" }]
        ]
      }
    });

    return true;
  }

  return false;
}

module.exports = { handleSupport };