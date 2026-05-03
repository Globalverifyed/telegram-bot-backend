async function sendOrEdit(bot, queryOrChatId, text, keyboard) {
  if (typeof queryOrChatId === "object" && queryOrChatId.message) {
    const chatId = queryOrChatId.message.chat.id;
    const messageId = queryOrChatId.message.message_id;

    try {
      await bot.editMessageReplyMarkup(
        {
          inline_keyboard: [
            [{ text: "⏳ Loading...", callback_data: "loading" }]
          ]
        },
        {
          chat_id: chatId,
          message_id: messageId
        }
      );
    } catch (err) {
      console.log("Loading animation failed:", err.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

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