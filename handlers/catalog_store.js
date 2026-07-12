const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const FILE = path.join(DATA_DIR, "catalog.json");

const state = { overrides: {}, custom: {} };

function ensure() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function load() {
  ensure();
  if (!fs.existsSync(FILE)) {
    save();
    return;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(FILE, "utf8"));
    state.overrides = parsed.overrides && typeof parsed.overrides === "object" ? parsed.overrides : {};
    state.custom = parsed.custom && typeof parsed.custom === "object" ? parsed.custom : {};
  } catch (err) {
    console.error("Catalog load error:", err.message);
    save();
  }
}

function save() {
  ensure();
  const temp = `${FILE}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(state, null, 2));
  fs.renameSync(temp, FILE);
  return true;
}

function sanitizePatch(patch) {
  const out = {};
  for (const key of ["name", "package", "price", "description", "back", "productKey", "itemKey"]) {
    if (patch[key] !== undefined) out[key] = String(patch[key]).trim();
  }
  if (patch.enabled !== undefined) out.enabled = Boolean(patch.enabled);
  return out;
}

function applyOverride(id, base) {
  const override = state.overrides[id] || {};
  return { ...base, ...override, catalogId: id, enabled: override.enabled !== false };
}

function setOverride(id, patch) {
  state.overrides[id] = { ...(state.overrides[id] || {}), ...sanitizePatch(patch) };
  save();
  return state.overrides[id];
}

function clearOverride(id) {
  delete state.overrides[id];
  save();
}

function makeId() {
  let id;
  do id = `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  while (state.custom[id]);
  return id;
}

function addCustom(input) {
  const id = makeId();
  state.custom[id] = {
    name: String(input.name || "Custom Product").trim(),
    package: String(input.package || "Standard").trim(),
    price: String(input.price || "$0").trim(),
    description: String(input.description || "").trim(),
    stock: Math.max(0, Number.parseInt(input.stock, 10) || 0),
    enabled: input.enabled !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  save();
  return { id, ...state.custom[id] };
}

function getCustom(id) {
  const product = state.custom[id];
  return product ? { id, ...product } : null;
}

function listCustom({ includeDisabled = true } = {}) {
  return Object.entries(state.custom)
    .map(([id, p]) => ({ id, ...p }))
    .filter((p) => includeDisabled || p.enabled !== false);
}

function updateCustom(id, patch) {
  if (!state.custom[id]) return null;
  const safe = sanitizePatch(patch);
  if (patch.stock !== undefined) safe.stock = Math.max(0, Number.parseInt(patch.stock, 10) || 0);
  state.custom[id] = { ...state.custom[id], ...safe, updatedAt: new Date().toISOString() };
  save();
  return getCustom(id);
}

function changeCustomStock(id, delta) {
  const p = state.custom[id];
  if (!p) return null;
  p.stock = Math.max(0, (Number(p.stock) || 0) + Number(delta || 0));
  p.updatedAt = new Date().toISOString();
  save();
  return p.stock;
}

function reduceCustomStock(id) {
  const p = state.custom[id];
  if (!p || Number(p.stock) <= 0) return false;
  p.stock -= 1;
  p.updatedAt = new Date().toISOString();
  save();
  return true;
}

function deleteCustom(id) {
  if (!state.custom[id]) return false;
  delete state.custom[id];
  save();
  return true;
}

load();

module.exports = {
  applyOverride,
  setOverride,
  clearOverride,
  addCustom,
  getCustom,
  listCustom,
  updateCustom,
  changeCustomStock,
  reduceCustomStock,
  deleteCustom,
  save
};
