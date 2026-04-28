const { sendOrEdit } = require("./utils");

async function handleIPProxy(bot, query) {
  const data = query.data;

  if (data === "ip_proxy") {
    await sendOrEdit(bot, query, "🌐 Select IP/Proxy:", [
      [
        { text: "⚡ DataImpulse", callback_data: "dataimpulse_menu" },
        { text: "🌍 9proxy IP", callback_data: "order_9proxy_ip" }
      ],
      [
        { text: "📦 9proxy GB", callback_data: "order_9proxy_gb" },
        { text: "🔥 Nice Proxy", callback_data: "nice_proxy" }
      ],
      [
        { text: "🚀 Swift Proxy", callback_data: "swift_proxy" }
      ],
      [
        { text: "⬅ Back", callback_data: "back_main" }
      ]
    ]);

    return true;
  }

  return false;
}

module.exports = { handleIPProxy };