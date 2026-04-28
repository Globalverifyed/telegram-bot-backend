const { showPaymentMethods } = require("./payment");

/* ===================== 9 PROXY IP PACKAGES ===================== */

const proxyIPPackages = {
  ip25: { label: "25 IP", price: "$0.85" },
  ip50: { label: "50 IP", price: "$1.69" },
  ip100: { label: "100 IP", price: "$3.35" },
  ip200: { label: "200 IP", price: "$6.49" },
  ip300: { label: "300 IP", price: "$9.59" },
  ip500: { label: "500 IP", price: "$14.99" },
  ip1000: { label: "1000 IP", price: "$27.99" }
};

const selectedProxyIP = {};

const accountTypes = {
  old_account: "OLD Account",
  new_account: "New Account",
  redeem_code: "Redeem Code"
};

async function handleProxyIP(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "order_9proxy_ip") {
    const entries = Object.entries(proxyIPPackages);
    const buttons = [];

    for (let i = 0; i < entries.length; i += 2) {
      const row = entries.slice(i, i + 2).map(([key, item]) => ({
        text: `🌍 ${item.label} - ${item.price}`,
        callback_data: key
      }));

      buttons.push(row);
    }

    buttons.push([{ text: "⬅ Back", callback_data: "ip_proxy" }]);

    await bot.sendMessage(chatId, "🌍 Select 9proxy IP Package:", {
      reply_markup: {
        inline_keyboard: buttons
      }
    });

    return true;
  }

  if (proxyIPPackages[data]) {
    const pkg = proxyIPPackages[data];

    selectedProxyIP[chatId] = {
      name: "9proxy IP",
      package: pkg.label,
      price: pkg.price,
      back: "order_9proxy_ip"
    };

    await bot.sendMessage(
      chatId,
      `✅ Selected 9proxy IP\n\n📦 Package: ${pkg.label}\n💰 Price: ${pkg.price}\n\nNow select account type:`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "👴 OLD Account", callback_data: "old_account" },
              { text: "🆕 New Account", callback_data: "new_account" }
            ],
            [
              { text: "🎟 Redeem Code", callback_data: "redeem_code" }
            ],
            [
              { text: "⬅ Back", callback_data: "order_9proxy_ip" }
            ]
          ]
        }
      }
    );

    return true;
  }

  if (accountTypes[data]) {
    const order = selectedProxyIP[chatId];

    if (!order) {
      await bot.sendMessage(chatId, "⚠️ Please select a 9proxy IP package first.");
      return true;
    }

    await showPaymentMethods(bot, chatId, {
      ...order,
      accountType: accountTypes[data]
    });

    delete selectedProxyIP[chatId];
    return true;
  }

  return false;
}

module.exports = {
  handleProxyIP
};