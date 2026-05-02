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

if (!process.env.BOT_TOKEN) {
  console.log("❌ BOT_TOKEN missing in .env");
  process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

bot.onText(/\/start/, (msg) => {
  showMainMenu(bot, msg.chat.id);
});

bot.onText(/\/admin/, async (msg) => {
  await handleAdmin(bot, msg);
});

bot.onText(/\/testadmin/, (msg) => {
  bot.sendMessage(process.env.ADMIN_CHAT_ID, "Admin test message ✅");
});

bot.on("photo", async (msg) => {
  await handlePaymentScreenshot(bot, msg);
});

bot.on("message", async (msg) => {
  if (msg.text && msg.text.startsWith("/")) return;
  if (await handleAdminDeliveryMessage(bot, msg)) return;
});

bot.on("callback_query", async (query) => {
  bot.answerCallbackQuery(query.id).catch(() => {});

  console.log("CLICK:", query.data);

  // ADMIN FIRST
  if (await handleAdminStock(bot, query)) return;
  if (await handleAdminButtons(bot, query)) return;

  // MAIN MENU
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

  // PRODUCT OPTIONS
  if (await handleProductOptions(bot, query)) return;

  // PAYMENT
  if (await handlePaymentMethod(bot, query)) return;
  if (await handlePaymentDone(bot, query)) return;
  if (await handleDeliveryButton(bot, query)) return;
});

bot.on("polling_error", (error) => {
  console.log("POLLING ERROR:", error.message);
});

console.log("Bot running...");

const PORT = process.env.PORT || 10000;

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot is running");
  })
  .listen(PORT, () => {
    console.log("Server running on port", PORT);
  });