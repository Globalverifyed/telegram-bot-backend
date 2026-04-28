async function sendOrEdit(bot, queryOrChatId, text, keyboard) {
  if (typeof queryOrChatId === "object" && queryOrChatId.message) {
    return bot.editMessageText(text, {
      chat_id: queryOrChatId.message.chat.id,
      message_id: queryOrChatId.message.message_id,
      reply_markup: {
        inline_keyboard: keyboard
      }
    }).catch(() => {
      return bot.sendMessage(queryOrChatId.message.chat.id, text, {
        reply_markup: {
          inline_keyboard: keyboard
        }
      });
    });
  }

  return bot.sendMessage(queryOrChatId, text, {
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
}

module.exports = { sendOrEdit };