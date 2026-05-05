const { CHANNEL_ID, CHANNEL_LINK } = require("../config");

async function checkJoin(bot, userId) {
  try {
    const member = await bot.getChatMember(CHANNEL_ID, userId);

    return (
      member.status === "member" ||
      member.status === "administrator" ||
      member.status === "creator"
    );
  } catch (err) {
    console.log("Join check error:", err.message);
    return false;
  }
}

async function forceJoin(bot, queryOrMsg) {
  let chatId, userId;

  if (queryOrMsg.message) {
    chatId = queryOrMsg.message.chat.id;
    userId = queryOrMsg.from.id;
  } else {
    chatId = queryOrMsg.chat.id;
    userId = queryOrMsg.from.id;
  }

  const joined = await checkJoin(bot, userId);

  if (!joined) {
    await bot.sendMessage(
      chatId,
      `🚫 You must join our channel to use this bot!

👉 Join from button below 👇`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 Join Channel", url: CHANNEL_LINK }],
            [{ text: "✅ I Joined", callback_data: "check_join" }]
          ]
        }
      }
    );

    return false;
  }

  return true;
}

module.exports = { forceJoin };