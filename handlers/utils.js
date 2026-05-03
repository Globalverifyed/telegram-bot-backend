async function sendOrEdit(bot, queryOrChatId, text, keyboard) {
  if (typeof queryOrChatId === "object" && queryOrChatId.message) {
    const chatId = queryOrChatId.message.chat.id;
    const messageId = queryOrChatId.message.message_id;

    try {
      await bot.deleteMessage(chatId, messageId);
    } catch (err) {
      console.log("Delete failed:", err.message);
    }

    await bot.sendMessage(chatId, text, {
      reply_markup: {
        inline_keyboard: keyboard
      }
    });

    return true;
  }

  await bot.sendMessage(queryOrChatId, text, {
    reply_markup: {
      inline_keyboard: keyboard
    }
  });

  return true;
}

module.exports = { sendOrEdit };