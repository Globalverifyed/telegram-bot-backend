const { showMainMenu } = require("./menu");

async function handleOthers(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "others") {
    return bot.sendMessage(chatId, "📦 Others Products", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🤖 Google AI Pro", callback_data: "google_ai_pro_1m" },
            { text: "💬 ChatGPT Go", callback_data: "chatgpt_go_10m" }
          ],
          [
            { text: "🧠 ChatGPT Plus", callback_data: "chatgpt_plus_1m" },
            { text: "🎬 Capcut Pro", callback_data: "capcut_pro_1m" }
          ],
          [
            { text: "✈ Telegram Premium", callback_data: "telegram_premium_menu" },
            { text: "🎨 Canva Pro", callback_data: "canva_pro_menu" }
          ],
          [
            { text: "📺 Amazon Prime", callback_data: "amazon_prime_1m" },
            { text: "🍿 Disney Plus", callback_data: "disney_plus_1m" }
          ],
          [
            { text: "📺 Netflix Premium", callback_data: "netflix_menu" },
            { text: "📧 Outlook Old", callback_data: "outlook_menu" }
          ],
          [
            { text: "📩 Hotmail", callback_data: "hotmail_menu" },
            { text: "🎓 EDU Mail (.us)", callback_data: "edu_us_menu" }
          ],
          [
            { text: "🎓 EDU Mail (.US.ORG)", callback_data: "edu_us_org_menu" },
            { text: "📞 Google Voice", callback_data: "google_voice_menu" }
          ],
          [
            { text: "📲 TextNow (TN)", callback_data: "textnow_menu" },
            { text: "📲 TextFree (TF)", callback_data: "textfree_menu" }
          ],
          [
            { text: "📲 TextPlus", callback_data: "textplus_menu" },
            { text: "📲 TextTone (TT)", callback_data: "texttone_menu" }
          ],
          [
            { text: "☎ Sideline (SL)", callback_data: "sideline_menu" },
            { text: "💬 Hitmess", callback_data: "hitmess" }
          ],
          [
            { text: "📱 IPLUM Premium", callback_data: "iplum_premium" },
            { text: "✨ Magic App", callback_data: "magic_app" }
          ],
          [
            { text: "⬅ Back", callback_data: "back_main_menu" }
          ]
        ]
      }
    });
  }

  if (data === "telegram_premium_menu") {
    return bot.sendMessage(chatId, "✈ Telegram Premium", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "1 Month - $12 ❌ Stock Out", callback_data: "telegram_premium_1m" }],
          [{ text: "3 Month - $16", callback_data: "telegram_premium_3m" }],
          [{ text: "6 Month - $22", callback_data: "telegram_premium_6m" }],
          [{ text: "12 Month - $36", callback_data: "telegram_premium_12m" }],
          [{ text: "⬅ Back", callback_data: "others" }]
        ]
      }
    });
  }

  if (data === "canva_pro_menu") {
    return bot.sendMessage(chatId, "🎨 Canva Pro", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "1 Month - $0.30", callback_data: "canva_pro_1m" }],
          [{ text: "3 Month - $0.50", callback_data: "canva_pro_3m" }],
          [{ text: "6 Month - $1", callback_data: "canva_pro_6m" }],
          [{ text: "12 Month - $2", callback_data: "canva_pro_12m" }],
          [{ text: "⬅ Back", callback_data: "others" }]
        ]
      }
    });
  }

  if (data === "netflix_menu") {
    return bot.sendMessage(chatId, "📺 Netflix Premium Personal", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "1 Month - $6.50", callback_data: "netflix_1m" }],
          [{ text: "3 Month - $15", callback_data: "netflix_3m" }],
          [{ text: "6 Month - $25", callback_data: "netflix_6m" }],
          [{ text: "⬅ Back", callback_data: "others" }]
        ]
      }
    });
  }

  if (data === "outlook_menu") {
    return bot.sendMessage(chatId, "📧 Outlook Mail Old", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "PS25 - $1.99", callback_data: "outlook_old_25" }],
          [{ text: "PS50 - $3.49", callback_data: "outlook_old_50" }],
          [{ text: "⬅ Back", callback_data: "others" }]
        ]
      }
    });
  }

  if (data === "hotmail_menu") {
    return bot.sendMessage(chatId, "📩 Hotmail", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "PS25 - $1.99", callback_data: "hotmail_25" }],
          [{ text: "PS50 - $3.49", callback_data: "hotmail_50" }],
          [{ text: "⬅ Back", callback_data: "others" }]
        ]
      }
    });
  }

  if (data === "edu_us_menu") {
    return bot.sendMessage(chatId, "🎓 EDU Mail (.us)", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "10 Mail - $1.99", callback_data: "edu_us_10" }],
          [{ text: "25 Mail - $4.90", callback_data: "edu_us_25" }],
          [{ text: "⬅ Back", callback_data: "others" }]
        ]
      }
    });
  }

  if (data === "edu_us_org_menu") {
    return bot.sendMessage(chatId, "🎓 EDU Mail (.US.ORG)", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "10 Mail - $1.99", callback_data: "edu_us_org_10" }],
          [{ text: "25 Mail - $4.90", callback_data: "edu_us_org_25" }],
          [{ text: "⬅ Back", callback_data: "others" }]
        ]
      }
    });
  }

  if (data === "google_voice_menu") {
    return bot.sendMessage(chatId, "📞 Google Voice Accounts", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "New Account - $3", callback_data: "google_voice_new" }],
          [{ text: "Old Account - $6", callback_data: "google_voice_old" }],
          [{ text: "⬅ Back", callback_data: "others" }]
        ]
      }
    });
  }

  if (data === "textnow_menu") {
    return bot.sendMessage(chatId, "📲 TextNow (TN)", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Web Login - $2", callback_data: "textnow_web" }],
          [{ text: "Phone Login - $1", callback_data: "textnow_phone" }],
          [{ text: "⬅ Back", callback_data: "others" }]
        ]
      }
    });
  }

  if (data === "textfree_menu") {
    return bot.sendMessage(chatId, "📲 TextFree (TF)", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Web Login - $2", callback_data: "textfree_web" }],
          [{ text: "Phone Login - $1", callback_data: "textfree_phone" }],
          [{ text: "⬅ Back", callback_data: "others" }]
        ]
      }
    });
  }

  if (data === "textplus_menu") {
    return bot.sendMessage(chatId, "📲 TextPlus", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Web Login - $2", callback_data: "textplus_web" }],
          [{ text: "Phone Login - $1", callback_data: "textplus_phone" }],
          [{ text: "⬅ Back", callback_data: "others" }]
        ]
      }
    });
  }

  if (data === "Talkatone_menu") {
    return bot.sendMessage(chatId, "📲 Talkatone (TT)", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Web Login - $2", callback_data: "texttone_web" }],
          [{ text: "Phone Login - $1", callback_data: "texttone_phone" }],
          [{ text: "⬅ Back", callback_data: "others" }]
        ]
      }
    });
  }

  if (data === "sideline_menu") {
    return bot.sendMessage(chatId, "☎ Sideline (SL)", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Web Login - $2", callback_data: "sideline_web" }],
          [{ text: "Phone Login - $1", callback_data: "sideline_phone" }],
          [{ text: "⬅ Back", callback_data: "others" }]
        ]
      }
    });
  }

  if (data === "back_main_menu") {
    return showMainMenu(bot, query);
  }

  return false;
}

module.exports = {
  handleOthers
};