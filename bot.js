require("dotenv").config();
console.log("STARTING BOT...");

const TelegramBot = require("node-telegram-bot-api");
const http = require("http");
const path = require("path");

// 🔹 IMPORT CONFIG
const { CHANNEL_LINK, ADMIN_CHAT_ID } = require(path.resolve(__dirname, "../config"));

// 🔹 IMPORT HANDLERS
const { forceJoin } = require("./handlers/forceJoin");
const { showMainMenu } = require("./handlers/menu");
const { handleSupport, handleIPProxy, handleDataImpulse, handleProxyIP, handleProxyGB,
        handleSwiftProxy, handleNiceProxy, handleABCProxy, handleProxySeller, handleProxyLight,
        handleNovProxy, handleIpRocketProxy, handleNodemaven, handleCliProxy, handleCherryProxy,
        handleDigiProxy, handleVPN, handleSubscription, handleProductOptions } = require("./handlers/index");
const { handleAdmin, handleAdminButtons } = require("./handlers/admin");
const { handleAdminStock } = require("./handlers/admin_stock");
const { handlePaymentMethod, handlePaymentScreenshot, handlePaymentDone, handleDeliveryButton, handleAdminDeliveryMessage } = require("./handlers/payment");

// 🔹 BOT INIT
if (!process.env.BOT_TOKEN) {
  console.log("❌ BOT_TOKEN missing in .env");
  process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

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
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 Join Channel", url: CHANNEL_LINK }],
          [{ text: "✅ Check Again", callback_data: "check_join" }]
        ]
      }
    };
    return bot.sendMessage(chatId, "👋 Welcome! Please join our channel first to use this bot.", opts);
  }

  showMainMenu(bot, chatId);
});

// ===================== CALLBACK =====================
bot.on("callback_query", async (query) => {
  const allowed = await checkAccess(query);
  if (!allowed) return;

  await bot.answerCallbackQuery(query.id);

  if (query.data === "check_join") {
    if (await checkAccess(query)) {
      await bot.answerCallbackQuery(query.id);
      return showMainMenu(bot, query.message.chat.id);
    }
    return bot.answerCallbackQuery(query.id, { text: "❌ Please join first!" });
  }

  // Admin + Features
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
});

// ===================== ADMIN =====================
bot.onText(/\/admin/, async (msg) => { await handleAdmin(bot, msg); });
bot.onText(/\/testadmin/, (msg) => { bot.sendMessage(ADMIN_CHAT_ID, "Admin test message ✅"); });

// ===================== PHOTO =====================
bot.on("photo", async (msg) => { await handlePaymentScreenshot(bot, msg); });

// ===================== MESSAGE =====================
bot.on("message", async (msg) => {
  if (msg.text && msg.text.startsWith("/")) return;
  await handleAdminDeliveryMessage(bot, msg);
});

// ===================== ERRORS =====================
bot.on("polling_error", (err) => console.log("POLLING ERROR:", err.message));

// ===================== SERVER =====================
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot is running");
}).listen(process.env.PORT || 10000, () => console.log("Server running..."));

console.log("Bot running...");