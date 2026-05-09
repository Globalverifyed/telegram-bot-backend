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

function formatPrice(price) {
  const raw = String(price ?? "").trim();
  if (!raw) return "Contact Support";
  if (!/\d/.test(raw) || /stock out|contact/i.test(raw)) return raw;

  const match = raw.match(/\d+(?:\.\d+)?/);
  if (!match) return raw;

  const amount = Number.parseFloat(match[0]);
  if (Number.isNaN(amount)) return raw;

  const prefix = raw.includes("$") ? "$" : "";
  const suffix = raw.replace(match[0], "").replace("$", "").trim();
  return `${prefix}${amount.toFixed(2)}${suffix ? " " + suffix : ""}`;
}

function getPriceNumber(price) {
  const match = String(price ?? "").match(/\d+(?:\.\d+)?/);
  if (!match) return 0;
  const amount = Number.parseFloat(match[0]);
  return Number.isNaN(amount) ? 0 : amount;
}

module.exports.formatPrice = formatPrice;
module.exports.getPriceNumber = getPriceNumber;
