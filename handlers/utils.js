async function sendOrEdit(bot, queryOrChatId, text, keyboard) {
  if (typeof queryOrChatId === "object" && queryOrChatId.message) {
    try {
      await bot.editMessageText(text, {
        chat_id: queryOrChatId.message.chat.id,
        message_id: queryOrChatId.message.message_id,
        reply_markup: { inline_keyboard: keyboard }
      });
    } catch (err) {
      console.log("Edit failed:", err.message);
    }
    return true;
  }

  await bot.sendMessage(queryOrChatId, text, {
    reply_markup: { inline_keyboard: keyboard }
  });

  return true;
}

module.exports = { sendOrEdit };