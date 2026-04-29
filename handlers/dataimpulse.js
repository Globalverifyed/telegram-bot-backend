const { showPaymentMethods } = require("./payment");
const { sendOrEdit } = require("./utils");
const { isAvailable, reduceStock, getStock } = require("./stock_manager");

/* ===================== DISCOUNT PACKAGES ===================== */

const discountPackages = {
  di_5: { label: "5 GB", price: "$3.5", best: false },
  di_6: { label: "6 GB", price: "$3.8", best: false },
  di_6_5: { label: "6.5 GB", price: "$4", best: false },
  di_7_5: {
    label: "7.5 GB",
    price: "$5",
    best: true,
    lowStock: true,
    recommended: true,
    highlight: "🔥 Best Value"
  },
  di_8: { label: "8 GB", price: "$5.25", best: false },
  di_8_5: { label: "8.5 GB", price: "$5.50", best: false },
  di_10: { label: "10 GB", price: "$6.5", best: false },
  di_12_5: { label: "12.5 GB", price: "$8.00", best: false },
  di_15: { label: "15 GB", price: "$9.5", best: false },
  di_16: { label: "16 GB", price: "$9.4", best: false },
  di_17_5: { label: "17.5 GB", price: "$11.00", best: false },
  di_20: { label: "20 GB", price: "$12.5", best: false },
  di_25: {
    label: "25 GB",
    price: "$15.00",
    best: true,
    lowStock: true,
    recommended: true,
    highlight: "💎 Most Popular"
  },
  di_30: { label: "30 GB", price: "$16.75", best: false },
  di_50: { label: "50 GB", price: "$29", best: false },
  di_100: {
    label: "100 GB",
    price: "Contact Support",
    best: true,
    lowStock: true,
    recommended: false,
    highlight: "👑 Premium"
  }
};

/* ===================== REGULAR PACKAGES ===================== */

const regularPackages = {
  r1: { label: "1 GB", price: "$1.20" },
  r2: { label: "2 GB", price: "$2.30" },
  r3: { label: "3 GB", price: "$3.50" },
  r4: { label: "4 GB", price: "$4.60" },
  r5: { label: "5 GB", price: "$5.50" },
  r7_5: {
    label: "7.5 GB",
    price: "$8",
    best: true,
    recommended: true,
    highlight: "🔥 Best Value"
  },
  r10: { label: "10 GB", price: "$10.50" },
  r12: { label: "12 GB", price: "$12.60" },
  r12_5: { label: "12.5 GB", price: "$13.20" },
  r15: { label: "15 GB", price: "$15.60" },
  r25: {
    label: "25 GB",
    price: "$26.50",
    best: true,
    lowStock: true,
    recommended: true,
    highlight: "💎 Most Popular"
  },
  r30: { label: "30 GB", price: "$31.50" },
  r50: { label: "50 GB", price: "$52" },
  r80: { label: "80 GB", price: "$82" },
  r100: {
    label: "100 GB",
    price: "$102",
    best: true,
    highlight: "👑 Premium"
  }
};

const PRODUCT_KEY = "dataimpulse";

/* ===================== HELPERS ===================== */

function sortPackages(packages) {
  return Object.entries(packages).sort((a, b) => {
    if (isAvailable(PRODUCT_KEY, a[0]) && !isAvailable(PRODUCT_KEY, b[0])) return -1;
    if (!isAvailable(PRODUCT_KEY, a[0]) && isAvailable(PRODUCT_KEY, b[0])) return 1;

    if (a[1].recommended && !b[1].recommended) return -1;
    if (!a[1].recommended && b[1].recommended) return 1;

    if (a[1].best && !b[1].best) return -1;
    if (!a[1].best && b[1].best) return 1;

    return 0;
  });
}

function getButtonText(key, item) {
  let text = "";

  if (item.recommended) text += "🎯 ";
  else if (item.best) text += "🔥 ";

  text += item.label;

  if (isAvailable(PRODUCT_KEY, key)) {
    text += ` - ${item.price} ✅`;

    if (item.lowStock || getStock(PRODUCT_KEY, key) <= 2) text += " 🟢 Low Stock";
    if (item.highlight) text += ` | ${item.highlight}`;
  } else {
    text += " ❌ Stock Out";
  }

  return text;
}

function getRecommendedText(packages, typeName) {
  const recommended = Object.entries(packages).filter(
    ([key, item]) => isAvailable(PRODUCT_KEY, key) && item.recommended
  );

  if (recommended.length === 0) return "";

  const lines = recommended
    .map(([key, item]) => `🎯 ${item.label} - ${item.price} (${item.highlight || "Recommended"})`)
    .join("\n");

  return `\n\n🔥 Recommended ${typeName} Packages:\n${lines}`;
}

/* ===================== HANDLER ===================== */

async function handleDataImpulse(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "dataimpulse_menu") {
    await sendOrEdit(
      bot,
      query,
      `⚡ DataImpulse Price Type

🔥 Discount Price = Special offer price
💰 Regular Price = Normal official price`,
      [
        [
          { text: "🔥 Discount Price", callback_data: "di_discount" },
          { text: "💰 Regular Price", callback_data: "di_regular" }
        ],
        [{ text: "⬅ Back", callback_data: "ip_proxy" }]
      ]
    );

    return true;
  }

  if (data === "di_discount" || data === "di_regular") {
    const isDiscount = data === "di_discount";
    const packages = isDiscount ? discountPackages : regularPackages;
    const typeName = isDiscount ? "Discount" : "Regular";

    const sorted = sortPackages(packages);
    const buttons = [];

    for (let i = 0; i < sorted.length; i += 2) {
      buttons.push(
        sorted.slice(i, i + 2).map(([key, item]) => ({
          text: getButtonText(key, item),
          callback_data: key
        }))
      );
    }

    buttons.push([{ text: "⬅ Back", callback_data: "dataimpulse_menu" }]);

    await sendOrEdit(
      bot,
      query,
      `⚡ Select DataImpulse ${typeName} Package${getRecommendedText(packages, typeName)}`,
      buttons
    );

    return true;
  }

  const allPackages = { ...discountPackages, ...regularPackages };

  if (allPackages[data]) {
    const pkg = allPackages[data];

    if (!isAvailable(PRODUCT_KEY, data)) {
      await sendOrEdit(
        bot,
        query,
        `❌ ${pkg.label} is currently Stock Out.

Please choose another available package.`,
        [[{ text: "⬅ Back", callback_data: "dataimpulse_menu" }]]
      );

      return true;
    }

    reduceStock(PRODUCT_KEY, data);

    await showPaymentMethods(bot, chatId, {
      name: "DataImpulse",
      package: pkg.label,
      price: pkg.price,
      back: "dataimpulse_menu",
      note: pkg.highlight || "N/A"
    });

    return true;
  }

  return false;
}

module.exports = {
  handleDataImpulse
};