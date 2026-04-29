const { showPaymentMethods } = require("./payment");
const { sendOrEdit } = require("./utils");

/* ===================== NICE PROXY STOCK ===================== */
/*
Admin এখানে stock control করবে
Customer stock count দেখবে না
*/

const stockData = {
  np1: 5,
  np2: 5,
  np3: 5,
  np5: 5,
  np10: 5,
  np15: 5,
  np20: 5
};

/* ===================== NICE PROXY PACKAGES ===================== */

const nicePackages = {
  np1: { label: "1 GB", price: "$1.00" },
  np2: { label: "2 GB", price: "$2.00" },
  np3: { label: "3 GB", price: "$3.00" },
  np5: { label: "5 GB", price: "$5.00" },
  np10: { label: "10 GB", price: "$9.50" },
  np15: { label: "15 GB", price: "$14.00" },
  np20: { label: "20 GB", price: "$18.00" }
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
    return `🔥 ${item.label} - ${item.price} ✅`;
  }

  return `🔥 ${item.label} ❌ Stock Out`;
}

/* ===================== HANDLER ===================== */

async function handleNiceProxy(bot, query) {
  const data = query.data;
  const chatId = query.message.chat.id;

  // ===== MENU =====
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

  // ===== PACKAGE SELECT =====
  if (nicePackages[data]) {
    const pkg = nicePackages[data];

    if (!isAvailable(data)) {
      await sendOrEdit(
        bot,
        query,
        `❌ ${pkg.label} is currently Stock Out.

Please choose another available package.`,
        [[{ text: "⬅ Back", callback_data: "nice_proxy" }]]
      );

      return true;
    }

    // 🔥 STOCK REDUCE
    reduceStock(data);

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
  handleNiceProxy,
  stockData
};