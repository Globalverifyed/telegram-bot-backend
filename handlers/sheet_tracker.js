const axios = require("axios");

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

async function sendToSheet(payload) {
  try {
    if (!GOOGLE_SCRIPT_URL) {
      console.log("GOOGLE_SCRIPT_URL missing");
      return;
    }

    await axios.post(GOOGLE_SCRIPT_URL, payload);
  } catch (err) {
    console.log("Sheet tracking error:", err.message);
  }
}

async function trackUser(user) {
  await sendToSheet({
    type: "user",
    userId: user.id,
    username: user.username ? "@" + user.username : "No Username",
    name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "No Name",
    firstVisit: new Date().toLocaleString(),
    lastVisit: new Date().toLocaleString(),
    totalVisits: 1,
    totalOrders: 0
  });
}

async function trackOrder(order) {
  await sendToSheet({
    type: "order",
    orderId: order.orderId,
    userId: order.userId,
    username: order.username,
    name: order.name,
    product: order.product,
    package: order.package,
    price: order.price,
    paymentStatus: order.paymentStatus,
    deliveryStatus: order.deliveryStatus,
    date: new Date().toLocaleString()
  });
}

async function updateOrderDelivered(order) {
  await sendToSheet({
    type: "order",
    orderId: order.orderId,
    userId: order.userId,
    username: order.username,
    name: order.customerName || order.name || "No Name",
    product: order.name,
    package: order.package,
    price: order.price,
    paymentStatus: "Paid",
    deliveryStatus: "Delivered",
    date: new Date().toLocaleString()
  });
}

module.exports = {
  trackUser,
  trackOrder,
  updateOrderDelivered
};