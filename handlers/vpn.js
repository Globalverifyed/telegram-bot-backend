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
      cg_3d: { label: "3 Days", price: "$0.20" },
      cg_7d: { label: "7 Days", price: "Stock Out" },
      cg_1m: { label: "1 Month", price: "Stock Out" },
      cg_6m: { label: "6 Month", price: "$Stock Out" },
      cg_1y: { label: "1 Year", price: "Stock Out" },
      cg_2y: { label: "2 Year", price: "Stock Out" }
    }
  },

  /* ===== Panda VPN ===== */
  vpn_panda: {
    name: "Panda VPN",
    stockKey: "vpn_panda",
    packages: {
      panda_3d: { label: "3 Days", price: "$0.20" },
      panda_7d: { label: "7 Days", price: "Stock Out" },
      panda_1m: { label: "1 Month", price: "Stock Out" },
      panda_6m: { label: "6 Month", price: "Stock Out" },
      panda_1y: { label: "1 Year", price: "Stock Out" },
      panda_2y: { label: "2 Year", price: "Stock Out" }
    }
  },

  /* ===== Express VPN ===== */
  vpn_express: {
    name: "Express VPN",
    stockKey: "vpn_express",
    packages: {
      express_3d: { label: "3 Days", price: "Stock Out" },
      express_7d: { label: "7 Days", price: "$0.32" },
      express_1m: { label: "1 Month", price: "$1.10" },
      express_6m: { label: "6 Month", price: "Stock Out" },
      express_1y: { label: "1 Year", price: "Stock Out" },
      express_2y: { label: "2 Year", price: "Stock Out" }
    }
  },

  /* ===== HMA VPN ===== */
  vpn_hma: {
    name: "HMA VPN",
    stockKey: "vpn_hma",
    packages: {
      hma_3d: { label: "3 Days", price: "Stock Out" },
      hma_7d: { label: "7 Days", price: "$0.32" },
      hma_1m: { label: "1 Month", price: "$1.00" },
      hma_6m: { label: "6 Month", price: "Stock Out" },
      hma_1y: { label: "1 Year", price: "Stock Out" },
      hma_2y: { label: "2 Year", price: "Stock Out" }
    }
  },

  /* ===== IPVanish VPN ===== */
  vpn_ipvanish: {
    name: "IPVanish VPN",
    stockKey: "vpn_ipvanish",
    packages: {
      ipvanish_3d: { label: "3 Days", price: "Stock Out" },
      ipvanish_7d: { label: "7 Days", price: "$0.32" },
      ipvanish_1m: { label: "1 Month", price: "Stock Out" },
      ipvanish_6m: { label: "6 Month", price: "Stock Out" },
      ipvanish_1y: { label: "1 Year", price: "Stock Out" },
      ipvanish_2y: { label: "2 Year", price: "Stock Out" }
    }
  },

  /* ===== Nord VPN ===== */
  vpn_nord: {
    name: "Nord VPN",
    stockKey: "vpn_nord",
    packages: {
      nord_3d: { label: "3 Days", price: "Stock Out" },
      nord_7d: { label: "7 Days", price: "$0.32" },
      nord_1m: { label: "1 Month", price: "$2.10" },
      nord_6m: { label: "6 Month", price: "Stock Out" },
      nord_1y: { label: "1 Year", price: "$14.00" },
      nord_2y: { label: "2 Year", price: "$31.00" }
    }
  },

  /* ===== X VPN ===== */
  vpn_x: {
    name: "X VPN",
    stockKey: "vpn_x",
    packages: {
      x_3d: { label: "3 Days", price: "Stock Out" },
      x_7d: { label: "7 Days", price: "$0.32" },
      x_1m: { label: "1 Month", price: "Stock Out" },
      x_6m: { label: "6 Month", price: "Stock Out" },
      x_1y: { label: "1 Year", price: "Stock Out" },
      x_2y: { label: "2 Year", price: "Stock Out" }
    }
  },

  /* ===== PIA VPN ===== */
  vpn_pia: {
    name: "PIA VPN",
    stockKey: "vpn_pia",
    packages: {
      pia_3d: { label: "3 Days", price: "Stock Out" },
      pia_7d: { label: "7 Days", price: "$0.32" },
      pia_1m: { label: "1 Month", price: "$2.10" },
      pia_6m: { label: "6 Month", price: "Stock Out" },
      pia_1y: { label: "1 Year", price: "Stock Out" },
      pia_2y: { label: "2 Year", price: "Stock Out" }
    }
  },

  /* ===== Bitdefender VPN ===== */
  vpn_bitdefender: {
    name: "Bitdefender VPN",
    stockKey: "vpn_bitdefender",
    packages: {
      bitdefender_3d: { label: "3 Days", price: "Stock Out" },
      bitdefender_7d: { label: "7 Days", price: "$0.32" },
      bitdefender_1m: { label: "1 Month", price: "$1.00" },
      bitdefender_6m: { label: "6 Month", price: "Stock Out" },
      bitdefender_1y: { label: "1 Year", price: "Stock Out" },
      bitdefender_2y: { label: "2 Year", price: "Stock Out" }
    }
  },

  /* ===== Turbo VPN ===== */
  vpn_turbo: {
    name: "Turbo VPN",
    stockKey: "vpn_turbo",
    packages: {
      turbo_3d: { label: "3 Days", price: "Stock Out" },
      turbo_7d: { label: "7 Days", price: "$0.32" },
      turbo_1m: { label: "1 Month", price: "Stock Out" },
      turbo_6m: { label: "6 Month", price: "Stock Out" },
      turbo_1y: { label: "1 Year", price: "Stock Out" },
      turbo_2y: { label: "2 Year", price: "Stock Out" }
    }
  },

  /* ===== Hotspot Shield VPN ===== */
  vpn_hotspot: {
    name: "Hotspot Shield VPN",
    stockKey: "vpn_hotspot",
    packages: {
      hotspot_3d: { label: "3 Days", price: "Stock Out" },
      hotspot_7d: { label: "7 Days", price: "$0.32" },
      hotspot_1m: { label: "1 Month", price: "$2.00" },
      hotspot_6m: { label: "6 Month", price: "Stock Out" },
      hotspot_1y: { label: "1 Year", price: "Stock Out" },
      hotspot_2y: { label: "2 Year", price: "Stock Out" }
    }
  },

  /* ===== Surfshark VPN ===== */
  vpn_surfshark: {
    name: "Surfshark VPN",
    stockKey: "vpn_surfshark",
    packages: {
      surfshark_3d: { label: "3 Days", price: "Stock Out" },
      surfshark_7d: { label: "7 Days", price: "$0.32" },
      surfshark_1m: { label: "1 Month", price: "$3.00" },
      surfshark_6m: { label: "6 Month", price: "$16.00" },
      surfshark_1y: { label: "1 Year", price: "$28.00" },
      surfshark_2y: { label: "2 Year", price: "Stock Out" }
    }
  },

  /* ===== Proton VPN ===== */
  vpn_proton: {
    name: "Proton VPN",
    stockKey: "vpn_proton",
    packages: {
      proton_3d: { label: "3 Days", price: "Stock Out" },
      proton_7d: { label: "7 Days", price: "$0.32" },
      proton_1m: { label: "1 Month", price: "$2.20" },
      proton_6m: { label: "6 Month", price: "Stock Out" },
      proton_1y: { label: "1 Year", price: "Stock Out" },
      proton_2y: { label: "2 Year", price: "Stock Out" }
    }
  },

  /* ===== Cheap VPN ===== */
  vpn_cheap: {
    name: "Cheap VPN",
    stockKey: "vpn_cheap",
    packages: {
      cheap_3d: { label: "3 Days", price: "Stock Out" },
      cheap_7d: { label: "7 Days", price: "Stock Out" },
      cheap_1m: { label: "1 Month", price: "$6.00" },
      cheap_6m: { label: "6 Month", price: "Stock Out" },
      cheap_1y: { label: "1 Year", price: "Stock Out" },
      cheap_2y: { label: "2 Year", price: "Stock Out" }
    }
  },

  /* ===== Avast VPN ===== */
  vpn_avast: {
    name: "Avast VPN",
    stockKey: "vpn_avast",
    packages: {
      avast_3d: { label: "3 Days", price: "Stock Out" },
      avast_7d: { label: "7 Days", price: "$0.32" },
      avast_1m: { label: "1 Month", price: "$1.10" },
      avast_6m: { label: "6 Month", price: "Stock Out" },
      avast_1y: { label: "1 Year", price: "Stock Out" },
      avast_2y: { label: "2 Year", price: "Stock Out" }
    }
  },

  /* ===== Vless Premium ===== */
  vpn_vless: {
    name: "Vless Premium",
    stockKey: "vpn_vless",
    packages: {
      vless_3d: { label: "3 Days", price: "Stock Out" },
      vless_7d: { label: "7 Days", price: "$1.00" },
      vless_1m: { label: "1 Month", price: "$3.10" },
      vless_6m: { label: "6 Month", price: "Stock Out" },
      vless_1y: { label: "1 Year", price: "Stock Out" },
      vless_2y: { label: "2 Year", price: "Stock Out" }
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