const { showProductOptions } = require("./product_options");
const { sendOrEdit } = require("./utils");
const { isAvailable, reduceStock } = require("./stock_manager");

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

const PRODUCT_KEY = "proxy_gb";

function getButtonText(key, item) {
  if (isAvailable(PRODUCT_KEY, key)) {
    return `📦 ${item.label} - ${item.price} ✅`;
  }

  return `📦 ${item.label} ❌ Stock Out`;
}

async function handleProxyGB(bot, query) {
  const data = query.data;

  if (data === "order_9proxy_gb") {
    const entries = Object.entries(proxyGBPackages);
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

    await sendOrEdit(bot, query, "📦 Select 9proxy GB Package:", buttons);
    return true;
  }

  if (proxyGBPackages[data]) {
    const pkg = proxyGBPackages[data];

    if (!isAvailable(PRODUCT_KEY, data)) {
      await sendOrEdit(
        bot,
        query,
        `❌ ${pkg.label} is currently Stock Out.

Please choose another available package.`,
        [[{ text: "⬅ Back", callback_data: "order_9proxy_gb" }]]
      );

      return true;
    }

    reduceStock(PRODUCT_KEY, data);

    await showProductOptions(bot, query, {
      name: "9proxy GB",
      package: pkg.label,
      price: pkg.price,
      back: "order_9proxy_gb"
    });

    return true;
  }

  return false;
}

module.exports = {
  handleProxyGB
};