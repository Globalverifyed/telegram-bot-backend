const { showPaymentMethods } = require("./payment");

/* ===================== 9 PROXY GB PACKAGES ===================== */

const proxyGBPackages = {
  gb1: { label: "1 GB", price: "$0.80" },
  gb2: { label: "2 GB", price: "$1.60" },
  gb3: { label: "3 GB", price: "$2.40" },
  gb5: { label: "5 GB", price: "$3.99" },
  gb10: { label: "10 GB", price: "$7.99" },
  gb15: { label: "15 GB", price: "$11.99" },
  gb20: { label: "20 GB", price: "$15.99" }
};

const selectedProxyGB = {};

const accountTypes = {
  gb_old_account: "OLD Account",
  gb_new_account: "New Account",
  gb_redeem_code: "Redeem Code"
};

async function handleProxyGB(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "order_9proxy_gb") {
    const entries = Object.entries(proxyGBPackages);
    const buttons = [];

    for (let i = 0; i < entries.length; i += 2) {
      const row = entries.slice(i, i + 2).map(([key, item]) => ({
        text: `📦 ${item.label} - ${item.price}`,
        callback_data: key
      }));

      buttons.push(row);
    }

    buttons.push([{ text: "⬅ Back", callback_data: "ip_proxy" }]);

    await bot.sendMessage(chatId, "📦 Select 9proxy GB Package:", {
      reply_markup: {
        inline_keyboard: buttons
      }
    });

    return true;
  }

  if (proxyGBPackages[data]) {
    const pkg = proxyGBPackages[data];

    selectedProxyGB[chatId] = {
      name: "9proxy GB",
      package: pkg.label,
      price: pkg.price,
      back: "order_9proxy_gb"
    };

    await bot.sendMessage(
      chatId,
      `✅ Selected 9proxy GB\n\n📦 Package: ${pkg.label}\n💰 Price: ${pkg.price}\n\nNow select account type:`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "👴 OLD Account", callback_data: "gb_old_account" },
              { text: "🆕 New Account", callback_data: "gb_new_account" }
            ],
            [
              { text: "🎟 Redeem Code", callback_data: "gb_redeem_code" }
            ],
            [
              { text: "⬅ Back", callback_data: "order_9proxy_gb" }
            ]
          ]
        }
      }
    );

    return true;
  }

  if (accountTypes[data]) {
    const order = selectedProxyGB[chatId];

    if (!order) {
      await bot.sendMessage(chatId, "⚠️ Please select a 9proxy GB package first.");
      return true;
    }

    await showPaymentMethods(bot, chatId, {
      ...order,
      accountType: accountTypes[data]
    });

    delete selectedProxyGB[chatId];
    return true;
  }

  return false;
}

module.exports = {
  handleProxyGB
};