const { sendOrEdit } = require("./utils");

const iprocketDiscountPackages = [
  { name: "2 GB", price: "$1.60 USDT", callback: "iprocket_discount_2gb" },
  { name: "4 GB", price: "$3.20 USDT", callback: "iprocket_discount_4gb" },
  { name: "6 GB", price: "$4.80 USDT", callback: "iprocket_discount_6gb" },
  { name: "8 GB", price: "$6.40 USDT", callback: "iprocket_discount_8gb" },
  { name: "10 GB", price: "$8.00 USDT", callback: "iprocket_discount_10gb" }
];

const iprocketRegularPackages = [
  { name: "2 GB", price: "$2.00", callback: "iprocket_regular_2gb" },
  { name: "4 GB", price: "$4.00", callback: "iprocket_regular_4gb" },
  { name: "6 GB", price: "$6.00", callback: "iprocket_regular_6gb" },
  { name: "8 GB", price: "$8.00", callback: "iprocket_regular_8gb" },
  { name: "10 GB", price: "$10.00", callback: "iprocket_regular_10gb" },
  { name: "16 GB", price: "$16.00", callback: "iprocket_regular_16gb" },
  { name: "20 GB", price: "$20.00", callback: "iprocket_regular_20gb" },
  { name: "30 GB", price: "$30.00", callback: "iprocket_regular_30gb" }
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