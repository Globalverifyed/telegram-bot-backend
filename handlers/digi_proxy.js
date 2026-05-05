const { sendOrEdit } = require("./utils");

const digiDiscountPackages = [
  { name: "1 GB", price: "$3.00 USDT", callback: "digi_discount_1gb" },
  { name: "2 GB", price: "$6.00 USDT", callback: "digi_discount_2gb" },
  { name: "3 GB", price: "$8.50 USDT", callback: "digi_discount_3gb" },
  { name: "4 GB", price: "$11.50 USDT", callback: "digi_discount_4gb" },
  { name: "5 GB", price: "$14.50 USDT", callback: "digi_discount_5gb" }
];

const digiRegularPackages = [
  { name: "1 GB", price: "$3.50", callback: "digi_regular_1gb" },
  { name: "2 GB", price: "$7.00", callback: "digi_regular_2gb" },
  { name: "3 GB", price: "$10.50", callback: "digi_regular_3gb" },
  { name: "4 GB", price: "$13.50", callback: "digi_regular_4gb" },
  { name: "5 GB", price: "$16.50", callback: "digi_regular_5gb" },
  { name: "10 GB", price: "$32.00", callback: "digi_regular_10gb" },
  { name: "15 GB", price: "$49.00", callback: "digi_regular_15gb" },
  { name: "20 GB", price: "$62.00", callback: "digi_regular_20gb" }
];

function makeButtons(packages) {
  const btn = [];
  for (let i = 0; i < packages.length; i += 2) {
    btn.push(packages.slice(i, i + 2).map(p => ({
      text: `🟢 ${p.name} - ${p.price}`,
      callback_data: p.callback
    })));
  }
  btn.push([{ text: "⬅️ Back", callback_data: "digi_proxy" }]);
  return btn;
}

async function handleDigiProxy(bot, query) {
  const data = query.data;

  if (data === "digi_proxy") {
    await sendOrEdit(bot, query, "📡 Digi Proxy", [
      [
        { text: "🔥 Discount", callback_data: "digi_discount_menu" },
        { text: "💎 Regular", callback_data: "digi_regular_menu" }
      ],
      [{ text: "⬅️ Back", callback_data: "ip_proxy" }]
    ]);
    return true;
  }

  if (data === "digi_discount_menu") {
    await sendOrEdit(bot, query, "🔥 Discount Packages", makeButtons(digiDiscountPackages));
    return true;
  }

  if (data === "digi_regular_menu") {
    await sendOrEdit(bot, query, "💎 Regular Packages", makeButtons(digiRegularPackages));
    return true;
  }

  return false;
}

module.exports = { handleDigiProxy };