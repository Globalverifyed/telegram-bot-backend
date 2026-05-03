const { sendOrEdit } = require("./utils");

const proxySellerDiscountPackages = [
  { name: "1 GB", price: "$2.00 USDT", callback: "proxy_seller_discount_1gb" },
  { name: "2 GB", price: "$4.00 USDT", callback: "proxy_seller_discount_2gb" },
  { name: "3 GB", price: "$5.90 USDT", callback: "proxy_seller_discount_3gb" },
  { name: "4 GB", price: "$7.85 USDT", callback: "proxy_seller_discount_4gb" },
  { name: "5 GB", price: "$9.80 USDT", callback: "proxy_seller_discount_5gb" }
];

const proxySellerRegularPackages = [
  { name: "1 GB", price: "$2.50", callback: "proxy_seller_regular_1gb" },
  { name: "2 GB", price: "$5.00", callback: "proxy_seller_regular_2gb" },
  { name: "3 GB", price: "$7.50", callback: "proxy_seller_regular_3gb" },
  { name: "4 GB", price: "$9.50", callback: "proxy_seller_regular_4gb" },
  { name: "5 GB", price: "$11.50", callback: "proxy_seller_regular_5gb" },
  { name: "10 GB", price: "$22.50", callback: "proxy_seller_regular_10gb" },
  { name: "15 GB", price: "$33.00", callback: "proxy_seller_regular_15gb" },
  { name: "20 GB", price: "$42.00", callback: "proxy_seller_regular_20gb" }
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

  buttons.push([{ text: "⬅️ Back", callback_data: "proxy_seller" }]);

  return buttons;
}

async function handleProxySeller(bot, query) {
  const data = query.data;

  if (data === "proxy_seller") {
    await sendOrEdit(bot, query, "🌐 Proxy Seller\n\nPlease select price type:", [
      [
        { text: "🔥 Discount Price", callback_data: "proxy_seller_discount_menu" },
        { text: "💎 Regular Price", callback_data: "proxy_seller_regular_menu" }
      ],
      [
        { text: "⬅️ Back", callback_data: "ip_proxy" }
      ]
    ]);

    return true;
  }

  if (data === "proxy_seller_discount_menu") {
    await sendOrEdit(
      bot,
      query,
      "🔥 Proxy Seller Discount Price List\n\nSelect your package:",
      makePackageButtons(proxySellerDiscountPackages)
    );

    return true;
  }

  if (data === "proxy_seller_regular_menu") {
    await sendOrEdit(
      bot,
      query,
      "💎 Proxy Seller Regular Price List\n\nSelect your package:",
      makePackageButtons(proxySellerRegularPackages)
    );

    return true;
  }

  return false;
}

module.exports = { handleProxySeller };