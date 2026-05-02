const { sendOrEdit } = require("./utils");

function showMainMenu(bot, chatIdOrQuery) {
  return sendOrEdit(bot, chatIdOrQuery, "🚀 Welcome! Select an option:", [
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
  ]);
}

module.exports = { showMainMenu };