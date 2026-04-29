const { showPaymentMethods } = require("./payment");
const { sendOrEdit } = require("./utils");

/* ===================== SWIFT PROXY STOCK ===================== */
/*
Admin এখানে stock count edit করবে।
Customer stock count দেখবে না।
Stock 0 হলে auto Stock Out হবে।
*/

const stockData = {
  sw1: 5,
  sw2: 5,
  sw3: 5,
  sw5: 5,
  sw10: 5,
  sw15: 5,
  sw20: 5
};

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

/* ===================== HELPERS ===================== */

function getStock(key) {
  return stockData[key] || 0;
}

function isAvailable(key) {
  return getStock(key) > 0;
}

function reduceStock(key) {
  if (stockData[key] && stockData[key] > 0) {
    stockData[key] -= 1;
  }
}

function getButtonText(key, item) {
  if (isAvailable(key)) {
    return `🚀 ${item.label} - ${item.price} ✅`;
  }

  return `🚀 ${item.label} ❌ Stock Out`;
}

/* ===================== HANDLER ===================== */

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

    if (!isAvailable(data)) {
      await sendOrEdit(
        bot,
        query,
        `❌ ${pkg.label} is currently Stock Out.

Please choose another available package.`,
        [[{ text: "⬅ Back", callback_data: "swift_proxy" }]]
      );

      return true;
    }

    // Stock কমবে customer package select করার সময়
    reduceStock(data);

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
  handleSwiftProxy,
  stockData
};