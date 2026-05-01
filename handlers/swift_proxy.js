const { showProductOptions } = require("./product_options");
const { sendOrEdit } = require("./utils");
const { isAvailable, reduceStock } = require("./stock_manager");

const PRODUCT_KEY = "swift_proxy";

/* ===== DISCOUNT ===== */
const discountPackages = {
  sw_d_1: { label: "1GB", price: "$1.00" },
  sw_d_2: { label: "2GB", price: "$2.00" },
  sw_d_3: { label: "3GB", price: "$3.00" },
  sw_d_5: { label: "5GB", price: "$5.00" },
  sw_d_10: { label: "10GB", price: "$10.00" },
  sw_d_15: { label: "15GB", price: "$15.00" },
  sw_d_20: { label: "20GB", price: "$20.00" },
  sw_d_25: { label: "25GB", price: "$25.00" },
  sw_d_30: { label: "30GB", price: "$30.00" },
  sw_d_35: { label: "35GB", price: "$35.00" },
  sw_d_50: { label: "50GB", price: "$50.00" },
  sw_d_100: { label: "100GB", price: "$100.00" }
};

/* ===== REGULAR ===== */
const regularPackages = {
  sw_r_1: { label: "1GB", price: "$1.15" },
  sw_r_2: { label: "2GB", price: "$2.30" },
  sw_r_5: { label: "5GB", price: "$5.75" },
  sw_r_10: { label: "10GB", price: "$11.15" },
  sw_r_15: { label: "15GB", price: "$17.25" },
  sw_r_20: { label: "20GB", price: "$23.00" },
  sw_r_25: { label: "25GB", price: "$28.00" },
  sw_r_30: { label: "30GB", price: "$34.50" },
  sw_r_35: { label: "35GB", price: "$40.25" },
  sw_r_50: { label: "50GB", price: "$57.50" },
  sw_r_100: { label: "100GB", price: "$115.00" }
};

function buildButtons(packages) {
  const entries = Object.entries(packages);
  const rows = [];

  for (let i = 0; i < entries.length; i += 2) {
    rows.push(
      entries.slice(i, i + 2).map(([key, item]) => ({
        text: isAvailable(PRODUCT_KEY, key)
          ? `${item.label} - ${item.price} 🟢`
          : `${item.label} ❌`,
        callback_data: key
      }))
    );
  }

  return rows;
}

async function handleSwiftProxy(bot, query) {
  const data = query.data;

  if (data === "swift_proxy") {
    await sendOrEdit(bot, query, "🚀 Select Swift Proxy Type:", [
      [
        { text: "🔥 Discount Price", callback_data: "swift_discount" },
        { text: "💰 Regular Price", callback_data: "swift_regular" }
      ],
      [{ text: "⬅ Back", callback_data: "ip_proxy" }]
    ]);
    return true;
  }

  if (data === "swift_discount") {
    const buttons = buildButtons(discountPackages);
    buttons.push([{ text: "⬅ Back", callback_data: "swift_proxy" }]);

    await sendOrEdit(bot, query, "🔥 Discount Packages:", buttons);
    return true;
  }

  if (data === "swift_regular") {
    const buttons = buildButtons(regularPackages);
    buttons.push([{ text: "⬅ Back", callback_data: "swift_proxy" }]);

    await sendOrEdit(bot, query, "💰 Regular Packages:", buttons);
    return true;
  }

  const all = { ...discountPackages, ...regularPackages };

  if (all[data]) {
    if (!isAvailable(PRODUCT_KEY, data)) {
      await sendOrEdit(bot, query, "❌ Stock Out", [
        [{ text: "⬅ Back", callback_data: "swift_proxy" }]
      ]);
      return true;
    }

    const pkg = all[data];

    reduceStock(PRODUCT_KEY, data);

    await showProductOptions(bot, query, {
      name: "Swift Proxy",
      package: pkg.label,
      price: pkg.price,
      back: "swift_proxy"
    });

    return true;
  }

  return false;
}

module.exports = { handleSwiftProxy };