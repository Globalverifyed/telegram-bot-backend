const { showPaymentMethods } = require("./payment");
const { sendOrEdit } = require("./utils");
const { isAvailable, reduceStock } = require("./stock_manager");

const PRODUCT_KEY_PREFIX = "sub_";

const services = {
  sub_google_ai: {
    name: "Google AI Pro (Gemini)",
    packages: {
      google_1m: { label: "1 Month", price: "$6.00" },
      google_3m: { label: "3 Month", price: "Stock Out" },
      google_6m: { label: "6 Month", price: "Stock Out" },
      google_1y: { label: "1 Year", price: "Stock Out" }
    }
  },

  sub_chatgpt_go: {
    name: "ChatGPT Go",
    packages: {
      go_1m: { label: "1 Month", price: "Stock Out" },
      go_3m: { label: "3 Month", price: "Stock Out" },
      go_6m: { label: "6 Month", price: "Stock Out" },
      go_1y: { label: "1 Year", price: "$8.50" }
    }
  },

  sub_chatgpt_plus: {
    name: "ChatGPT Plus",
    packages: {
      plus_1m: { label: "1 Month", price: "$5.50" },
      plus_3m: { label: "3 Month", price: "Stock Out" },
      plus_6m: { label: "6 Month", price: "Stock Out" },
      plus_1y: { label: "1 Year", price: "Stock Out" }
    }
  },

  sub_capcut: {
    name: "CapCut Pro",
    packages: {
      capcut_1m: { label: "1 Month", price: "$1.80" },
      capcut_3m: { label: "3 Month", price: "$5.00" },
      capcut_6m: { label: "6 Month", price: "$15.00" },
      capcut_1y: { label: "1 Year", price: "$35.00" }
    }
  },

  sub_telegram: {
    name: "Telegram Premium",
    packages: {
      telegram_1m: { label: "1 Month", price: "Stock Out" },
      telegram_3m: { label: "3 Month", price: "$16.00" },
      telegram_6m: { label: "6 Month", price: "$22.00" },
      telegram_1y: { label: "1 Year", price: "$36.00" }
    }
  },

  sub_canva: {
    name: "Canva Pro Subscriptions",
    packages: {
      canva_1m: { label: "1 Month", price: "$0.30" },
      canva_3m: { label: "3 Month", price: "$0.50" },
      canva_6m: { label: "6 Month", price: "$1.00" },
      canva_1y: { label: "1 Year", price: "$2.00" }
    }
  },

  sub_amazon: {
    name: "Amazon Prime Video",
    packages: {
      amazon_1m: { label: "1 Month", price: "$5.00" },
      amazon_3m: { label: "3 Month", price: "Stock Out" },
      amazon_6m: { label: "6 Month", price: "Stock Out" },
      amazon_1y: { label: "1 Year", price: "Stock Out" }
    }
  },

  sub_disney: {
    name: "Disney Plus",
    packages: {
      disney_1m: { label: "1 Month", price: "$5.00" },
      disney_3m: { label: "3 Month", price: "Stock Out" },
      disney_6m: { label: "6 Month", price: "Stock Out" },
      disney_1y: { label: "1 Year", price: "Stock Out" }
    }
  },

  sub_netflix: {
    name: "Netflix Premium Personal",
    packages: {
      netflix_1m: { label: "1 Month", price: "$6.50" },
      netflix_3m: { label: "3 Month", price: "$15.00" },
      netflix_6m: { label: "6 Month", price: "$25.00" },
      netflix_1y: { label: "1 Year", price: "Stock Out" }
    }
  },

  sub_veo3: {
    name: "VEO 3",
    packages: {
      veo_1m: { label: "1 Month", price: "Contact Support" },
      veo_3m: { label: "3 Month", price: "Contact Support" },
      veo_6m: { label: "6 Month", price: "Contact Support" },
      veo_1y: { label: "1 Year", price: "Contact Support" }
    }
  },

  sub_spotify: {
    name: "Spotify Premium",
    packages: {
      spotify_1m: { label: "1 Month", price: "Contact Support" },
      spotify_3m: { label: "3 Month", price: "Contact Support" },
      spotify_6m: { label: "6 Month", price: "Contact Support" },
      spotify_1y: { label: "1 Year", price: "Contact Support" }
    }
  }
};

function buildServiceButtons() {
  const entries = Object.entries(services);
  const buttons = [];

  for (let i = 0; i < entries.length; i += 2) {
    buttons.push(
      entries.slice(i, i + 2).map(([key, item]) => ({
        text: `💎 ${item.name}`,
        callback_data: key
      }))
    );
  }

  buttons.push([{ text: "⬅ Back", callback_data: "back_main" }]);
  return buttons;
}

function buildPackageButtons(serviceKey, service) {
  const entries = Object.entries(service.packages);
  const buttons = [];

  for (let i = 0; i < entries.length; i += 2) {
    buttons.push(
      entries.slice(i, i + 2).map(([pkgKey, pkg]) => ({
        text: isAvailable(serviceKey, pkgKey)
          ? `${pkg.label} - ${pkg.price} ✅`
          : `${pkg.label} ❌ Stock Out`,
        callback_data: pkgKey
      }))
    );
  }

  buttons.push([{ text: "⬅ Back", callback_data: "premium_subscription" }]);
  return buttons;
}

function findPackage(callbackData) {
  for (const [serviceKey, service] of Object.entries(services)) {
    if (service.packages[callbackData]) {
      return {
        serviceKey,
        service,
        packageKey: callbackData,
        package: service.packages[callbackData]
      };
    }
  }

  return null;
}

async function handleSubscription(bot, query) {
  const data = query.data;
  const chatId = query.message.chat.id;

  if (data === "premium_subscription") {
    await sendOrEdit(bot, query, "💎 Select Premium Subscription Service:", buildServiceButtons());
    return true;
  }

  if (services[data]) {
    const service = services[data];

    await sendOrEdit(
      bot,
      query,
      `💎 ${service.name}\n\nSelect package:`,
      buildPackageButtons(data, service)
    );

    return true;
  }

  const found = findPackage(data);

  if (found) {
    const { serviceKey, service, packageKey, package: pkg } = found;

    if (!isAvailable(serviceKey, packageKey)) {
      await sendOrEdit(bot, query, "❌ This package is currently Stock Out.", [
        [{ text: "⬅ Back", callback_data: serviceKey }]
      ]);
      return true;
    }

    reduceStock(serviceKey, packageKey);

    await showPaymentMethods(bot, chatId, {
      name: service.name,
      package: pkg.label,
      price: pkg.price,
      back: serviceKey
    });

    return true;
  }

  return false;
}

module.exports = { handleSubscription };