const { sendOrEdit } = require("./utils");

const cherryDiscountPackages = [
  { name: "1 GB", price: "$1.5 USDT", callback: "cherry_discount_1gb" },
  { name: "2 GB", price: "$3 USDT", callback: "cherry_discount_2gb" },
  { name: "3 GB", price: "$4.5 USDT", callback: "cherry_discount_3gb" },
  { name: "4 GB", price: "$6 USDT", callback: "cherry_discount_4gb" },
  { name: "5 GB", price: "$7.5 USDT", callback: "cherry_discount_5gb" }
];

const cherryRegularPackages = [
  { name: "1 GB", price: "$1.10", callback: "cherry_regular_1gb" },
  { name: "2 GB", price: "$2.20", callback: "cherry_regular_2gb" },
  { name: "3 GB", price: "$3.30", callback: "cherry_regular_3gb" },
  { name: "4 GB", price: "$4.40", callback: "cherry_regular_4gb" },
  { name: "5 GB", price: "$5.50", callback: "cherry_regular_5gb" },
  { name: "10 GB", price: "$10.50", callback: "cherry_regular_10gb" },
  { name: "15 GB", price: "$16.50", callback: "cherry_regular_15gb" },
  { name: "20 GB", price: "$21.00", callback: "cherry_regular_20gb" }
];

function makeButtons(packages) {
  const btn = [];
  for (let i = 0; i < packages.length; i += 2) {
    btn.push(packages.slice(i, i + 2).map(p => ({
      text: `🟢 ${p.name} - ${p.price}`,
      callback_data: p.callback
    })));
  }
  btn.push([{ text: "⬅️ Back", callback_data: "cherry_proxy" }]);
  return btn;
}

async function handleCherryProxy(bot, query) {
  const data = query.data;

  if (data === "cherry_proxy") {
    await sendOrEdit(bot, query, "🍒 CHerry Proxy", [
      [
        { text: "🔥 Discount", callback_data: "cherry_discount_menu" },
        { text: "💎 Regular", callback_data: "cherry_regular_menu" }
      ],
      [{ text: "⬅️ Back", callback_data: "ip_proxy" }]
    ]);
    return true;
  }

  if (data === "cherry_discount_menu") {
    await sendOrEdit(bot, query, "🔥 Discount Packages", makeButtons(cherryDiscountPackages));
    return true;
  }

  if (data === "cherry_regular_menu") {
    await sendOrEdit(bot, query, "💎 Regular Packages", makeButtons(cherryRegularPackages));
    return true;
  }

  return false;
}

module.exports = { handleCherryProxy };