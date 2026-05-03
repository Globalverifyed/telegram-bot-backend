const { showProductOptions } = require("./product_options");
const { sendOrEdit } = require("./utils");
const { isAvailable, reduceStock } = require("./stock_manager");

const PRODUCT_KEY = "nice_proxy";

/* ===== DISCOUNT PRICE ===== */
const discountPackages = {
  np_d_25: { label: "25 IP", price: "$0.79", recommended: true },
  np_d_50: { label: "50 IP", price: "$1.49" },
  np_d_100: { label: "100 IP", price: "$2.49", recommended: true },
  np_d_200: { label: "200 IP", price: "$4.79" },
  np_d_300: { label: "300 IP", price: "$7.10", recommended: true },
  np_d_400: { label: "400 IP", price: "$9.47" },
  np_d_500: { label: "500 IP", price: "$11.90", recommended: true },
  np_d_1000: { label: "1000 IP", price: "$23.69" },
  np_d_2000: { label: "2000 IP", price: "$46.50" },
  np_d_3000: { label: "3000 IP", price: "$69.49" },
  np_d_4000: { label: "4000 IP", price: "$91.49" },
  np_d_5000: { label: "5000 IP", price: "$113.49" }
};

/* ===== REGULAR PRICE ===== */
const regularPackages = {
  np_r_25: { label: "25 IP", price: "$2.20", recommended: true },
  np_r_50: { label: "50 IP", price: "$3.80" },
  np_r_100: { label: "100 IP", price: "$7.00", recommended: true },
  np_r_200: { label: "200 IP", price: "$12.00" },
  np_r_300: { label: "300 IP", price: "$18.00", recommended: true },
  np_r_400: { label: "400 IP", price: "$23.00" },
  np_r_500: { label: "500 IP", price: "$28.00", recommended: true },
  np_r_1000: { label: "1000 IP", price: "$55.00" },
  np_r_2000: { label: "2000 IP", price: "$107.55" },
  np_r_3000: { label: "3000 IP", price: "$162.50" },
  np_r_4000: { label: "4000 IP", price: "$208.00" },
  np_r_5000: { label: "5000 IP", price: "$260.00" }
};

function buildButtons(packages) {
  const entries = Object.entries(packages);
  const rows = [];

  for (let i = 0; i < entries.length; i += 2) {
    rows.push(
      entries.slice(i, i + 2).map(([key, item]) => {
        const icon = item.recommended ? "❤️" : "✅";

        return {
          text: isAvailable(PRODUCT_KEY, key)
            ? `${icon} ${item.label} - ${item.price} 🟢`
            : `${item.label} ❌ Stock Out`,
          callback_data: key
        };
      })
    );
  }

  return rows;
}

async function handleNiceProxy(bot, query) {
  const data = query.data;

  if (data === "nice_proxy") {
    await sendOrEdit(bot, query, "🔥 Select Nice Proxy Type:", [
      [
        { text: "🔥 Discount Price", callback_data: "nice_discount" },
        { text: "💰 Regular Price", callback_data: "nice_regular" }
      ],
      [{ text: "⬅ Back", callback_data: "ip_proxy" }]
    ]);

    return true;
  }

  if (data === "nice_discount") {
    const buttons = buildButtons(discountPackages);
    buttons.unshift([{ text: "🔥 Discount Packages", callback_data: "no_action" }]);
    buttons.push([{ text: "⬅ Back", callback_data: "nice_proxy" }]);

    await sendOrEdit(bot, query, "🔥 Nice Proxy Discount Packages:", buttons);
    return true;
  }

  if (data === "nice_regular") {
    const buttons = buildButtons(regularPackages);
    buttons.unshift([{ text: "💰 Regular Packages", callback_data: "no_action" }]);
    buttons.push([{ text: "⬅ Back", callback_data: "nice_proxy" }]);

    await sendOrEdit(bot, query, "💰 Nice Proxy Regular Packages:", buttons);
    return true;
  }

  const all = { ...discountPackages, ...regularPackages };

  if (all[data]) {
    const pkg = all[data];

    if (!isAvailable(PRODUCT_KEY, data)) {
      await sendOrEdit(bot, query, "❌ Stock Out", [
        [{ text: "⬅ Back", callback_data: "nice_proxy" }]
      ]);
      return true;
    }

    reduceStock(PRODUCT_KEY, data);

    await showProductOptions(bot, query, {
      name: "Nice Proxy",
      package: pkg.label,
      price: pkg.price,
      back: "nice_proxy"
    });

    return true;
  }

  return false;
}

module.exports = { handleNiceProxy };