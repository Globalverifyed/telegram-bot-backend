require("dotenv").config();

console.log("STARTING BOT...");

// ===== ERROR HANDLING =====
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT ERROR:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED ERROR:", err);
});

const TelegramBot = require("node-telegram-bot-api");
const http = require("http");

// ===== IMPORT HANDLERS =====
const { showMainMenu } = require("./handlers/menu");
const { handleSupport } = require("./handlers/support");
const { handleIPProxy } = require("./handlers/ip_proxy");
const { handleDataImpulse } = require("./handlers/dataimpulse");
const { handleProductOptions } = require("./handlers/product_options");
const { handleProxyIP } = require("./handlers/9proxy_ip");
const { handleProxyGB } = require("./handlers/9proxy_gb");
const {
  handlePaymentMethod,
  handlePaymentScreenshot,
  handlePaymentDone,
  handleDeliveryButton,
  handleAdminDeliveryMessage
} = require("./handlers/payment");

// ===== ENV CHECK =====
if (!process.env.BOT_TOKEN) {
  console.log("❌ BOT_TOKEN missing in .env");
  process.exit(1);
}

if (!process.env.ADMIN_CHAT_ID) {
  console.log("⚠️ ADMIN_CHAT_ID missing in .env");
}

// ===== BOT INIT =====
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

// ===== START COMMAND =====
bot.onText(/\/start/, (msg) => {
  showMainMenu(bot, msg.chat.id);
});

// ===== ADMIN TEST =====
bot.onText(/\/testadmin/, (msg) => {
  bot.sendMessage(process.env.ADMIN_CHAT_ID, "Admin test message ✅");
});

// ===== PHOTO HANDLER =====
bot.on("photo", async (msg) => {
  await handlePaymentScreenshot(bot, msg);
});

// ===== ADMIN DELIVERY MESSAGE HANDLER =====
bot.on("message", async (msg) => {
  if (msg.text && msg.text.startsWith("/")) return;
  if (await handleAdminDeliveryMessage(bot, msg)) return;
});

// ===== BUTTON CLICK HANDLER =====
bot.on("callback_query", async (query) => {
  bot.answerCallbackQuery(query.id).catch(() => {});

  console.log("CLICK:", query.data);

  if (await handleSupport(bot, query)) return;
  if (await handleIPProxy(bot, query)) return;
  if (await handleDataImpulse(bot, query)) return;
  if (await handleProxyIP(bot, query)) return;

  if (await handlePaymentMethod(bot, query)) return;
  if (await handlePaymentDone(bot, query)) return;
  if (await handleDeliveryButton(bot, query)) return;
  if (await handleProxyGB(bot, query)) return;


});

// ===== POLLING ERROR =====
bot.on("polling_error", (error) => {
  console.log("POLLING ERROR:", error.message);
});

console.log("Bot running...");

// ===== HTTP SERVER =====
const PORT = process.env.PORT || 10000;

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot is running");
  })
  .listen(PORT, () => {
    console.log("Server running on port", PORT);
  });