const { showProductOptions } = require("./product_options");
const { sendOrEdit } = require("./utils");
const { isAvailable } = require("./stock_manager");

const PRODUCT_KEY = "proxy_gb";

/* ===== DISCOUNT ===== */
const discountPackages = {
  gb_d_1: { label: "1GB", price: "$1.00" },
  gb_d_2: { label: "2GB", price: "$2.00" },
  gb_d_3: { label: "3GB", price: "$3.00" },
  gb_d_5: { label: "5GB", price: "$5.00" },
  gb_d_10: { label: "10GB", price: "$10.00" },
  gb_d_15: { label: "15GB", price: "$15.00" },
  gb_d_20: { label: "20GB", price: "$20.00" }
};

/* ===== REGULAR ===== */
const regularPackages = {
  gb_r_1: { label: "1GB", price: "$1.25" },
  gb_r_2: { label: "2GB", price: "$2.50" },
  gb_r_3: { label: "3GB", price: "$3.75" },
  gb_r_5: { label: "5GB", price: "$6.00" },
  gb_r_10: { label: "10GB", price: "$12.00" },
  gb_r_15: { label: "15GB", price: "$18.00" },
  gb_r_20: { label: "20GB", price: "$24.00" }
};

function buildButtons(packages) {
  const entries = Object.entries(packages);
  const rows = [];

  for (let i = 0; i < entries.length; i += 2) {
    rows.push(
      entries.slice(i, i + 2).map(([key, item]) => ({
        text: isAvailable(PRODUCT_KEY, key)
          ? `${item.label} - ${item.price} ✅`
          : `${item.label} ❌`,
        callback_data: key
      }))
    );
  }

  return rows;
}

async function handleProxyGB(bot, query) {
  const data = query.data;

  if (data === "order_9proxy_gb") {
    await sendOrEdit(bot, query, "📦 Select 9proxy GB Type:", [
      [
        { text: "🔥 Discount Price", callback_data: "gb_discount" },
        { text: "💰 Regular Price", callback_data: "gb_regular" }
      ],
      [{ text: "⬅️ Back", callback_data: "ip_proxy" }]
    ]);
    return true;
  }

  if (data === "gb_discount") {
    const buttons = buildButtons(discountPackages);
    buttons.push([{ text: "⬅️ Back", callback_data: "order_9proxy_gb" }]);

    await sendOrEdit(bot, query, "🔥 Discount Packages:", buttons);
    return true;
  }

  if (data === "gb_regular") {
    const buttons = buildButtons(regularPackages);
    buttons.push([{ text: "⬅️ Back", callback_data: "order_9proxy_gb" }]);

    await sendOrEdit(bot, query, "💰 Regular Packages:", buttons);
    return true;
  }

  const all = { ...discountPackages, ...regularPackages };

  if (all[data]) {
    if (!isAvailable(PRODUCT_KEY, data)) {
      await sendOrEdit(bot, query, "❌ Stock Out", [
        [{ text: "⬅️ Back", callback_data: "order_9proxy_gb" }]
      ]);
      return true;
    }

    const pkg = all[data];

    await showProductOptions(bot, query, {
      productKey: PRODUCT_KEY,
      itemKey: data,
      name: "9proxy GB",
      package: pkg.label,
      price: pkg.price,
      back: "order_9proxy_gb"
    });

    return true;
  }

  return false;
}

module.exports = { handleProxyGB };