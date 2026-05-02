const { sendOrEdit } = require("./utils");

const vpnList = {
  vpn_cyberghost: "CyberGhost",
  vpn_panda: "Panda",
  vpn_express: "Express",
  vpn_hma: "HMA",
  vpn_ipvanish: "IPVanish",
  vpn_nord: "Nord",
  vpn_x: "X",
  vpn_pia: "PIA",
  vpn_bitdefender: "Bitdefender",
  vpn_turbo: "Turbo",
  vpn_hotspot: "Hotspot Shield",
  vpn_surfshark: "Surfshark",
  vpn_proton: "Proton",
  vpn_cheap: "Cheap",
  vpn_avast: "Avast",
  vpn_mystmdark: "MystmDark",
  vpn_supergork: "SuperGork",
  vpn_vless: "Vless Premium"
};

async function handleVPN(bot, query) {
  const data = query.data;
  const chatId = query.message.chat.id;

  if (data === "buy_vpn") {
    const entries = Object.entries(vpnList);
    const buttons = [];

    for (let i = 0; i < entries.length; i += 2) {
      buttons.push(
        entries.slice(i, i + 2).map(([key, name]) => ({
          text: `🔐 ${name}`,
          callback_data: key
        }))
      );
    }

    buttons.push([{ text: "⬅ Back", callback_data: "back_main" }]);

    await sendOrEdit(bot, query, "🔐 Select VPN Service:", buttons);
    return true;
  }

  if (vpnList[data]) {
    const vpnName = vpnList[data];

    await sendOrEdit(
      bot,
      query,
      `🔐 ${vpnName}

If you want to use this VPN service, send a message to support.

We will let you know the package, price, and availability.`,
      [
        [{ text: "💬 Contact Support", url: process.env.SUPPORT_URL }],
        [{ text: "⬅ Back", callback_data: "buy_vpn" }]
      ]
    );

    return true;
  }

  return false;
}

module.exports = { handleVPN };