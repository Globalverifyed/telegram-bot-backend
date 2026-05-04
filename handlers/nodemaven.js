const { sendOrEdit } = require("./utils");

const nodemavenDiscountPackages = [
  { name: "1 GB", price: "$4.20 USDT", callback: "nodemaven_discount_1gb" },
  { name: "2 GB", price: "$8.40 USDT", callback: "nodemaven_discount_2gb" },
  { name: "3 GB", price: "$12.50 USDT", callback: "nodemaven_discount_3gb" },
  { name: "4 GB", price: "$16.00 USDT", callback: "nodemaven_discount_4gb" },
  { name: "5 GB", price: "$20.00 USDT", callback: "nodemaven_discount_5gb" }
];

const nodemavenRegularPackages = [
  { name: "1 GB", price: "$4.50", callback: "nodemaven_regular_1gb" },
  { name: "2 GB", price: "$9.00", callback: "nodemaven_regular_2gb" },
  { name: "3 GB", price: "$13.50", callback: "nodemaven_regular_3gb" },
  { name: "4 GB", price: "$17.50", callback: "nodemaven_regular_4gb" },
  { name: "5 GB", price: "$21.00", callback: "nodemaven_regular_5gb" },
  { name: "10 GB", price: "$41.00", callback: "nodemaven_regular_10gb" },
  { name: "15 GB", price: "$62.00", callback: "nodemaven_regular_15gb" },
  { name: "20 GB", price: "$82.00", callback: "nodemaven_regular_20gb" }
];

function makePackageButtons(packages) {
  const buttons = [];

  for (let i = 0; i < packages.length; i += 2) {
    buttons.push(
      packages.slice(i, i + 2).map((pkg) => ({
        text: `🟢 ${pkg.name} - ${pkg.price}`,
        callback_data: pkg.callback
      }))
    );
  }

  buttons.push([{ text: "⬅️ Back", callback_data: "nodemaven" }]);

  return buttons;
}

async function handleNodemaven(bot, query) {
  const data = query.data;

  if (data === "nodemaven") {
    await sendOrEdit(bot, query, "🌐 Nodemaven\n\nPlease select price type:", [
      [
        { text: "🔥 Discount Price", callback_data: "nodemaven_discount_menu" },
        { text: "💎 Regular Price", callback_data: "nodemaven_regular_menu" }
      ],
      [
        { text: "⬅️ Back", callback_data: "ip_proxy" }
      ]
    ]);

    return true;
  }

  if (data === "nodemaven_discount_menu") {
    await sendOrEdit(
      bot,
      query,
      "🔥 Nodemaven Discount Price List\n\nSelect your package:",
      makePackageButtons(nodemavenDiscountPackages)
    );

    return true;
  }

  if (data === "nodemaven_regular_menu") {
    await sendOrEdit(
      bot,
      query,
      "💎 Nodemaven Regular Price List\n\nSelect your package:",
      makePackageButtons(nodemavenRegularPackages)
    );

    return true;
  }

  return false;
}

module.exports = { handleNodemaven };