// src/handlers/forceJoin.js
const path = require("path");
const { CHANNEL_ID, CHANNEL_LINK, ADMIN_CHAT_ID } = require(path.resolve(__dirname, "../../config"));

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
  let chatId, userId;

  if (update.message) {
    chatId = update.message.chat.id;
    userId = update.message.from.id;
  } else if (update.callback_query) {
    chatId = update.callback_query.message.chat.id;
    userId = update.callback_query.from.id;
  } else {
    return false;
  }

  const joined = await checkJoin(bot, userId);

  if (!joined) {
    await bot.sendMessage(
      chatId,
      "🚫 Bot ব্যবহার করতে হলে আগে আমাদের Channel Join করতে হবে!\n\n👇 নিচের Button এ ক্লিক করুন",
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