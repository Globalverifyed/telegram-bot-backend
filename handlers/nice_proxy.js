const { showProductOptions } = require("./product_options");
const { sendOrEdit } = require("./utils");
const { isAvailable, reduceStock } = require("./stock_manager");

const PRODUCT_KEY = "nice_proxy";

/* ===== DISCOUNT PRICE ===== */
const discountPackages = {
  np_d_1: { label: "1 GB", price: "$1.00", recommended: true },
  np_d_2: { label: "2 GB", price: "$2.00" },
  np_d_3: { label: "3 GB", price: "$3.00", recommended: true },
  np_d_4: { label: "4 GB", price: "$4.00" },
  np_d_5: { label: "5 GB", price: "$5.00", recommended: true },
  np_d_10: { label: "10 GB", price: "$10.00" },
  np_d_15: { label: "15 GB", price: "$15.00", recommended: true },
  np_d_20: { label: "20 GB", price: "$20.00" },
  np_d_30: { label: "30 GB", price: "$30.00" },
  np_d_50: { label: "50 GB", price: "$50.00" },
  np_d_80: { label: "80 GB", price: "$80.00" },
  np_d_100: { label: "100 GB", price: "$99.00" }
};

/* ===== REGULAR PRICE ===== */
const regularPackages = {
  np_r_1: { label: "1 GB", price: "$1.25", recommended: true },
  np_r_2: { label: "2 GB", price: "$2.50" },
  np_r_3: { label: "3 GB", price: "$3.75", recommended: true },
  np_r_4: { label: "4 GB", price: "$5.00" },
  np_r_5: { label: "5 GB", price: "$5.20", recommended: true },
  np_r_400: { label: "10 GB", price: "$10.30" },
  np_r_500: { label: "15 GB", price: "$15.20", recommended: true },
  np_r_1000: { label: "20 GB", price: "$20.30" },
  np_r_2000: { label: "30 GB", price: "$31.00" },
  np_r_3000: { label: "50 GB", price: "$52.00" },
  np_r_4000: { label: "80 GB", price: "$83.00" },
  np_r_5000: { label: "100 GB", price: "$102.00" }
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
      [{ text: "⬅ Back", callback_data: "GB_proxy" }]
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