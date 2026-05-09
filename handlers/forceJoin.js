const { CHANNEL_ID, CHANNEL_LINK } = require("../config");

async function checkJoin(bot, userId) {
  if (!CHANNEL_ID) {
    console.log("Join check error: CHANNEL_ID missing");
    return false;
  }

  try {
    const member = await bot.getChatMember(CHANNEL_ID, userId);
    return ["member", "administrator", "creator"].includes(member.status);
  } catch (err) {
    console.log("Join check error:", err.message);
    return false;
  }
}

async function forceJoin(bot, update) {
  let chatId;
  let userId;

  if (update.message && update.message.chat && update.message.from) {
    chatId = update.message.chat.id;
    userId = update.message.from.id;
  } else if (update.chat && update.from) {
    chatId = update.chat.id;
    userId = update.from.id;
  } else if (update.callback_query && update.callback_query.message && update.callback_query.from) {
    chatId = update.callback_query.message.chat.id;
    userId = update.callback_query.from.id;
  } else {
    return false;
  }

  const joined = await checkJoin(bot, userId);

  if (!joined) {
    await bot.sendMessage(
      chatId,
      "🚫 আগে আমাদের Channel Join করুন।\n\nJoin করার পর আবার /start দিন।",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 Join Channel", url: CHANNEL_LINK || "https://t.me/+uix8wBPJfkdmZmU1" }]
          ]
        }
      }
    );

    return false;
  }

  return true;
}

module.exports = {
  forceJoin,
  checkJoin
};