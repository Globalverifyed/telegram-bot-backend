const { sendOrEdit } = require("./utils");
const { isAvailable, reduceStock } = require("./stock_manager");

/* ===================== DISCOUNT (IP) ===================== */
const novProxyDiscountPackages = [
  { name: "25 IP", price: "$2.00", callback: "nov_proxy_discount_25ip" },
  { name: "50 IP", price: "$4.00", callback: "nov_proxy_discount_50ip" },
  { name: "100 IP", price: "$8.00", callback: "nov_proxy_discount_100ip" },
  { name: "200 IP", price: "$16.00", callback: "nov_proxy_discount_200ip" },
  { name: "300 IP", price: "$24.00", callback: "nov_proxy_discount_300ip" },
  { name: "500 IP", price: "$40.00", callback: "nov_proxy_discount_500ip" }
];

/* ===================== REGULAR (IP) ===================== */
const novProxyRegularPackages = [
  { name: "25 IP", price: "$3.00", callback: "nov_proxy_regular_25ip" },
  { name: "50 IP", price: "$6.00", callback: "nov_proxy_regular_50ip" },
  { name: "100 IP", price: "$12.00", callback: "nov_proxy_regular_100ip" },
  { name: "200 IP", price: "$22.00", callback: "nov_proxy_regular_200ip" },
  { name: "300 IP", price: "$33.00", callback: "nov_proxy_regular_300ip" },
  { name: "500 IP", price: "$53.00", callback: "nov_proxy_regular_500ip" }
];

/* ===================== BUTTON BUILDER ===================== */
function makePackageButtons(packages) {
  const buttons = [];

  for (let i = 0; i < packages.length; i += 2) {
    buttons.push(
      packages.slice(i, i + 2).map((pkg) => ({
        text: isAvailable("nov_proxy", pkg.callback)
          ? `🟢 ${pkg.name} - ${pkg.price} ✅`
          : `🔴 ${pkg.name} ❌ Stock Out`,
        callback_data: pkg.callback
      }))
    );
  }

  buttons.push([{ text: "⬅️ Back", callback_data: "novproxy" }]);

  return buttons;
}

/* ===================== MAIN HANDLER ===================== */
async function handleNovProxy(bot, query) {
  const data = query.data;
  const chatId = query.message.chat.id;

  /* ===== Main Menu ===== */
  if (data === "novproxy") {
    await sendOrEdit(bot, query, "🌐 Nov Proxy (IP)\n\nSelect Price Type:", [
      [
        { text: "🔥 Discount Price", callback_data: "nov_proxy_discount_menu" },
        { text: "💎 Regular Price", callback_data: "nov_proxy_regular_menu" }
      ],
      [{ text: "⬅️ Back", callback_data: "ip_proxy" }]
    ]);
    return true;
  }

  /* ===== Discount Menu ===== */
  if (data === "nov_proxy_discount_menu") {
    await sendOrEdit(
      bot,
      query,
      "🔥 Discount IP Packages:",
      makePackageButtons(novProxyDiscountPackages)
    );
    return true;
  }

  /* ===== Regular Menu ===== */
  if (data === "nov_proxy_regular_menu") {
    await sendOrEdit(
      bot,
      query,
      "💎 Regular IP Packages:",
      makePackageButtons(novProxyRegularPackages)
    );
    return true;
  }

  /* ===== BUY HANDLE ===== */
  if (data.startsWith("nov_proxy_")) {
    if (!isAvailable("nov_proxy", data)) {
      await sendOrEdit(bot, query, "❌ This package is Stock Out.", [
        [{ text: "⬅️ Back", callback_data: "novproxy" }]
      ]);
      return true;
    }

    reduceStock("nov_proxy", data);

    await sendOrEdit(
      bot,
      query,
      `✅ Order Created Successfully!

📦 Package: ${data.replace("nov_proxy_", "").toUpperCase()}

💳 Please send payment proof.`,
      [[{ text: "⬅️ Back", callback_data: "novproxy" }]]
    );

    return true;
  }

  return false;
}

module.exports = { handleNovProxy };