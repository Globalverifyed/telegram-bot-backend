require("dotenv").config();

console.log("STARTING BOT...");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT ERROR:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED ERROR:", err);
});

const TelegramBot = require("node-telegram-bot-api");
const http = require("http");

// 🔹 IMPORTS
const { forceJoin } = require("./handlers/forceJoin");
const { showMainMenu } = require("./handlers/menu");

const { handleSupport } = require("./handlers/support");
const { handleIPProxy } = require("./handlers/ip_proxy");
const { handleDataImpulse } = require("./handlers/dataimpulse");
const { handleProxyIP } = require("./handlers/9proxy_ip");
const { handleProxyGB } = require("./handlers/9proxy_gb");
const { handleSwiftProxy } = require("./handlers/swift_proxy");
const { handleNiceProxy } = require("./handlers/nice_proxy");
const { handleABCProxy } = require("./handlers/abc_proxy");
const { handleProxySeller } = require("./handlers/proxy_seller");
const { handleProxyLight } = require("./handlers/proxy_light");
const { handleNovProxy } = require("./handlers/nov_proxy");
const { handleIpRocketProxy } = require("./handlers/iprocket_proxy");
const { handleNodemaven } = require("./handlers/nodemaven");
const { handleCliProxy } = require("./handlers/cliproxy");
const { handleCherryProxy } = require("./handlers/cherry_proxy");
const { handleDigiProxy } = require("./handlers/digi_proxy");

const { handleVPN } = require("./handlers/vpn");
const { handleSubscription } = require("./handlers/subscription");
const { handleProductOptions } = require("./handlers/product_options");

const { handleAdmin, handleAdminButtons } = require("./handlers/admin");
const { handleAdminStock } = require("./handlers/admin_stock");

const {
  handlePaymentMethod,
  handlePaymentScreenshot,
  handlePaymentDone,
  handleDeliveryButton,
  handleAdminDeliveryMessage
} = require("./handlers/payment");

// 🔹 BOT INIT
if (!process.env.BOT_TOKEN) {
  console.log("❌ BOT_TOKEN missing in .env");
  process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

// ===================== HELP FUNCTION =====================
async function checkAccess(update) {
  try {
    return await forceJoin(bot, update);
  } catch (err) {
    console.log("CheckAccess error:", err);
    return false;
  }
}

// ===================== START =====================
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  console.log("START command triggered by:", msg.chat.username || chatId);

  const allowed = await checkAccess(msg);
  if (!allowed) {
    return bot.sendMessage(chatId, "❌ Please join our channel first to use the bot!");
  }

  showMainMenu(bot, chatId);
});

// ===================== ADMIN =====================
bot.onText(/\/admin/, async (msg) => {
  await handleAdmin(bot, msg);
});

// ===================== TEST =====================
bot.onText(/\/testadmin/, (msg) => {
  bot.sendMessage(process.env.ADMIN_CHAT_ID, "Admin test message ✅");
});

// ===================== PHOTO PAYMENT =====================
bot.on("photo", async (msg) => {
  await handlePaymentScreenshot(bot, msg);
});

// ===================== MESSAGE =====================
bot.on("message", async (msg) => {
  if (msg.text && msg.text.startsWith("/")) return;

  await handleAdminDeliveryMessage(bot, msg);
});

// ===================== CALLBACK =====================
bot.on("callback_query", async (query) => {
  console.log("CLICK:", query.data);

  // 🔹 JOIN CHECK BUTTON
  if (query.data === "check_join") {
    const allowed = await checkAccess(query);

    if (allowed) {
      await bot.answerCallbackQuery(query.id);
      return showMainMenu(bot, query.message.chat.id);
    }
    return bot.answerCallbackQuery(query.id, { text: "❌ Please join first!" });
  }

  // 🔹 FORCE JOIN CHECK
  const allowed = await checkAccess(query);
  if (!allowed) return;

  await bot.answerCallbackQuery(query.id);

  // 🔹 ADMIN
  if (await handleAdminStock(bot, query)) return;
  if (await handleAdminButtons(bot, query)) return;

  // 🔹 MAIN FEATURES
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

  // 🔹 PRODUCTS
  if (await handleProductOptions(bot, query)) return;

  // 🔹 PAYMENT
  if (await handlePaymentMethod(bot, query)) return;
  if (await handlePaymentDone(bot, query)) return;
  if (await handleDeliveryButton(bot, query)) return;

  console.log("Unhandled callback:", query.data);
});

// ===================== ERRORS =====================
bot.on("polling_error", (error) => {
  console.log("POLLING ERROR:", error.message);
});

// ===================== CHANNEL DEBUG =====================
bot.on("channel_post", (msg) => {
  console.log("CHANNEL ID:", msg.chat.id);
});

// ===================== SERVER =====================
const PORT = process.env.PORT || 10000;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot is running");
}).listen(PORT, () => {
  console.log("Server running on port", PORT);
});

console.log("Bot running...");