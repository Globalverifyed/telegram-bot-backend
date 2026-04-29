const { showPaymentMethods } = require("./payment");
const { sendOrEdit } = require("./utils");

const discountPackages = {
  di_5: { label: "5 GB", price: "$3.5", available: false },
  di_6: { label: "6 GB", price: "$3.8", available: false },
  di_6_5: { label: "6.5 GB", price: "$4", available: false },
  di_7_5: { label: "7.5 GB", price: "$5", available: true, best: true, lowStock: true, recommended: true, highlight: "🔥 Best Value" },
  di_8: { label: "8 GB", price: "$5.25", available: false },
  di_8_5: { label: "8.5 GB", price: "$5.50", available: false },
  di_10: { label: "10 GB", price: "$6.5", available: false },
  di_12_5: { label: "12.5 GB", price: "$8.00", available: false },
  di_15: { label: "15 GB", price: "$9.5", available: false },
  di_20: { label: "20 GB", price: "$12.5", available: false },
  di_25: { label: "25 GB", price: "$15.00", available: true, best: true, lowStock: true, recommended: true, highlight: "💎 Most Popular" },
  di_30: { label: "30 GB", price: "$16.75", available: false },
  di_50: { label: "50 GB", price: "$29", available: false },
  di_100: { label: "100 GB", price: "Contact Support", available: true, best: true, lowStock: true, highlight: "👑 Premium" }
};

const regularPackages = {
  r1: { label: "1 GB", price: "$1.20", available: true },
  r2: { label: "2 GB", price: "$2.30", available: true },
  r3: { label: "3 GB", price: "$3.50", available: true },
  r4: { label: "4 GB", price: "$4.60", available: true },
  r5: { label: "5 GB", price: "$5.50", available: true },
  r7_5: { label: "7.5 GB", price: "$8", available: true, best: true, recommended: true, highlight: "🔥 Best Value" },
  r10: { label: "10 GB", price: "$10.50", available: true },
  r12: { label: "12 GB", price: "$12.60", available: true },
  r12_5: { label: "12.5 GB", price: "$13.20", available: true },
  r15: { label: "15 GB", price: "$15.60", available: true },
  r25: { label: "25 GB", price: "$26.50", available: true, best: true, lowStock: true, recommended: true, highlight: "💎 Most Popular" },
  r30: { label: "30 GB", price: "$31.50", available: true },
  r50: { label: "50 GB", price: "$52", available: true },
  r80: { label: "80 GB", price: "$82", available: true },
  r100: { label: "100 GB", price: "$102", available: true, best: true, highlight: "👑 Premium" }
};

function sortPackages(packages) {
  return Object.entries(packages).sort((a, b) => {
    if (a[1].available && !b[1].available) return -1;
    if (!a[1].available && b[1].available) return 1;
    if (a[1].recommended && !b[1].recommended) return -1;
    if (!a[1].recommended && b[1].recommended) return 1;
    if (a[1].best && !b[1].best) return -1;
    if (!a[1].best && b[1].best) return 1;
    return 0;
  });
}

function getButtonText(item) {
  let text = "";

  if (item.recommended) text += "🎯 ";
  else if (item.best) text += "🔥 ";

  text += item.label;

  if (item.available) {
    text += ` - ${item.price} ✅`;
    if (item.lowStock) text += " 🟢 Low Stock";
    if (item.highlight) text += ` | ${item.highlight}`;
  } else {
    text += " ❌ Stock Out";
  }

  return text;
}

function getRecommendedText(packages, typeName) {
  const recommended = Object.values(packages).filter(
    (item) => item.available && item.recommended
  );

  if (recommended.length === 0) return "";

  const lines = recommended
    .map((item) => `🎯 ${item.label} - ${item.price} (${item.highlight || "Recommended"})`)
    .join("\n");

  return `\n\n🔥 Recommended ${typeName} Packages:\n${lines}`;
}

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
          text: getButtonText(item),
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

    if (!pkg.available) {
      await sendOrEdit(
        bot,
        query,
        `❌ ${pkg.label} is currently Stock Out.

Please choose another available package.`,
        [[{ text: "⬅ Back", callback_data: "dataimpulse_menu" }]]
      );

      return true;
    }

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