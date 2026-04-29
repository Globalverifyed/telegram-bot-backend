const { showPaymentMethods } = require("./payment");
const { sendOrEdit } = require("./utils");
const { isAvailable, reduceStock } = require("./stock_manager");

/* ===================== NICE PROXY PACKAGES ===================== */

const nicePackages = {
  np1: { label: "1 GB", price: "$0.80" },
  np2: { label: "2 GB", price: "$1.60" },
  np3: { label: "3 GB", price: "$2.40" },
  np5: { label: "5 GB", price: "$3.99" },
  np10: { label: "10 GB", price: "$7.99" },
  np15: { label: "15 GB", price: "$11.99" },
  np20: { label: "20 GB", price: "$15.99" }
};

const PRODUCT_KEY = "nice_proxy";

function getButtonText(key, item) {
  if (isAvailable(PRODUCT_KEY, key)) {
    return `🔥 ${item.label} - ${item.price} ✅`;
  }

  return `🔥 ${item.label} ❌ Stock Out`;
}

async function handleNiceProxy(bot, query) {
  const data = query.data;
  const chatId = query.message.chat.id;

  if (data === "nice_proxy") {
    const entries = Object.entries(nicePackages);
    const buttons = [];

    for (let i = 0; i < entries.length; i += 2) {
      buttons.push(
        entries.slice(i, i + 2).map(([key, item]) => ({
          text: getButtonText(key, item),
          callback_data: key
        }))
      );
    }

    buttons.push([{ text: "⬅ Back", callback_data: "ip_proxy" }]);

    await sendOrEdit(bot, query, "🔥 Select Nice Proxy Package:", buttons);
    return true;
  }

  if (nicePackages[data]) {
    const pkg = nicePackages[data];

    if (!isAvailable(PRODUCT_KEY, data)) {
      await sendOrEdit(
        bot,
        query,
        `❌ ${pkg.label} is currently Stock Out.

Please choose another available package.`,
        [[{ text: "⬅ Back", callback_data: "nice_proxy" }]]
      );

      return true;
    }

    reduceStock(PRODUCT_KEY, data);

    await showPaymentMethods(bot, chatId, {
      name: "Nice Proxy",
      package: pkg.label,
      price: pkg.price,
      back: "nice_proxy"
    });

    return true;
  }

  return false;
}

module.exports = {
  handleNiceProxy
};