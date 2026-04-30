const { showProductOptions } = require("./product_options");
const { sendOrEdit } = require("./utils");
const { isAvailable, reduceStock, getStock } = require("./stock_manager");

const PRODUCT_KEY = "proxy_ip";

/* ===================== DISCOUNT PRICE ===================== */
const discountPackages = {
  ip_d_25: { label: "25 IP", price: "$0.79", recommended: true },
  ip_d_50: { label: "50 IP", price: "$1.49" },
  ip_d_100: { label: "100 IP", price: "$2.49", recommended: true },
  ip_d_200: { label: "200 IP", price: "$4.79" },
  ip_d_300: { label: "300 IP", price: "$7.10", recommended: true },
  ip_d_400: { label: "400 IP", price: "$9.47" },
  ip_d_500: { label: "500 IP", price: "$11.90", recommended: true },
  ip_d_1000: { label: "1000 IP", price: "$23.69" },
  ip_d_2000: { label: "2000 IP", price: "$46.50" },
  ip_d_3000: { label: "3000 IP", price: "$69.49" },
  ip_d_4000: { label: "4000 IP", price: "$91.49" },
  ip_d_5000: { label: "5000 IP", price: "$113.49" }
};

/* ===================== REGULAR PRICE ===================== */
const regularPackages = {
  ip_r_25: { label: "25 IP", price: "$2.20", recommended: true },
  ip_r_50: { label: "50 IP", price: "$3.80" },
  ip_r_100: { label: "100 IP", price: "$7", recommended: true },
  ip_r_200: { label: "200 IP", price: "$12" },
  ip_r_300: { label: "300 IP", price: "$18", recommended: true },
  ip_r_400: { label: "400 IP", price: "$23" },
  ip_r_500: { label: "500 IP", price: "$28", recommended: true },
  ip_r_1000: { label: "1000 IP", price: "$55" },
  ip_r_2000: { label: "2000 IP", price: "$107.55" },
  ip_r_3000: { label: "3000 IP", price: "$162.50" },
  ip_r_4000: { label: "4000 IP", price: "$80" },
  ip_r_5000: { label: "5000 IP", price: "$100" }
};

function sortPackages(packages) {
  return Object.entries(packages).sort((a, b) => {
    if (isAvailable(PRODUCT_KEY, a[0]) && !isAvailable(PRODUCT_KEY, b[0])) return -1;
    if (!isAvailable(PRODUCT_KEY, a[0]) && isAvailable(PRODUCT_KEY, b[0])) return 1;

    if (a[1].recommended && !b[1].recommended) return -1;
    if (!a[1].recommended && b[1].recommended) return 1;

    return 0;
  });
}

function getButtonText(key, item) {
  let text = item.recommended ? "❤️ " : "✅ ";
  text += `${item.label}`;

  if (isAvailable(PRODUCT_KEY, key)) {
    text += ` - ${item.price} ✅`;
    if (getStock(PRODUCT_KEY, key) <= 2) text += " 🟢 Low Stock";
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

  return (
    `\n\n🔥 Recommended ${typeName} Packages:\n` +
    recommended.map(([key, item]) => `❤️ ${item.label} - ${item.price}`).join("\n")
  );
}

async function showPackageList(bot, query, packages, typeName) {
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

  buttons.push([{ text: "⬅ Back", callback_data: "order_9proxy_ip" }]);

  await sendOrEdit(
    bot,
    query,
    `🌍 Select 9proxy IP ${typeName} Package${getRecommendedText(packages, typeName)}`,
    buttons
  );
}

/* ===================== HANDLER ===================== */
async function handleProxyIP(bot, query) {
  const data = query.data;

  if (data === "order_9proxy_ip") {
    await sendOrEdit(bot, query, "🌍 Select 9proxy IP Price Type:", [
      [
        { text: "🔥 Discount Price", callback_data: "ip_discount" },
        { text: "💰 Regular Price", callback_data: "ip_regular" }
      ],
      [{ text: "⬅ Back", callback_data: "ip_proxy" }]
    ]);

    return true;
  }

  if (data === "ip_discount") {
    await showPackageList(bot, query, discountPackages, "Discount");
    return true;
  }

  if (data === "ip_regular") {
    await showPackageList(bot, query, regularPackages, "Regular");
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
        [[{ text: "⬅ Back", callback_data: "order_9proxy_ip" }]]
      );

      return true;
    }

    reduceStock(PRODUCT_KEY, data);

    await showProductOptions(bot, query, {
      name: "9proxy IP",
      package: pkg.label,
      price: pkg.price,
      back: "order_9proxy_ip"
    });

    return true;
  }

  return false;
}

module.exports = { handleProxyIP };