const fs = require("fs");
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

async function showMainMenu(bot, chatIdOrQuery) {
  const bannerPath = path.join(__dirname, "..", "assets", "banner.png");

  let chatId;
  let messageId;

  if (typeof chatIdOrQuery === "object" && chatIdOrQuery.message) {
    chatId = chatIdOrQuery.message.chat.id;
    messageId = chatIdOrQuery.message.message_id;

    try {
      await bot.deleteMessage(chatId, messageId);
    } catch (err) {
      console.log("Delete menu failed:", err.message);
    }
  } else {
    chatId = chatIdOrQuery;
  }

  const options = {
    reply_markup: {
      inline_keyboard: getMainButtons()
    }
  };

  // 👉 image থাকলে শুধু image + button
  if (fs.existsSync(bannerPath)) {
    return bot.sendPhoto(chatId, bannerPath, options);
  }

  // 👉 image না থাকলে শুধু button
  return bot.sendMessage(chatId, "👇 Select an option:", options);
}

module.exports = { showMainMenu };