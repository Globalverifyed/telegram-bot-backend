const { sendOrEdit } = require("./utils");

const iprocketDiscountPackages = [
  { name: "1 GB", price: "$1.5 USDT", callback: "iprocket_discount_1gb" },
  { name: "2 GB", price: "$3 USDT", callback: "iprocket_discount_2gb" },
  { name: "3 GB", price: "$4.5 USDT", callback: "iprocket_discount_3gb" },
  { name: "4 GB", price: "$6 USDT", callback: "iprocket_discount_4gb" },
  { name: "5 GB", price: "$7.5 USDT", callback: "iprocket_discount_5gb" }
];

const iprocketRegularPackages = [
  { name: "1 GB", price: "$1.10", callback: "iprocket_regular_1gb" },
  { name: "2 GB", price: "$2.20", callback: "iprocket_regular_2gb" },
  { name: "3 GB", price: "$3.30", callback: "iprocket_regular_3gb" },
  { name: "4 GB", price: "$4.40", callback: "iprocket_regular_4gb" },
  { name: "5 GB", price: "$5.50", callback: "iprocket_regular_5gb" },
  { name: "10 GB", price: "$10.50", callback: "iprocket_regular_10gb" },
  { name: "15 GB", price: "$16.50", callback: "iprocket_regular_15gb" },
  { name: "20 GB", price: "$21.00", callback: "iprocket_regular_20gb" }
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

  buttons.push([{ text: "⬅️ Back", callback_data: "iprocket_proxy" }]);

  return buttons;
}

async function handleIpRocketProxy(bot, query) {
  const data = query.data;

  if (data === "iprocket_proxy") {
    await sendOrEdit(bot, query, "🌐 IpRocket Proxy\n\nPlease select price type:", [
      [
        { text: "🔥 Discount Price", callback_data: "iprocket_discount_menu" },
        { text: "💎 Regular Price", callback_data: "iprocket_regular_menu" }
      ],
      [
        { text: "⬅️ Back", callback_data: "ip_proxy" }
      ]
    ]);

    return true;
  }

  if (data === "iprocket_discount_menu") {
    await sendOrEdit(
      bot,
      query,
      "🔥 IpRocket Proxy Discount Price List\n\nSelect your package:",
      makePackageButtons(iprocketDiscountPackages)
    );

    return true;
  }

  if (data === "iprocket_regular_menu") {
    await sendOrEdit(
      bot,
      query,
      "💎 IpRocket Proxy Regular Price List\n\nSelect your package:",
      makePackageButtons(iprocketRegularPackages)
    );

    return true;
  }

  return false;
}

module.exports = { handleIpRocketProxy };