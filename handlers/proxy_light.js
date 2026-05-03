const { sendOrEdit } = require("./utils");

const proxyLightDiscountPackages = [
  { name: "1 GB", price: "$3.50 USDT", callback: "proxy_light_discount_1gb" },
  { name: "2 GB", price: "$7.00 USDT", callback: "proxy_light_discount_2gb" },
  { name: "3 GB", price: "$10.50 USDT", callback: "proxy_light_discount_3gb" },
  { name: "4 GB", price: "$14.00 USDT", callback: "proxy_light_discount_4gb" },
  { name: "5 GB", price: "$17.50 USDT", callback: "proxy_light_discount_5gb" }
];

const proxyLightRegularPackages = [
  { name: "1 GB", price: "$4.50", callback: "proxy_light_regular_1gb" },
  { name: "2 GB", price: "$8.50", callback: "proxy_light_regular_2gb" },
  { name: "3 GB", price: "$13.00", callback: "proxy_light_regular_3gb" },
  { name: "4 GB", price: "$16.50", callback: "proxy_light_regular_4gb" },
  { name: "5 GB", price: "$19.50", callback: "proxy_light_regular_5gb" },
  { name: "10 GB", price: "$31.50", callback: "proxy_light_regular_10gb" },
  { name: "15 GB", price: "$46.00", callback: "proxy_light_regular_15gb" },
  { name: "20 GB", price: "$62.00", callback: "proxy_light_regular_20gb" }
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

  buttons.push([{ text: "⬅️ Back", callback_data: "proxy_light" }]);

  return buttons;
}

async function handleProxyLight(bot, query) {
  const data = query.data;

  if (data === "proxy_light") {
    await sendOrEdit(bot, query, "🌐 Proxy Light\n\nPlease select price type:", [
      [
        { text: "🔥 Discount Price", callback_data: "proxy_light_discount_menu" },
        { text: "💎 Regular Price", callback_data: "proxy_light_regular_menu" }
      ],
      [
        { text: "⬅️ Back", callback_data: "ip_proxy" }
      ]
    ]);

    return true;
  }

  if (data === "proxy_light_discount_menu") {
    await sendOrEdit(
      bot,
      query,
      "🔥 Proxy Light Discount Price List\n\nSelect your package:",
      makePackageButtons(proxyLightDiscountPackages)
    );

    return true;
  }

  if (data === "proxy_light_regular_menu") {
    await sendOrEdit(
      bot,
      query,
      "💎 Proxy Light Regular Price List\n\nSelect your package:",
      makePackageButtons(proxyLightRegularPackages)
    );

    return true;
  }

  return false;
}

module.exports = { handleProxyLight };