const path = require("path");

function getMainButtons() {
  return [
    [
      { text: "🌐 IP/Proxy", callback_data: "ip_proxy" },
      { text: "🔐 BUY VPN", callback_data: "buy_vpn" }
    ],
    [
      { text: "⭐ Premium Subscription", callback_data: "premium_subscription" },
      { text: "📦 Others", callback_data: "others" }
    ],
    [
      { text: "📢 Join Channel", callback_data: "join_channel" },
      { text: "☎ Hotline", callback_data: "hotline" }
    ]
  ];
}

function getDescription() {
  return `🚀 Global Verified Shop | Premium Digital Services 🔥

🌐 Premium Proxy & IP
🔐 Premium VPN
💎 Premium Subscriptions
📦 Digital Services

✅ Fast Delivery
✅ Trusted Service
✅ Easy Payment
✅ Support Available

⏰ Service Time:
11:00 AM — 04:00 AM Daily

👇 Select an option below:`;
}

async function showMainMenu(bot, chatIdOrQuery) {
  const bannerPath = path.join(__dirname, "..", "assets", "banner.png");

  if (typeof chatIdOrQuery === "object" && chatIdOrQuery.message) {
    const chatId = chatIdOrQuery.message.chat.id;
    const messageId = chatIdOrQuery.message.message_id;

    try {
      await bot.deleteMessage(chatId, messageId);
    } catch (err) {
      console.log("Delete menu failed:", err.message);
    }

    return bot.sendPhoto(chatId, bannerPath, {
      caption: getDescription(),
      reply_markup: {
        inline_keyboard: getMainButtons()
      }
    });
  }

  return bot.sendPhoto(chatIdOrQuery, bannerPath, {
    caption: getDescription(),
    reply_markup: {
      inline_keyboard: getMainButtons()
    }
  });
}

module.exports = { showMainMenu };