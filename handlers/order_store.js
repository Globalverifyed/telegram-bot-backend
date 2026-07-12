const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE_PATH = path.join(DATA_DIR, 'orders.json');

function ensureStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify({ pending: {}, delivered: {}, deliverySessions: {} }, null, 2));
  }
}

function readStore() {
  ensureStore();
  try {
    const parsed = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
    return {
      pending: parsed && typeof parsed.pending === 'object' ? parsed.pending : {},
      delivered: parsed && typeof parsed.delivered === 'object' ? parsed.delivered : {},
      deliverySessions: parsed && typeof parsed.deliverySessions === 'object' ? parsed.deliverySessions : {}
    };
  } catch (error) {
    console.error('Order store read failed:', error.message);
    return { pending: {}, delivered: {}, deliverySessions: {} };
  }
}

function writeStore(data) {
  ensureStore();
  const tempPath = `${FILE_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
  fs.renameSync(tempPath, FILE_PATH);
}

const store = readStore();
const pendingOrders = store.pending;
const deliveredOrders = store.delivered;
const deliverySessions = store.deliverySessions;

function persistOrders() {
  writeStore({ pending: pendingOrders, delivered: deliveredOrders, deliverySessions });
}

function addPending(orderId, order) {
  pendingOrders[orderId] = order;
  persistOrders();
}


function setDeliverySession(adminId, session) {
  deliverySessions[String(adminId)] = session;
  persistOrders();
}

function clearDeliverySession(adminId) {
  delete deliverySessions[String(adminId)];
  persistOrders();
}

function markDelivered(orderId, order) {
  order.status = 'delivered';
  order.deliveredAt = order.deliveredAt || new Date().toISOString();
  deliveredOrders[orderId] = order;
  delete pendingOrders[orderId];
  persistOrders();
}

module.exports = {
  pendingOrders,
  deliveredOrders,
  addPending,
  markDelivered,
  persistOrders,
  deliverySessions,
  setDeliverySession,
  clearDeliverySession,
  FILE_PATH
};
