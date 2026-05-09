const { showPaymentMethods } = require("./payment");
const { sendOrEdit } = require("./utils");
const { isAvailable, reduceStock } = require("./stock_manager");

const PRODUCT_KEY = "vpn_cyberghost";

const cyberGhostPackages = {
  cg_3d: { label: "3 Days", price: "$1.00" },
  cg_7d: { label: "7 Days", price: "$2.00" },
  cg_1m: { label: "1 Month", price: "$3.00" },
  cg_6m: { label: "6 Month", price: "$4.00" },
  cg_1y: { label: "1 Year", price: "$5.00" },
  cg_2y: { label: "2 Year", price: "$6.00" }
};

function buildButtons() {
  const entries = Object.entries(cyberGhostPackages);
  const buttons = [];

  for (let i = 0; i < entries.length; i += 2) {
    buttons.push(
      entries.slice(i, i + 2).map(([key, item]) => ({
        text: isAvailable(PRODUCT_KEY, key)
          ? `🔐 ${item.label} - ${item.price} ✅`
          : `🔐 ${item.label} ❌ Stock Out`,
        callback_data: key
      }))
    );
  }

  buttons.push([{ text: "⬅ Back", callback_data: "buy_vpn" }]);
  return buttons;
}

async function handleCyberGhostVPN(bot, query) {
  const data = query.data;
  const chatId = query.message.chat.id;

  if (data === "vpn_cyberghost") {
    await sendOrEdit(bot, query, "🔐 CyberGhost VPN Packages:", buildButtons());
    return true;
  }

  if (cyberGhostPackages[data]) {
    const pkg = cyberGhostPackages[data];

    if (!isAvailable(PRODUCT_KEY, data)) {
      await sendOrEdit(bot, query, "❌ This CyberGhost package is Stock Out.", [
        [{ text: "⬅ Back", callback_data: "vpn_cyberghost" }]
      ]);
      return true;
    }

    reduceStock(PRODUCT_KEY, data);

    await showPaymentMethods(bot, chatId, {
      name: "CyberGhost VPN",
      package: pkg.label,
      price: pkg.price,
      back: "vpn_cyberghost"
    });

    return true;
  }

  return false;
}

module.exports = { handleCyberGhostVPN };