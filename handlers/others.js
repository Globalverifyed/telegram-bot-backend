const { showMainMenu } = require("./menu");

async function handleOthers(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "others") {
    return bot.sendMessage(chatId, "📦 Others Products", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🤖 Google AI Pro", callback_data: "google_ai_pro" },
            { text: "💬 ChatGPT Go", callback_data: "chatgpt_go" }
          ],
          [
            { text: "🧠 ChatGPT Plus", callback_data: "chatgpt_plus" },
            { text: "🎬 Capcut Pro", callback_data: "capcut_pro" }
          ],
          [
            { text: "✈ Telegram Premium", callback_data: "telegram_premium" },
            { text: "🎨 Canva Pro", callback_data: "canva_pro" }
          ],
          [
            { text: "📺 Amazon Prime", callback_data: "amazon_prime" },
            { text: "🍿 Disney Plus", callback_data: "disney_plus" }
          ],
          [
            { text: "📺 Netflix Premium", callback_data: "netflix_premium" },
            { text: "📧 Outlook Old", callback_data: "outlook_old" }
          ],
          [
            { text: "📩 Hotmail", callback_data: "hotmail" },
            { text: "🎓 EDU Mail (.us)", callback_data: "edu_us" }
          ],
          [
            { text: "🎓 EDU Mail (.US.ORG)", callback_data: "edu_us_org" },
            { text: "📞 Google Voice", callback_data: "product_google_voice" }
          ],
          [
            { text: "📲 TextNow (TN)", callback_data: "product_textnow" },
            { text: "📲 TextFree (TF)", callback_data: "product_textfree" }
          ],
          [
            { text: "📲 TextPlus", callback_data: "product_textplus" },
            { text: "📲 TextTone (TT)", callback_data: "product_texttone" }
          ],
          [
            { text: "☎ Sideline (SL)", callback_data: "product_sideline" },
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

  if (data === "back_main_menu") {
    return showMainMenu(bot, query);
  }

  return false;
}

module.exports = {
  handleOthers
};