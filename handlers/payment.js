const { reduceStock } = require("./stock_manager");
const { ADMIN_CHAT_IDS } = require("../config");
const { formatPrice, getPriceNumber } = require("./utils");
const { trackOrder } = require("./sheet_tracker");

let orders = {};
let deliveryMode = {};

const pendingOrders = {};
const deliveredOrders = {};

const USD_TO_BDT = 127;

function createOrderId(chatId) {
  return `${chatId}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

function convertDollarToTaka(price) {
  const dollar = getPriceNumber(price);
  if (!dollar) return "Contact Support";
  return `৳${Math.round(dollar * USD_TO_BDT)}`;
}

function getAdminIds() {
  const ids =
    ADMIN_CHAT_IDS.length > 0
      ? ADMIN_CHAT_IDS
      : [process.env.ADMIN_CHAT_ID].filter(Boolean);

  return [...new Set(ids.map(String).filter(Boolean))];
}

async function sendOrderToAdmins(bot, photoFileId, caption, orderId) {
  const adminIds = getAdminIds();

  if (adminIds.length === 0) {
    console.log("No admin ID configured.");
    return;
  }

  for (const adminId of adminIds) {
    try {
      await bot.sendPhoto(adminId, photoFileId, {
        caption,
        reply_markup: {
          inline_keyboard: [
            [{ text: "✅ Delivery Done", callback_data: `delivery_${orderId}` }]
          ]
        }
      });
    } catch (err) {
      console.log(`Admin notify failed for ${adminId}:`, err.message);
    }
  }
}

async function showPaymentMethods(bot, chatId, data) {
  orders[chatId] = {
    ...data,
    customerChatId: chatId,
    screenshotFileId: null,
    status: "waiting_payment",
    stockReduced: false
  };

  await bot.sendMessage(
    chatId,
    `💳 Payment for ${data.name}

📦 Package: ${data.package}
🧾 Type: ${data.accountType || "N/A"}
💰 Price: ${formatPrice(data.price)}`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "💰 Binance",
              callback_data: `pay_binance_${data.productKey || "product"}_${data.itemKey || "item"}`
            }
          ],
          [
            {
              text: "📱 Nagad Agent",
              callback_data: `pay_nagad_${data.productKey || "product"}_${data.itemKey || "item"}`
            }
          ],
          [{ text: "⬅️ Back", callback_data: data.back }]
        ]
      }
    }
  );
}

async function handlePaymentMethod(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;
  const order = orders[chatId];

  if (!order) return false;

  if (data.startsWith("pay_binance")) {
    await bot.sendMessage(
      chatId,
      `💰 Binance Payment

📦 Product: ${order.name}
📊 Package: ${order.package}
🧾 Type: ${order.accountType || "N/A"}
💵 Amount: ${formatPrice(order.price)}

🆔 Binance ID:
420284061

Payment complete হলে screenshot পাঠাও।`
    );
    return true;
  }

  if (data.startsWith("pay_nagad")) {
    await bot.sendMessage(
      chatId,
      `📱 Nagad Agent Payment

📦 Product: ${order.name}
📊 Package: ${order.package}
🧾 Type: ${order.accountType || "N/A"}
💰 Amount: ${convertDollarToTaka(order.price)}
💵 Rate: 1$ = ৳127

📞 Nagad Number:
01611237099 Agent
01911237099 Personal

Payment complete হলে screenshot পাঠাও।`
    );
    return true;
  }

  return false;
}

async function handlePaymentScreenshot(bot, msg) {
  const chatId = msg.chat.id;

  if (!orders[chatId]) return false;
  if (!msg.photo) return false;

  orders[chatId].screenshotFileId = msg.photo[msg.photo.length - 1].file_id;
  orders[chatId].status = "screenshot_received";

  await bot.sendMessage(chatId, "📸 Screenshot received. Now click Payment Done.", {
    reply_markup: {
      inline_keyboard: [[{ text: "✅ Payment Done", callback_data: "payment_done" }]]
    }
  });

  return true;
}

async function handlePaymentDone(bot, query) {
  const chatId = query.message.chat.id;
  const user = query.from;

  if (query.data !== "payment_done") return false;

  const order = orders[chatId];

  if (!order) {
    await bot.sendMessage(chatId, "❌ No order found.");
    return true;
  }

  if (!order.screenshotFileId) {
    await bot.sendMessage(chatId, "⚠️ আগে payment screenshot পাঠাও।");
    return true;
  }

  const orderId = createOrderId(chatId);
  const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "No Name";
  const username = user.username ? "@" + user.username : "No Username";
  const userId = user.id;

  order.orderId = orderId;
  order.customerName = name;
  order.username = username;
  order.userId = userId;
  order.status = "pending";
  order.createdAt = new Date().toISOString();

  if (order.productKey && order.itemKey && !order.stockReduced) {
    reduceStock(order.productKey, order.itemKey);
    order.stockReduced = true;
  }

  pendingOrders[orderId] = order;

  await trackOrder({
    orderId,
    userId,
    username,
    name,
    product: order.name,
    package: order.package,
    price: formatPrice(order.price),
    paymentStatus: "Paid",
    deliveryStatus: "Pending"
  });

  const adminCaption =
`🛒 New Order Received!

🧾 Order ID: ${orderId}
📦 Product: ${order.name}
📊 Package: ${order.package}
🧾 Type: ${order.accountType || "N/A"}
💰 Price: ${formatPrice(order.price)}
💰 Nagad Amount: ${convertDollarToTaka(order.price)}

👤 Name: ${name}
🔗 Username: ${username}
🆔 ID: ${userId}
💬 Customer Chat ID: ${chatId}`;

  await sendOrderToAdmins(bot, order.screenshotFileId, adminCaption, orderId);

  delete orders[chatId];

  await bot.sendMessage(
    chatId,
    `😊 Your order has been received.
Delivery may take 5 minutes to 1 hour.

@Globalverifyed_support`
  );

  return true;
}

async function handleDeliveryButton(bot, query) {
  const data = query.data;
  const adminId = query.from.id;

  if (!data.startsWith("delivery_")) return false;

  const orderId = data.replace("delivery_", "");
  const order = pendingOrders[orderId];

  if (!order) {
    await bot.sendMessage(adminId, "❌ Order not found or already delivered.");
    return true;
  }

  deliveryMode[adminId] = {
    orderId,
    customerChatId: order.customerChatId,
    order,
    adminOrderChatId: query.message.chat.id,
    adminOrderMessageId: query.message.message_id
  };

  await bot.sendMessage(
    adminId,
    `✅ Delivery mode active.

🧾 Order ID: ${orderId}
📦 Product: ${order.name}
📊 Package: ${order.package}
🧾 Type: ${order.accountType || "N/A"}
💰 Price: ${formatPrice(order.price)}

👤 Customer: ${order.customerName || "No Name"}
🔗 Username: ${order.username || "No Username"}
🆔 ID: ${order.userId || order.customerChatId}

আপনি এখন যেটা পাঠাবেন, সেটা শুধু এই order-এর customer-এর কাছেই যাবে।`
  );

  return true;
}

async function handleAdminDeliveryMessage(bot, msg) {
  const adminId = msg.from.id;

  if (!deliveryMode[adminId]) return false;

  const {
    orderId,
    customerChatId,
    order,
    adminOrderChatId,
    adminOrderMessageId
  } = deliveryMode[adminId];

  if (msg.text) {
    await bot.sendMessage(
      customerChatId,
      `🎉 Delivery Received!

🧾 Order ID: ${orderId}
📦 Product: ${order.name}
📊 Package: ${order.package}
🧾 Type: ${order.accountType || "N/A"}

🔐 Your Data:
${msg.text}`
    );
  } else if (msg.photo) {
    const photo = msg.photo[msg.photo.length - 1].file_id;

    await bot.sendPhoto(customerChatId, photo, {
      caption:
`🎉 Delivery Received!

🧾 Order ID: ${orderId}
📦 Product: ${order.name}
📊 Package: ${order.package}
🧾 Type: ${order.accountType || "N/A"}`
    });
  } else if (msg.document) {
    await bot.sendDocument(customerChatId, msg.document.file_id, {
      caption:
`🎉 Delivery Received!

🧾 Order ID: ${orderId}
📦 Product: ${order.name}
📊 Package: ${order.package}
🧾 Type: ${order.accountType || "N/A"}`
    });
  } else {
    await bot.sendMessage(adminId, "⚠️ Please send text, photo, or document.");
    return true;
  }

  order.status = "delivered";
  order.deliveredAt = new Date().toISOString();

  deliveredOrders[orderId] = order;

  delete pendingOrders[orderId];
  delete deliveryMode[adminId];

  await bot.editMessageReplyMarkup(
    {
      inline_keyboard: [[{ text: "✅ Delivery Success", callback_data: "delivery_success" }]]
    },
    {
      chat_id: adminOrderChatId,
      message_id: adminOrderMessageId
    }
  );

  await bot.sendMessage(adminId, "✅ Product delivered to customer successfully.");

  return true;
}

module.exports = {
  showPaymentMethods,
  handlePaymentMethod,
  handlePaymentScreenshot,
  handlePaymentDone,
  handleDeliveryButton,
  handleAdminDeliveryMessage,
  pendingOrders,
  deliveredOrders
};