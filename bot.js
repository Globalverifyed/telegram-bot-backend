// bot.js
require("dotenv").config();
console.log("STARTING BOT...");

const TelegramBot = require("node-telegram-bot-api");
const http = require("http");

const { ADMIN_CHAT_ID } = require("./config");

const { forceJoin } = require("./handlers/forcejoin");
const { showMainMenu } = require("./handlers/menu");

const {
  handleSupport,
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

const {
  handlePaymentMethod,
  handlePaymentScreenshot,
  handlePaymentDone,
  handleDeliveryButton,
  handleAdminDeliveryMessage
} = require("./handlers/payment");

if (!process.env.BOT_TOKEN) {
  console.log("❌ BOT_TOKEN missing in .env / Render Environment");
  process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

async function checkAccess(update) {
  try {
    return await forceJoin(bot, update);
  } catch (err) {
    console.log("CheckAccess error:", err.message);
    return false;
  }
}

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  console.log("START command triggered by:", msg.from?.username || chatId);

  const allowed = await checkAccess(msg);
  if (!allowed) return;

  return showMainMenu(bot, chatId);
});

bot.on("callback_query", async (query) => {
  try {
    const allowed = await checkAccess(query);
    if (!allowed) return;

    await bot.answerCallbackQuery(query.id).catch(() => {});

    if (await handleAdminStock(bot, query)) return;
    if (await handleAdminButtons(bot, query)) return;

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

    if (await handleProductOptions(bot, query)) return;

    if (await handlePaymentMethod(bot, query)) return;
    if (await handlePaymentDone(bot, query)) return;
    if (await handleDeliveryButton(bot, query)) return;

    console.log("Unhandled callback:", query.data);
  } catch (err) {
    console.log("Callback error:", err.message);
  }
});

bot.onText(/\/admin/, async (msg) => {
  await handleAdmin(bot, msg);
});

bot.onText(/\/testadmin/, async (msg) => {
  if (!ADMIN_CHAT_ID) return bot.sendMessage(msg.chat.id, "❌ ADMIN_CHAT_ID missing.");
  await bot.sendMessage(ADMIN_CHAT_ID, "Admin test message ✅");
});

bot.on("photo", async (msg) => {
  await handlePaymentScreenshot(bot, msg);
});

bot.on("message", async (msg) => {
  if (msg.text && msg.text.startsWith("/")) return;
  await handleAdminDeliveryMessage(bot, msg);
});

bot.on("polling_error", (err) => {
  console.log("POLLING ERROR:", err.message);
});

bot.on("channel_post", (msg) => {
  console.log("CHANNEL ID:", msg.chat.id);
});

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot is running");
  })
  .listen(process.env.PORT || 10000, () => {
    console.log("Server running...");
  });

console.log("Bot running...");