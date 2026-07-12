const { listCustom, getCustom } = require("./catalog_store");
const { showPaymentMethods } = require("./payment");

function rows(items, size = 2) {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function showCustomProducts(bot, chatId) {
  const products = listCustom({ includeDisabled: false }).filter(p => Number(p.stock) > 0);
  if (!products.length) {
    await bot.sendMessage(chatId, "📭 No additional products are available right now.", { reply_markup: { inline_keyboard: [[{ text: "⬅ Back", callback_data: "others" }]] } });
    return;
  }
  const buttons = products.map(p => ({ text: `${p.name} • ${p.package} • ${p.price}`, callback_data: `cp|${p.id}` }));
  await bot.sendMessage(chatId, "🛍 More Products", { reply_markup: { inline_keyboard: [...rows(buttons), [{ text: "⬅ Back", callback_data: "others" }]] } });
}

async function handleCustomProducts(bot, query) {
  const data = query.data || "";
  const chatId = query.message.chat.id;
  if (data === "custom_products") { await showCustomProducts(bot, chatId); return true; }
  if (!data.startsWith("cp|")) return false;
  const id = data.split("|")[1]; const p = getCustom(id);
  if (!p || p.enabled === false || Number(p.stock) <= 0) { await bot.sendMessage(chatId, "❌ This product is currently unavailable."); return true; }
  await showPaymentMethods(bot, chatId, {
    catalogId: id,
    customProduct: true,
    productKey: `custom:${id}`,
    itemKey: id,
    name: p.name,
    package: p.package,
    price: p.price,
    description: p.description,
    stock: `${p.stock} Available`,
    back: "custom_products"
  });
  return true;
}

module.exports = { handleCustomProducts, showCustomProducts };
