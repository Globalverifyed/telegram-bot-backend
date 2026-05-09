const { CHANNEL_ID, CHANNEL_LINK } = require("../config");

async function checkJoin(bot, userId) {
  try {
    const member = await bot.getChatMember(CHANNEL_ID, userId);
    return ["member", "administrator", "creator"].includes(member.status);
  } catch (err) {
    console.log("Join check error:", err.message);
    return false;
  }
}

async function forceJoin(bot, update) {
  const msg = update.message  update.callback_query?.message;
  const from = update.from  update.callback_query?.from;

  if (!msg || !from) return false;

  const chatId = msg.chat.id;
  const userId = from.id;

  const joined = await checkJoin(bot, userId);

  if (!joined) {
    await bot.sendMessage(chatId, "🚫 আগে আমাদের Channel Join করুন।\n\nJoin করার পর আবার /start দিন।", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 Join Channel", url: CHANNEL_LINK }]
        ]
      }
    });
    return false;
  }

  return true;
}

module.exports = { forceJoin, checkJoin };