const { showPaymentMethods } = require("./payment");
const { sendOrEdit } = require("./utils");
const { isAvailable, reduceStock } = require("./stock_manager");

/* ===================== SWIFT PROXY PACKAGES ===================== */

const swiftPackages = {
  sw1: { label: "1 GB", price: "$1.10" },
  sw2: { label: "2 GB", price: "$2.20" },
  sw3: { label: "3 GB", price: "$3.30" },
  sw5: { label: "5 GB", price: "$5.49" },
  sw10: { label: "10 GB", price: "$10.80" },
  sw15: { label: "15 GB", price: "$16.00" },
  sw20: { label: "20 GB", price: "$21.00" }
};

const PRODUCT_KEY = "swift_proxy";

function getButtonText(key, item) {
  if (isAvailable(PRODUCT_KEY, key)) {
    return `🚀 ${item.label} - ${item.price} ✅`;
  }

  return `🚀 ${item.label} ❌ Stock Out`;
}

async function handleSwiftProxy(bot, query) {
  const data = query.data;
  const chatId = query.message.chat.id;

  if (data === "swift_proxy") {
    const entries = Object.entries(swiftPackages);
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

    await sendOrEdit(bot, query, "🚀 Select Swift Proxy Package:", buttons);
    return true;
  }

  if (swiftPackages[data]) {
    const pkg = swiftPackages[data];

    if (!isAvailable(PRODUCT_KEY, data)) {
      await sendOrEdit(
        bot,
        query,
        `❌ ${pkg.label} is currently Stock Out.

Please choose another available package.`,
        [[{ text: "⬅ Back", callback_data: "swift_proxy" }]]
      );

      return true;
    }

    reduceStock(PRODUCT_KEY, data);

    await showPaymentMethods(bot, chatId, {
      name: "Swift Proxy",
      package: pkg.label,
      price: pkg.price,
      back: "swift_proxy"
    });

    return true;
  }

  return false;
}

module.exports = {
  handleSwiftProxy
};