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

💡 Want to boost your online power?
⚡ Cheap, fast, and 100% reliable services all in one place!

🛒 What we offer:
🌐 Premium Proxy & IP
🔐 Premium VPN
💎 Premium Subscriptions
📦 Digital Services

━━━━━━━━━━━━━━━

🔥 Why choose us?

✅ Ultra Fast Delivery ⚡
✅ 100% Trusted & Verified Service 🔐
✅ Affordable Price 💰
✅ Instant Support System 🤝
✅ Auto Order System 🚀

━━━━━━━━━━━━━━━

⏰ Service Time:
🕚 11:00 AM — 04:00 AM Daily

━━━━━━━━━━━━━━━

👇 নিচের button থেকে service select করুন`;
}

async function showMainMenu(bot, chatIdOrQuery) {
  const bannerPath = path.join(__dirname, "..", "assets", "banner.png");

  // /start হলে new photo send করবে
  if (typeof chatIdOrQuery !== "object") {
    return bot.sendPhoto(chatIdOrQuery, bannerPath, {
      caption: getDescription(),
      reply_markup: {
        inline_keyboard: getMainButtons()
      }
    });
  }

  // Back button হলে নতুন করে main menu photo পাঠাবে
  const chatId = chatIdOrQuery.message.chat.id;

  return bot.sendPhoto(chatId, bannerPath, {
    caption: getDescription(),
    reply_markup: {
      inline_keyboard: getMainButtons()
    }
  });
}

module.exports = { showMainMenu };