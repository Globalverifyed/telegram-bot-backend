const { sendOrEdit } = require("./utils");

async function handleIPProxy(bot, query) {
  const data = query.data;

  if (data === "ip_proxy") {
    await sendOrEdit(bot, query, "🌐 Select IP/Proxy:", [
      
      // Row 1
      [
        { text: "⚡ DataImpulse", callback_data: "dataimpulse_menu" },
        { text: "🌍 9proxy IP", callback_data: "order_9proxy_ip" }
      ],

      // Row 2
      [
        { text: "📦 9proxy GB", callback_data: "order_9proxy_gb" },
        { text: "🔥 Nice Proxy", callback_data: "nice_proxy" }
      ],

      // Row 3
      [
        { text: "🚀 Swift Proxy", callback_data: "swift_proxy" },
        { text: "🌐 ABC Proxy", callback_data: "abc_proxy" }
      ],

      // Row 4
      [
        { text: "🌐 Proxy Seller", callback_data: "proxy_seller" },
        { text: "🌐 Proxy Light", callback_data: "proxy_light" }
      ],

      // Row 5
      [
        { text: "🌐 NovProxy", callback_data: "novproxy" },
        { text: "🌐 IpRocket Proxy", callback_data: "iprocket_proxy" }
      ],

      // Row 6
      [
        { text: "🌐 Nodemaven", callback_data: "nodemaven" },
        { text: "🌐 CLiProxy", callback_data: "cliproxy" }
      ],

      // Row 7 (NEW)
      [
        { text: "🌐 CHerry Proxy", callback_data: "cherry_proxy" },
        { text: "🌐 Digi Proxy", callback_data: "digi_proxy" }
      ],

      // Back Button
      [
        { text: "⬅️ Back", callback_data: "back_main" }
      ]
    ]);

    return true;
  }

  return false;
}

module.exports = { handleIPProxy };