const { showProductOptions } = require("./product_options");
const { sendOrEdit } = require("./utils");

const proxyIPPackages = {
  ip25: { label: "25 IP", price: "$0.85" },
  ip50: { label: "50 IP", price: "$1.69" },
  ip100: { label: "100 IP", price: "$3.35" },
  ip200: { label: "200 IP", price: "$6.49" },
  ip300: { label: "300 IP", price: "$9.59" },
  ip500: { label: "500 IP", price: "$14.99" },
  ip1000: { label: "1000 IP", price: "$27.99" }
};

async function handleProxyIP(bot, query) {
  const data = query.data;

  if (data === "order_9proxy_ip") {
    const entries = Object.entries(proxyIPPackages);
    const buttons = [];

    for (let i = 0; i < entries.length; i += 2) {
      buttons.push(
        entries.slice(i, i + 2).map(([key, item]) => ({
          text: `🌍 ${item.label} - ${item.price}`,
          callback_data: key
        }))
      );
    }

    buttons.push([{ text: "⬅ Back", callback_data: "ip_proxy" }]);

    await sendOrEdit(bot, query, "🌍 Select 9proxy IP Package:", buttons);
    return true;
  }

  if (proxyIPPackages[data]) {
    const pkg = proxyIPPackages[data];

    await showProductOptions(bot, query, {
      name: "9proxy IP",
      package: pkg.label,
      price: pkg.price,
      back: "order_9proxy_ip"
    });

    return true;
  }

  return false;
}

module.exports = { handleProxyIP };