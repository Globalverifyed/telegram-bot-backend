const { sendOrEdit } = require("./utils");

const novProxyDiscountPackages = [
  { name: "25 IP", price: "$2.00 USDT", callback: "nov_proxy_discount_25IP" },
  { name: "50 IP", price: "$4.00 USDT", callback: "nov_proxy_discount_50IP" },
  { name: "100 IP", price: "$8.00 USDT", callback: "nov_proxy_discount_100IP" },
  { name: "200 IP", price: "$16.00 USDT", callback: "nov_proxy_discount_200IP" },
  { name: "400 IP", price: "$32.00 USDT", callback: "nov_proxy_discount_400IP" }
  { name: "800 IP", price: "$58 USDT", callback: "nov_proxy_discount_800IP" },
  { name: "1000 IP", price: "$70.00 USDT", callback: "nov_proxy_discount_1000IP" },
  { name: "1200 IP", price: "$80.00 USDT", callback: "nov_proxy_discount_1200IP" },
  { name: "1600 IP", price: "$105.00 USDT", callback: "nov_proxy_discount_1600IP" },
  { name: "2200 IP", price: "$135.00 USDT", callback: "nov_proxy_discount_2200IP" }
];

const novProxyRegularPackages = [
  { name: "25 IP", price: "$3.00", callback: "nov_proxy_regular_25ip" },
  { name: "50 IP", price: "$6.00", callback: "nov_proxy_regular_50ip" },
  { name: "100 IP", price: "$12.00", callback: "nov_proxy_regular_100ip" },
  { name: "200 IP", price: "$22.00", callback: "nov_proxy_regular_200ip" },
  { name: "400 IP", price: "$42.00", callback: "nov_proxy_regular_400ip" },
  { name: "800 IP", price: "$78.00", callback: "nov_proxy_regular_800ip" },
  { name: "1000 IP", price: "$88.00", callback: "nov_proxy_regular_1000ip" },
  { name: "1200 IP", price: "$99.00", callback: "nov_proxy_regular_1200ip" }
  { name: "1600 IP", price: "$125.00", callback: "nov_proxy_regular_1600ip" },
  { name: "2200 IP", price: "$155.00", callback: "nov_proxy_regular_2200ip" }
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

  buttons.push([{ text: "⬅️ Back", callback_data: "novproxy" }]);

  return buttons;
}

async function handleNovProxy(bot, query) {
  const data = query.data;

  if (data === "novproxy") {
    await sendOrEdit(bot, query, "🌐 Nov Proxy\n\nPlease select price type:", [
      [
        { text: "🔥 Discount Price", callback_data: "nov_proxy_discount_menu" },
        { text: "💎 Regular Price", callback_data: "nov_proxy_regular_menu" }
      ],
      [
        { text: "⬅️ Back", callback_data: "ip_proxy" }
      ]
    ]);

    return true;
  }

  if (data === "nov_proxy_discount_menu") {
    await sendOrEdit(
      bot,
      query,
      "🔥 Nov Proxy Discount Price List\n\nSelect your package:",
      makePackageButtons(novProxyDiscountPackages)
    );

    return true;
  }

  if (data === "nov_proxy_regular_menu") {
    await sendOrEdit(
      bot,
      query,
      "💎 Nov Proxy Regular Price List\n\nSelect your package:",
      makePackageButtons(novProxyRegularPackages)
    );

    return true;
  }

  return false;
}

module.exports = { handleNovProxy };