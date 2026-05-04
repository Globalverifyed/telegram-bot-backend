const { sendOrEdit } = require("./utils");

const cliProxyDiscountPackages = [
  { name: "25 IP", price: "$2.00 USDT", callback: "cliproxy_discount_25ip" },
  { name: "50 IP", price: "$4.00 USDT", callback: "cliproxy_discount_50ip" },
  { name: "100 IP", price: "$8.00 USDT", callback: "cliproxy_discount_100ip" },
  { name: "200 IP", price: "$16.00 USDT", callback: "cliproxy_discount_200ip" },
  { name: "400 IP", price: "$32.00 USDT", callback: "cliproxy_discount_400ip" }
];

const cliProxyRegularPackages = [
  { name: "25 IP", price: "$3.00", callback: "cliproxy_regular_25ip" },
  { name: "50 IP", price: "$6.00", callback: "cliproxy_regular_50ip" },
  { name: "100 IP", price: "$12.00", callback: "cliproxy_regular_100ip" },
  { name: "200 IP", price: "$22.00", callback: "cliproxy_regular_200ip" },
  { name: "400 IP", price: "$42.00", callback: "cliproxy_regular_400ip" },
  { name: "800 IP", price: "$78.00", callback: "cliproxy_regular_800ip" },
  { name: "1000 IP", price: "$88.00", callback: "cliproxy_regular_1000ip" },
  { name: "1200 IP", price: "$99.00", callback: "cliproxy_regular_1200ip" }
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

  buttons.push([{ text: "⬅️ Back", callback_data: "cliproxy" }]);

  return buttons;
}

async function handleCliProxy(bot, query) {
  const data = query.data;

  if (data === "cliproxy") {
    await sendOrEdit(bot, query, "🌐 CLiProxy\n\nPlease select price type:", [
      [
        { text: "🔥 Discount Price", callback_data: "cliproxy_discount_menu" },
        { text: "💎 Regular Price", callback_data: "cliproxy_regular_menu" }
      ],
      [
        { text: "⬅️ Back", callback_data: "ip_proxy" }
      ]
    ]);

    return true;
  }

  if (data === "cliproxy_discount_menu") {
    await sendOrEdit(
      bot,
      query,
      "🔥 CLiProxy Discount Price List\n\nSelect your package:",
      makePackageButtons(cliProxyDiscountPackages)
    );

    return true;
  }

  if (data === "cliproxy_regular_menu") {
    await sendOrEdit(
      bot,
      query,
      "💎 CLiProxy Regular Price List\n\nSelect your package:",
      makePackageButtons(cliProxyRegularPackages)
    );

    return true;
  }

  return false;
}

module.exports = { handleCliProxy };