const { sendOrEdit } = require("./utils");

const abcDiscountPackages = [
  { name: "1 GB", price: "130 BDT / $1 USDT", callback: "abc_discount_1gb" },
  { name: "2 GB", price: "260 BDT / $2 USDT", callback: "abc_discount_2gb" },
  { name: "3 GB", price: "390 BDT / $3 USDT", callback: "abc_discount_3gb" },
  { name: "4 GB", price: "520 BDT / $4 USDT", callback: "abc_discount_4gb" },
  { name: "5 GB", price: "645 BDT / $5 USDT", callback: "abc_discount_5gb" },
  { name: "10 GB", price: "1235 BDT / $9.5 USDT", callback: "abc_discount_10gb" }
];

const abcRegularPackages = [
  { name: "1 GB", price: "$1.10", callback: "abc_regular_1gb" },
  { name: "2 GB", price: "$2.20", callback: "abc_regular_2gb" },
  { name: "3 GB", price: "$3.30", callback: "abc_regular_3gb" },
  { name: "4 GB", price: "$4.40", callback: "abc_regular_4gb" },
  { name: "5 GB", price: "$5.50", callback: "abc_regular_5gb" },
  { name: "10 GB", price: "$10.50", callback: "abc_regular_10gb" },
  { name: "15 GB", price: "$16.50", callback: "abc_regular_15gb" },
  { name: "20 GB", price: "$21.00", callback: "abc_regular_20gb" }
];

function makePackageButtons(packages) {
  const buttons = [];

  for (let i = 0; i < packages.length; i += 2) {
    const row = packages.slice(i, i + 2).map((pkg) => ({
      text: `🟢 ${pkg.name} - ${pkg.price}`,
      callback_data: pkg.callback
    }));

    buttons.push(row);
  }

  buttons.push([{ text: "⬅️ Back", callback_data: "abc_proxy" }]);

  return buttons;
}

async function handleABCProxy(bot, query) {
  const data = query.data;

  if (data === "abc_proxy") {
    await sendOrEdit(bot, query, "🌐 ABC Proxy\n\nPlease select price type:", [
      [
        { text: "🔥 Discount Price", callback_data: "abc_discount_menu" },
        { text: "💎 Regular Price", callback_data: "abc_regular_menu" }
      ],
      [
        { text: "⬅️ Back", callback_data: "ip_proxy" }
      ]
    ]);

    return true;
  }

  if (data === "abc_discount_menu") {
    await sendOrEdit(
      bot,
      query,
      "🔥 ABC Proxy Discount Price List\n\nSelect your package:",
      makePackageButtons(abcDiscountPackages)
    );

    return true;
  }

  if (data === "abc_regular_menu") {
    await sendOrEdit(
      bot,
      query,
      "💎 ABC Proxy Regular Price List\n\nSelect your package:",
      makePackageButtons(abcRegularPackages)
    );

    return true;
  }

  return false;
}

module.exports = { handleABCProxy };