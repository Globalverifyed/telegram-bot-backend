// bot.js
require("dotenv").config();
console.log(`STARTING BOT v1.1.0 - ${new Date().toISOString()}`);

const TelegramBot = require("node-telegram-bot-api");
const http = require("http");

const { ADMIN_CHAT_ID } = require("./config");

const { forceJoin } = require("./handlers/force_join");
const { showMainMenu } = require("./handlers/menu");
const { trackUser, trackOrder } = require("./handlers/sheet_tracker");

const {
  handleSupport,
  handleOthers,
  handleIPProxy,
  handleDataImpulse,
  handleProxyIP,
  handleProxyGB,
  handleSwiftProxy,
  handleNiceProxy,
  handleABCProxy,
  handleProxySeller,
  handleProxyLight,
  handleNovProxy,
  handleIpRocketProxy,
  handleNodemaven,
  handleCliProxy,
  handleCherryProxy,
  handleDigiProxy,
  handleVPN,
  handleSubscription,
  handleProductOptions
} = require("./handlers/index");

const { handleAdmin, handleAdminButtons } = require("./handlers/admin");
const { handleAdminStock } = require("./handlers/admin_stock");
const { handleAdminProducts, handleAdminProductMessage } = require("./handlers/admin_products");
const { handleCustomProducts } = require("./handlers/custom_products");

const {
  handlePaymentMethod,
  handlePaymentScreenshot,
  handlePaymentDone,
  handleDeliveryButton,
  handleAdminDeliveryMessage,
  handleAccountDetailsMessage
} = require("./handlers/payment");

if (!process.env.BOT_TOKEN) {
  console.log("❌ BOT_TOKEN missing in .env / Render Environment");
  process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

// ================= ACCESS CHECK =================
async function checkAccess(update) {
  try {
    return await forceJoin(bot, update);
  } catch (err) {
    console.log("CheckAccess error:", err.message);
    return false;
  }
}

// ================= START =================
bot.onText(/\/start/, async (msg) => {
  try {
    const chatId = msg.chat.id;

    console.log(
      "START command triggered by:",
      msg.from?.username || chatId
    );

    const allowed = await checkAccess(msg);

    if (!allowed) return;

    // TRACK USER
    await trackUser(msg.from);

    // SHOW MENU
    await showMainMenu(bot, chatId);

  } catch (err) {
    console.log("/start error:", err.message);
  }
});

// ================= CALLBACK =================
bot.on("callback_query", async (query) => {
  try {
    const allowed = await checkAccess(query);

    if (!allowed) return;

    await bot.answerCallbackQuery(query.id).catch(() => {});

    // ADMIN
    if (await handleAdminProducts(bot, query)) return;
    if (await handleAdminStock(bot, query)) return;
    if (await handleAdminButtons(bot, query)) return;

    // FEATURES
    if (await handleCustomProducts(bot, query)) return;
    if (await handleOthers(bot, query)) return;
    if (await handleSupport(bot, query)) return;
    if (await handleIPProxy(bot, query)) return;
    if (await handleDataImpulse(bot, query)) return;
    if (await handleProxyIP(bot, query)) return;
    if (await handleProxyGB(bot, query)) return;
    if (await handleSwiftProxy(bot, query)) return;
    if (await handleNiceProxy(bot, query)) return;
    if (await handleABCProxy(bot, query)) return;
    if (await handleProxySeller(bot, query)) return;
    if (await handleProxyLight(bot, query)) return;
    if (await handleNovProxy(bot, query)) return;
    if (await handleIpRocketProxy(bot, query)) return;
    if (await handleNodemaven(bot, query)) return;
    if (await handleCliProxy(bot, query)) return;
    if (await handleCherryProxy(bot, query)) return;
    if (await handleDigiProxy(bot, query)) return;
    if (await handleVPN(bot, query)) return;
    if (await handleSubscription(bot, query)) return;
    

    // PRODUCTS
    if (await handleProductOptions(bot, query)) return;

    // PAYMENT
    if (await handlePaymentMethod(bot, query)) return;
    if (await handlePaymentDone(bot, query)) return;
    if (await handleDeliveryButton(bot, query)) return;

    console.log("Unhandled callback:", query.data);

  } catch (err) {
    console.log("Callback error:", err.message);
  }
});

// ================= ADMIN =================
bot.onText(/\/admin/, async (msg) => {
  try {
    await handleAdmin(bot, msg);
  } catch (err) {
    console.log("/admin error:", err.message);
  }
});

bot.onText(/\/testadmin/, async (msg) => {
  try {
    if (!ADMIN_CHAT_ID) {
      return bot.sendMessage(
        msg.chat.id,
        "❌ ADMIN_CHAT_ID missing."
      );
    }

    await bot.sendMessage(
      ADMIN_CHAT_ID,
      "Admin test message ✅"
    );

  } catch (err) {
    console.log("/testadmin error:", err.message);
  }
});

// ================= PHOTO =================
bot.on("photo", async (msg) => {
  try {
    await handlePaymentScreenshot(bot, msg);
  } catch (err) {
    console.log("Photo handler error:", err.message);
  }
});

// ================= MESSAGE =================
bot.on("message", async (msg) => {
  try {
    if (msg.text && msg.text.startsWith("/")) return;

    // Manual delivery has priority so admin text/photo/document is not
    // consumed by another admin flow after Delivery Done is pressed.
    if (await handleAdminDeliveryMessage(bot, msg)) return;
    if (await handleAdminProductMessage(bot, msg)) return;
    if (await handleAccountDetailsMessage(bot, msg)) return;

  } catch (err) {
    console.log("Message handler error:", err.message);
  }
});

// ================= ERRORS =================
bot.on("polling_error", (err) => {
  console.log("POLLING ERROR:", err.message);
});

// ================= CHANNEL DEBUG =================
bot.on("channel_post", (msg) => {
  console.log("CHANNEL ID:", msg.chat.id);
});

// ================= SERVER =================
http
  .createServer((req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/plain"
    });

    res.end("Bot is running");
  })
  .listen(process.env.PORT || 10000, () => {
    console.log("Server running...");
  });

function shutdown(signal) {
  console.log(`${signal} received. Stopping bot safely...`);
  bot.stopPolling()
    .catch(() => {})
    .finally(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

console.log("Bot running...");

// test auto update