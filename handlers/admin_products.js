const { ADMIN_CHAT_IDS } = require("../config");
const {
  addCustom,
  getCustom,
  listCustom,
  updateCustom,
  changeCustomStock,
  deleteCustom,
  setOverride,
  applyOverride
} = require("./catalog_store");
const { stockRegistry, updateStock, getStock } = require("./stock_manager");
const { trackProductChange } = require("./sheet_tracker");

const sessions = new Map();

function isAdmin(id) {
  return ADMIN_CHAT_IDS.map(String).includes(String(id));
}

function rows(items, size = 1) {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function showProductManager(bot, chatId) {
  await bot.sendMessage(chatId, "🛍 Product Manager\n\nManage existing products or add new products without editing code.", {
    reply_markup: { inline_keyboard: [
      [{ text: "➕ Add New Product", callback_data: "pm_add" }],
      [{ text: "✏️ Manage Existing Products", callback_data: "pm_existing" }],
      [{ text: "🧩 Manage Added Products", callback_data: "pm_custom" }],
      [{ text: "⬅ Back Admin", callback_data: "admin_back" }]
    ]}
  });
}

async function showExistingGroups(bot, chatId) {
  const buttons = Object.entries(stockRegistry).map(([key, product]) => ({
    text: product.title,
    callback_data: `pmg|${key}`
  }));
  await bot.sendMessage(chatId, "✏️ Select an existing product group:", {
    reply_markup: { inline_keyboard: [...rows(buttons, 1), [{ text: "⬅ Back", callback_data: "admin_products" }]] }
  });
}

async function showExistingItems(bot, chatId, productKey) {
  const group = stockRegistry[productKey];
  if (!group) return bot.sendMessage(chatId, "❌ Product group not found.");
  const buttons = Object.entries(group.items).map(([itemKey, item]) => ({
    text: `${item.label} — ${item.stock}`,
    callback_data: `pmi|${productKey}|${itemKey}`
  }));
  await bot.sendMessage(chatId, `${group.title}\nSelect package:`, {
    reply_markup: { inline_keyboard: [...rows(buttons, 1), [{ text: "⬅ Back", callback_data: "pm_existing" }]] }
  });
}

async function showExistingItem(bot, chatId, productKey, itemKey) {
  const group = stockRegistry[productKey];
  const item = group?.items?.[itemKey];
  if (!item) return bot.sendMessage(chatId, "❌ Product not found.");
  const id = `${productKey}:${itemKey}`;
  const view = applyOverride(id, { name: group.title, package: item.label, price: "Use current coded price" });
  await bot.sendMessage(chatId,
    `📦 Existing Product\n\nName: ${view.name}\nPackage: ${view.package}\nPrice override: ${view.price}\nStock: ${getStock(productKey, itemKey)}\nStatus: ${view.enabled === false ? "Disabled" : "Enabled"}`,
    { reply_markup: { inline_keyboard: [
      [{ text: "✏️ Edit Name", callback_data: `pme|${productKey}|${itemKey}|name` }, { text: "📦 Edit Package", callback_data: `pme|${productKey}|${itemKey}|package` }],
      [{ text: "💰 Edit Price", callback_data: `pme|${productKey}|${itemKey}|price` }],
      [{ text: "➕ Stock", callback_data: `pms|${productKey}|${itemKey}|add` }, { text: "➖ Stock", callback_data: `pms|${productKey}|${itemKey}|remove` }],
      [{ text: "🎯 Set Exact Stock", callback_data: `pms|${productKey}|${itemKey}|set` }],
      [{ text: view.enabled === false ? "✅ Enable" : "⛔ Disable", callback_data: `pmt|${productKey}|${itemKey}` }],
      [{ text: "⬅ Back", callback_data: `pmg|${productKey}` }]
    ]}}
  );
}

async function showCustomList(bot, chatId) {
  const products = listCustom();
  if (!products.length) {
    await bot.sendMessage(chatId, "📭 No admin-added products yet.", {
      reply_markup: { inline_keyboard: [[{ text: "➕ Add Product", callback_data: "pm_add" }], [{ text: "⬅ Back", callback_data: "admin_products" }]] }
    });
    return;
  }
  const buttons = products.map(p => ({ text: `${p.enabled === false ? "⛔" : "✅"} ${p.name} | ${p.package} | ${p.stock}`, callback_data: `pmc|${p.id}` }));
  await bot.sendMessage(chatId, "🧩 Admin-added products:", {
    reply_markup: { inline_keyboard: [...rows(buttons), [{ text: "⬅ Back", callback_data: "admin_products" }]] }
  });
}

async function showCustomItem(bot, chatId, id) {
  const p = getCustom(id);
  if (!p) return bot.sendMessage(chatId, "❌ Product not found.");
  await bot.sendMessage(chatId,
    `🧩 Product Details\n\nName: ${p.name}\nPackage: ${p.package}\nPrice: ${p.price}\nStock: ${p.stock}\nStatus: ${p.enabled === false ? "Disabled" : "Enabled"}\nDescription: ${p.description || "None"}`,
    { reply_markup: { inline_keyboard: [
      [{ text: "✏️ Name", callback_data: `pmce|${id}|name` }, { text: "📦 Package", callback_data: `pmce|${id}|package` }],
      [{ text: "💰 Price", callback_data: `pmce|${id}|price` }, { text: "📝 Description", callback_data: `pmce|${id}|description` }],
      [{ text: "➕ Stock", callback_data: `pmcs|${id}|add` }, { text: "➖ Stock", callback_data: `pmcs|${id}|remove` }],
      [{ text: "🎯 Set Stock", callback_data: `pmcs|${id}|set` }],
      [{ text: p.enabled === false ? "✅ Enable" : "⛔ Disable", callback_data: `pmct|${id}` }],
      [{ text: "🗑 Delete", callback_data: `pmcd|${id}` }],
      [{ text: "⬅ Back", callback_data: "pm_custom" }]
    ]}}
  );
}

async function handleAdminProducts(bot, query) {
  if (!isAdmin(query.from.id)) return false;
  const chatId = query.message.chat.id;
  const data = query.data || "";

  if (data === "admin_products") { await showProductManager(bot, chatId); return true; }
  if (data === "pm_existing") { await showExistingGroups(bot, chatId); return true; }
  if (data === "pm_custom") { await showCustomList(bot, chatId); return true; }
  if (data === "pm_add") {
    sessions.set(chatId, { kind: "add", step: "name", draft: {} });
    await bot.sendMessage(chatId, "➕ Send product name.\n\nUse /cancel to stop."); return true;
  }
  if (data.startsWith("pmg|")) { await showExistingItems(bot, chatId, data.split("|")[1]); return true; }
  if (data.startsWith("pmi|")) { const [,pk,ik] = data.split("|"); await showExistingItem(bot, chatId, pk, ik); return true; }
  if (data.startsWith("pme|")) {
    const [,pk,ik,field] = data.split("|");
    sessions.set(chatId, { kind: "existingEdit", productKey: pk, itemKey: ik, field });
    await bot.sendMessage(chatId, `Send new ${field}. Use /cancel to stop.`); return true;
  }
  if (data.startsWith("pms|")) {
    const [,pk,ik,mode] = data.split("|");
    sessions.set(chatId, { kind: "existingStock", productKey: pk, itemKey: ik, mode });
    await bot.sendMessage(chatId, `Send stock quantity to ${mode}.`); return true;
  }
  if (data.startsWith("pmt|")) {
    const [,pk,ik] = data.split("|"); const id = `${pk}:${ik}`;
    const current = applyOverride(id, {}).enabled !== false;
    setOverride(id, { enabled: !current });
    await trackProductChange("toggle", { id, enabled: !current });
    await showExistingItem(bot, chatId, pk, ik); return true;
  }
  if (data.startsWith("pmc|")) { await showCustomItem(bot, chatId, data.split("|")[1]); return true; }
  if (data.startsWith("pmce|")) {
    const [,id,field] = data.split("|"); sessions.set(chatId, { kind: "customEdit", id, field });
    await bot.sendMessage(chatId, `Send new ${field}. Use /cancel to stop.`); return true;
  }
  if (data.startsWith("pmcs|")) {
    const [,id,mode] = data.split("|"); sessions.set(chatId, { kind: "customStock", id, mode });
    await bot.sendMessage(chatId, `Send stock quantity to ${mode}.`); return true;
  }
  if (data.startsWith("pmct|")) {
    const id = data.split("|")[1]; const p = getCustom(id); if (!p) return true;
    const updated = updateCustom(id, { enabled: p.enabled === false }); await trackProductChange("toggle", updated);
    await showCustomItem(bot, chatId, id); return true;
  }
  if (data.startsWith("pmcd|")) {
    const id = data.split("|")[1];
    await bot.sendMessage(chatId, "⚠️ Delete this product permanently?", { reply_markup: { inline_keyboard: [[{ text: "✅ Yes, Delete", callback_data: `pmcdyes|${id}` }], [{ text: "❌ Cancel", callback_data: `pmc|${id}` }]] } }); return true;
  }
  if (data.startsWith("pmcdyes|")) {
    const id = data.split("|")[1]; const old = getCustom(id); deleteCustom(id); if (old) await trackProductChange("delete", old);
    await bot.sendMessage(chatId, "✅ Product deleted."); await showCustomList(bot, chatId); return true;
  }
  return false;
}

async function handleAdminProductMessage(bot, msg) {
  const chatId = msg.chat.id;
  if (!isAdmin(msg.from.id) || !sessions.has(chatId) || !msg.text) return false;
  const text = msg.text.trim();
  if (text === "/cancel") { sessions.delete(chatId); await bot.sendMessage(chatId, "❌ Operation cancelled."); return true; }
  const s = sessions.get(chatId);

  if (s.kind === "add") {
    const next = { name: "package", package: "price", price: "stock", stock: "description" };
    if (s.step === "stock") {
      const n = Number.parseInt(text, 10); if (!Number.isInteger(n) || n < 0) { await bot.sendMessage(chatId, "❌ Send a valid stock number (0 or more)."); return true; }
      s.draft.stock = n;
    } else s.draft[s.step] = text === "skip" && s.step === "description" ? "" : text;
    if (s.step === "description") {
      const product = addCustom(s.draft); sessions.delete(chatId); await trackProductChange("add", product);
      await bot.sendMessage(chatId, "✅ Product added successfully."); await showCustomItem(bot, chatId, product.id); return true;
    }
    s.step = next[s.step]; sessions.set(chatId, s);
    const prompts = { package: "Send package/plan name.", price: "Send price (example: $5.00).", stock: "Send starting stock number.", description: "Send description, or type skip." };
    await bot.sendMessage(chatId, prompts[s.step]); return true;
  }

  if (s.kind === "existingEdit") {
    setOverride(`${s.productKey}:${s.itemKey}`, { [s.field]: text }); sessions.delete(chatId);
    await trackProductChange("edit", { id: `${s.productKey}:${s.itemKey}`, [s.field]: text });
    await bot.sendMessage(chatId, "✅ Product updated."); await showExistingItem(bot, chatId, s.productKey, s.itemKey); return true;
  }
  if (s.kind === "existingStock") {
    const n = Number.parseInt(text, 10); if (!Number.isInteger(n) || n < 0) { await bot.sendMessage(chatId, "❌ Send a valid number."); return true; }
    const current = getStock(s.productKey, s.itemKey); const delta = s.mode === "set" ? n-current : s.mode === "remove" ? -n : n;
    updateStock(s.productKey, s.itemKey, delta); sessions.delete(chatId);
    await trackProductChange("stock", { id: `${s.productKey}:${s.itemKey}`, stock: getStock(s.productKey, s.itemKey) });
    await bot.sendMessage(chatId, "✅ Stock updated."); await showExistingItem(bot, chatId, s.productKey, s.itemKey); return true;
  }
  if (s.kind === "customEdit") {
    const p = updateCustom(s.id, { [s.field]: text === "skip" ? "" : text }); sessions.delete(chatId); if (p) await trackProductChange("edit", p);
    await bot.sendMessage(chatId, "✅ Product updated."); await showCustomItem(bot, chatId, s.id); return true;
  }
  if (s.kind === "customStock") {
    const n = Number.parseInt(text, 10); if (!Number.isInteger(n) || n < 0) { await bot.sendMessage(chatId, "❌ Send a valid number."); return true; }
    const p = getCustom(s.id); if (!p) { sessions.delete(chatId); return true; }
    if (s.mode === "set") updateCustom(s.id, { stock: n }); else changeCustomStock(s.id, s.mode === "remove" ? -n : n);
    sessions.delete(chatId); const updated = getCustom(s.id); await trackProductChange("stock", updated);
    await bot.sendMessage(chatId, "✅ Stock updated."); await showCustomItem(bot, chatId, s.id); return true;
  }
  return false;
}

module.exports = { handleAdminProducts, handleAdminProductMessage, showProductManager };
