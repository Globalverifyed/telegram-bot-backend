const { sendOrEdit } = require("./utils");

/* ===================== DISCOUNT (IP) ===================== */
const novProxyDiscountPackages = [
  { name: "25 IP", price: "$0.79", callback: "nov_proxy_discount_25ip" },
  { name: "50 IP", price: "$1.49", callback: "nov_proxy_discount_50ip" },
  { name: "100 IP", price: "$2.49", callback: "nov_proxy_discount_100ip" },
  { name: "200 IP", price: "$4.79", callback: "nov_proxy_discount_200ip" },
  { name: "300 IP", price: "$7.10", callback: "nov_proxy_discount_300ip" },
  { name: "500 IP", price: "$11.90", callback: "nov_proxy_discount_500ip" }
];

/* ===================== REGULAR (IP) ===================== */
const novProxyRegularPackages = [
  { name: "25 IP", price: "$2.20", callback: "nov_proxy_regular_25ip" },
  { name: "50 IP", price: "$3.80", callback: "nov_proxy_regular_50ip" },
  { name: "100 IP", price: "$7.00", callback: "nov_proxy_regular_100ip" },
  { name: "200 IP", price: "$12.00", callback: "nov_proxy_regular_200ip" },
  { name: "300 IP", price: "$18.00", callback: "nov_proxy_regular_300ip" },
  { name: "500 IP", price: "$28.00", callback: "nov_proxy_regular_500ip" }
];

/* ===================== BUTTON BUILDER ===================== */
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

/* ===================== HANDLER ===================== */
async function handleNovProxy(bot, query) {
  const data = query.data;

  if (data === "novproxy") {
    await sendOrEdit(bot, query, "🌐 Nov Proxy (IP)\n\nSelect Price Type:", [
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
      "🔥 Discount IP Packages:",
      makePackageButtons(novProxyDiscountPackages)
    );
    return true;
  }

  if (data === "nov_proxy_regular_menu") {
    await sendOrEdit(
      bot,
      query,
      "💎 Regular IP Packages:",
      makePackageButtons(novProxyRegularPackages)
    );
    return true;
  }

  return false;
}

module.exports = { handleNovProxy };