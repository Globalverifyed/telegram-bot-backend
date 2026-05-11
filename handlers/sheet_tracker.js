const axios = require("axios");

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

async function trackUser(user) {
  try {
    await axios.post(GOOGLE_SCRIPT_URL, {
      type: "user",
      userId: user.id,
      username: user.username || "No Username",
      name: user.first_name || "No Name",
      firstVisit: new Date().toLocaleString(),
      lastVisit: new Date().toLocaleString(),
      totalVisits: 1,
      totalOrders: 0
    });
  } catch (err) {
    console.log("User tracking error:", err.message);
  }
}

async function trackOrder(order) {
  try {
    await axios.post(GOOGLE_SCRIPT_URL, {
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
  } catch (err) {
    console.log("Order tracking error:", err.message);
  }
}

module.exports = {
  trackUser,
  trackOrder
};