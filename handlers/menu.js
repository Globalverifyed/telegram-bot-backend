function showMainMenu(bot, chatId) {
  bot.sendMessage(chatId, "🚀 Welcome! Select an option:", {
    reply_markup: {
      inline_keyboard: [
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
      ]
    }
  });
}

module.exports = { showMainMenu };