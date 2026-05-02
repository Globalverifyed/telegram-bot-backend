const { showPaymentMethods } = require("./payment");
const { sendOrEdit } = require("./utils");
const { isAvailable, reduceStock } = require("./stock_manager");

/* ===================== VPN PRODUCTS ===================== */
/*
নতুন VPN add/edit করতে হলে এখানে product section edit করবে।
প্রতিটা VPN-এর stockKey অবশ্যই stock_manager.js এর key-এর সাথে match করবে।
*/

const vpnProducts = {
  /* ===== CyberGhost VPN ===== */
  vpn_cyberghost: {
    name: "CyberGhost VPN",
    stockKey: "vpn_cyberghost",
    packages: {
      cg_3d: { label: "3 Days", price: "$1.00" },
      cg_7d: { label: "7 Days", price: "$2.00" },
      cg_1m: { label: "1 Month", price: "$3.00" },
      cg_6m: { label: "6 Month", price: "$4.00" },
      cg_1y: { label: "1 Year", price: "$5.00" },
      cg_2y: { label: "2 Year", price: "$6.00" }
    }
  },

  /* ===== Panda VPN ===== */
  vpn_panda: {
    name: "Panda VPN",
    stockKey: "vpn_panda",
    packages: {
      panda_3d: { label: "3 Days", price: "$1.00" },
      panda_7d: { label: "7 Days", price: "$2.00" },
      panda_1m: { label: "1 Month", price: "$3.00" },
      panda_6m: { label: "6 Month", price: "$4.00" },
      panda_1y: { label: "1 Year", price: "$5.00" },
      panda_2y: { label: "2 Year", price: "$6.00" }
    }
  },

  /* ===== Express VPN ===== */
  vpn_express: {
    name: "Express VPN",
    stockKey: "vpn_express",
    packages: {
      express_3d: { label: "3 Days", price: "$1.00" },
      express_7d: { label: "7 Days", price: "$2.00" },
      express_1m: { label: "1 Month", price: "$3.00" },
      express_6m: { label: "6 Month", price: "$4.00" },
      express_1y: { label: "1 Year", price: "$5.00" },
      express_2y: { label: "2 Year", price: "$6.00" }
    }
  },

  /* ===== HMA VPN ===== */
  vpn_hma: {
    name: "HMA VPN",
    stockKey: "vpn_hma",
    packages: {
      hma_3d: { label: "3 Days", price: "$1.00" },
      hma_7d: { label: "7 Days", price: "$2.00" },
      hma_1m: { label: "1 Month", price: "$3.00" },
      hma_6m: { label: "6 Month", price: "$4.00" },
      hma_1y: { label: "1 Year", price: "$5.00" },
      hma_2y: { label: "2 Year", price: "$6.00" }
    }
  },

  /* ===== IPVanish VPN ===== */
  vpn_ipvanish: {
    name: "IPVanish VPN",
    stockKey: "vpn_ipvanish",
    packages: {
      ipvanish_3d: { label: "3 Days", price: "$1.00" },
      ipvanish_7d: { label: "7 Days", price: "$2.00" },
      ipvanish_1m: { label: "1 Month", price: "$3.00" },
      ipvanish_6m: { label: "6 Month", price: "$4.00" },
      ipvanish_1y: { label: "1 Year", price: "$5.00" },
      ipvanish_2y: { label: "2 Year", price: "$6.00" }
    }
  },

  /* ===== Nord VPN ===== */
  vpn_nord: {
    name: "Nord VPN",
    stockKey: "vpn_nord",
    packages: {
      nord_3d: { label: "3 Days", price: "$1.00" },
      nord_7d: { label: "7 Days", price: "$2.00" },
      nord_1m: { label: "1 Month", price: "$3.00" },
      nord_6m: { label: "6 Month", price: "$4.00" },
      nord_1y: { label: "1 Year", price: "$5.00" },
      nord_2y: { label: "2 Year", price: "$6.00" }
    }
  },

  /* ===== X VPN ===== */
  vpn_x: {
    name: "X VPN",
    stockKey: "vpn_x",
    packages: {
      x_3d: { label: "3 Days", price: "$1.00" },
      x_7d: { label: "7 Days", price: "$2.00" },
      x_1m: { label: "1 Month", price: "$3.00" },
      x_6m: { label: "6 Month", price: "$4.00" },
      x_1y: { label: "1 Year", price: "$5.00" },
      x_2y: { label: "2 Year", price: "$6.00" }
    }
  },

  /* ===== PIA VPN ===== */
  vpn_pia: {
    name: "PIA VPN",
    stockKey: "vpn_pia",
    packages: {
      pia_3d: { label: "3 Days", price: "$1.00" },
      pia_7d: { label: "7 Days", price: "$2.00" },
      pia_1m: { label: "1 Month", price: "$3.00" },
      pia_6m: { label: "6 Month", price: "$4.00" },
      pia_1y: { label: "1 Year", price: "$5.00" },
      pia_2y: { label: "2 Year", price: "$6.00" }
    }
  },

  /* ===== Bitdefender VPN ===== */
  vpn_bitdefender: {
    name: "Bitdefender VPN",
    stockKey: "vpn_bitdefender",
    packages: {
      bitdefender_3d: { label: "3 Days", price: "$1.00" },
      bitdefender_7d: { label: "7 Days", price: "$2.00" },
      bitdefender_1m: { label: "1 Month", price: "$3.00" },
      bitdefender_6m: { label: "6 Month", price: "$4.00" },
      bitdefender_1y: { label: "1 Year", price: "$5.00" },
      bitdefender_2y: { label: "2 Year", price: "$6.00" }
    }
  },

  /* ===== Turbo VPN ===== */
  vpn_turbo: {
    name: "Turbo VPN",
    stockKey: "vpn_turbo",
    packages: {
      turbo_3d: { label: "3 Days", price: "$1.00" },
      turbo_7d: { label: "7 Days", price: "$2.00" },
      turbo_1m: { label: "1 Month", price: "$3.00" },
      turbo_6m: { label: "6 Month", price: "$4.00" },
      turbo_1y: { label: "1 Year", price: "$5.00" },
      turbo_2y: { label: "2 Year", price: "$6.00" }
    }
  },

  /* ===== Hotspot Shield VPN ===== */
  vpn_hotspot: {
    name: "Hotspot Shield VPN",
    stockKey: "vpn_hotspot",
    packages: {
      hotspot_3d: { label: "3 Days", price: "$1.00" },
      hotspot_7d: { label: "7 Days", price: "$2.00" },
      hotspot_1m: { label: "1 Month", price: "$3.00" },
      hotspot_6m: { label: "6 Month", price: "$4.00" },
      hotspot_1y: { label: "1 Year", price: "$5.00" },
      hotspot_2y: { label: "2 Year", price: "$6.00" }
    }
  },

  /* ===== Surfshark VPN ===== */
  vpn_surfshark: {
    name: "Surfshark VPN",
    stockKey: "vpn_surfshark",
    packages: {
      surfshark_3d: { label: "3 Days", price: "$1.00" },
      surfshark_7d: { label: "7 Days", price: "$2.00" },
      surfshark_1m: { label: "1 Month", price: "$3.00" },
      surfshark_6m: { label: "6 Month", price: "$4.00" },
      surfshark_1y: { label: "1 Year", price: "$5.00" },
      surfshark_2y: { label: "2 Year", price: "$6.00" }
    }
  },

  /* ===== Proton VPN ===== */
  vpn_proton: {
    name: "Proton VPN",
    stockKey: "vpn_proton",
    packages: {
      proton_3d: { label: "3 Days", price: "$1.00" },
      proton_7d: { label: "7 Days", price: "$2.00" },
      proton_1m: { label: "1 Month", price: "$3.00" },
      proton_6m: { label: "6 Month", price: "$4.00" },
      proton_1y: { label: "1 Year", price: "$5.00" },
      proton_2y: { label: "2 Year", price: "$6.00" }
    }
  },

  /* ===== Cheap VPN ===== */
  vpn_cheap: {
    name: "Cheap VPN",
    stockKey: "vpn_cheap",
    packages: {
      cheap_3d: { label: "3 Days", price: "$1.00" },
      cheap_7d: { label: "7 Days", price: "$2.00" },
      cheap_1m: { label: "1 Month", price: "$3.00" },
      cheap_6m: { label: "6 Month", price: "$4.00" },
      cheap_1y: { label: "1 Year", price: "$5.00" },
      cheap_2y: { label: "2 Year", price: "$6.00" }
    }
  },

  /* ===== Avast VPN ===== */
  vpn_avast: {
    name: "Avast VPN",
    stockKey: "vpn_avast",
    packages: {
      avast_3d: { label: "3 Days", price: "$1.00" },
      avast_7d: { label: "7 Days", price: "$2.00" },
      avast_1m: { label: "1 Month", price: "$3.00" },
      avast_6m: { label: "6 Month", price: "$4.00" },
      avast_1y: { label: "1 Year", price: "$5.00" },
      avast_2y: { label: "2 Year", price: "$6.00" }
    }
  },

  /* ===== Vless Premium ===== */
  vpn_vless: {
    name: "Vless Premium",
    stockKey: "vpn_vless",
    packages: {
      vless_3d: { label: "3 Days", price: "$1.00" },
      vless_7d: { label: "7 Days", price: "$2.00" },
      vless_1m: { label: "1 Month", price: "$3.00" },
      vless_6m: { label: "6 Month", price: "$4.00" },
      vless_1y: { label: "1 Year", price: "$5.00" },
      vless_2y: { label: "2 Year", price: "$6.00" }
    }
  }
};

/* ===================== HELPERS ===================== */

function buildPackageButtons(product, vpnKey) {
  const entries = Object.entries(product.packages);
  const buttons = [];

  for (let i = 0; i < entries.length; i += 2) {
    buttons.push(
      entries.slice(i, i + 2).map(([pkgKey, pkg]) => ({
        text: isAvailable(product.stockKey, pkgKey)
          ? `🔐 ${pkg.label} - ${pkg.price} ✅`
          : `🔐 ${pkg.label} ❌ Stock Out`,
        callback_data: pkgKey
      }))
    );
  }

  buttons.push([{ text: "⬅ Back", callback_data: "buy_vpn" }]);
  return buttons;
}

function findPackage(callbackData) {
  for (const [vpnKey, product] of Object.entries(vpnProducts)) {
    if (product.packages[callbackData]) {
      return {
        vpnKey,
        product,
        packageKey: callbackData,
        package: product.packages[callbackData]
      };
    }
  }

  return null;
}

/* ===================== MAIN HANDLER ===================== */

async function handleVPN(bot, query) {
  const data = query.data;
  const chatId = query.message.chat.id;

  if (data === "buy_vpn") {
    const entries = Object.entries(vpnProducts);
    const buttons = [];

    for (let i = 0; i < entries.length; i += 2) {
      buttons.push(
        entries.slice(i, i + 2).map(([vpnKey, product]) => ({
          text: `🔐 ${product.name.replace(" VPN", "")}`,
          callback_data: vpnKey
        }))
      );
    }

    buttons.push([{ text: "⬅ Back", callback_data: "back_main" }]);

    await sendOrEdit(bot, query, "🔐 Select VPN Service:", buttons);
    return true;
  }

  if (vpnProducts[data]) {
    const product = vpnProducts[data];

    await sendOrEdit(
      bot,
      query,
      `🔐 ${product.name} Packages:`,
      buildPackageButtons(product, data)
    );

    return true;
  }

  const found = findPackage(data);

  if (found) {
    const { product, packageKey, package: pkg } = found;

    if (!isAvailable(product.stockKey, packageKey)) {
      await sendOrEdit(bot, query, "❌ This package is Stock Out.", [
        [{ text: "⬅ Back", callback_data: found.vpnKey }]
      ]);

      return true;
    }

    reduceStock(product.stockKey, packageKey);

    await showPaymentMethods(bot, chatId, {
      name: product.name,
      package: pkg.label,
      price: pkg.price,
      back: found.vpnKey
    });

    return true;
  }

  return false;
}

module.exports = { handleVPN };