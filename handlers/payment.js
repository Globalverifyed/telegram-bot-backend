let orders = {};
let deliveryMode = {};

const pendingOrders = {};
const deliveredOrders = {};

const USD_TO_BDT = 127;

function convertDollarToTaka(price) {
  const dollar = parseFloat(String(price).replace(/[^0-9.]/g, ""));

  if (Number.isNaN(dollar)) {
    return "Contact Support";
  }

  return `৳${Math.round(dollar * USD_TO_BDT)}`;
}

// ================= SHOW PAYMENT METHODS =================
async function showPaymentMethods(bot, chatId, data) {
  orders[chatId] = {
    ...data,
    customerChatId: chatId,
    screenshotFileId: null,
    status: "waiting_payment"
  };

  await bot.sendMessage(
    chatId,
    `💳 Payment for ${data.name}
📦 Package: ${data.package}
🧾 Type: ${data.accountType || "N/A"}
💰 Price: ${data.price}`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "💰 Binance", callback_data: "pay_binance" }],
          [{ text: "📱 Nagad Agent", callback_data: "pay_nagad" }],
          [{ text: "⬅ Back", callback_data: data.back }]
        ]
      }
    }
  );
}

// ================= PAYMENT METHOD =================
async function handlePaymentMethod(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;
  const order = orders[chatId];

  if (!order) return false;

  if (data === "pay_binance") {
    await bot.sendMessage(
      chatId,
      `💰 Binance Payment

📦 Product: ${order.name}
📊 Package: ${order.package}
🧾 Type: ${order.accountType || "N/A"}
💵 Amount: ${order.price}

🆔 Binance ID:
420284061

Payment complete হলে screenshot পাঠাও।`
    );
    return true;
  }

  if (data === "pay_nagad") {
    await bot.sendMessage(
      chatId,
      `📱 Nagad Agent Payment

📦 Product: ${order.name}
📊 Package: ${order.package}
🧾 Type: ${order.accountType || "N/A"}
💰 Amount: ${convertDollarToTaka(order.price)}
💵 Rate: 1$ = ৳127

📞 Nagad Number:
01611237099

Payment complete হলে screenshot পাঠাও।`
    );
    return true;
  }

  return false;
}

// ================= SCREENSHOT RECEIVE =================
async function handlePaymentScreenshot(bot, msg) {
  const chatId = msg.chat.id;

  if (!orders[chatId]) return false;
  if (!msg.photo) return false;

  const photo = msg.photo[msg.photo.length - 1].file_id;

  orders[chatId].screenshotFileId = photo;
  orders[chatId].status = "screenshot_received";

  await bot.sendMessage(chatId, "📸 Screenshot received. Now click Payment Done.", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "✅ Payment Done", callback_data: "payment_done" }]
      ]
    }
  });

  return true;
}

// ================= PAYMENT DONE =================
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

  const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "No Name";
  const username = user.username ? "@" + user.username : "No Username";
  const userId = user.id;

  order.customerName = name;
  order.username = username;
  order.userId = userId;
  order.status = "pending";
  order.createdAt = new Date().toISOString();

  pendingOrders[chatId] = order;

  const adminCaption =
    `🛒 New Order Received!\n\n` +
    `📦 Product: ${order.name}\n` +
    `📊 Package: ${order.package}\n` +
    `🧾 Type: ${order.accountType || "N/A"}\n` +
    `💰 Price: ${order.price}\n` +
    `💰 Nagad Amount: ${convertDollarToTaka(order.price)}\n\n` +
    `👤 Name: ${name}\n` +
    `🔗 Username: ${username}\n` +
    `🆔 ID: ${userId}\n` +
    `💬 Customer Chat ID: ${chatId}`;

  await bot.sendPhoto(process.env.ADMIN_CHAT_ID, order.screenshotFileId, {
    caption: adminCaption,
    reply_markup: {
      inline_keyboard: [
        [{ text: "✅ Delivery Done", callback_data: `delivery_${chatId}` }]
      ]
    }
  });

  await bot.sendMessage(
    chatId,
    `😊 Your order has been received.
Delivery may take 5 minutes to 1 hour.

If you do not receive your service within this time, please send us a message.

@Globalverifyed_support

😀 আপনার অর্ডারটি গ্রহণ করা হয়েছে।
ডেলিভারি হতে ৫ মিনিট থেকে ১ ঘন্টা সময় লাগতে পারে।

এই সময়ের মধ্যে সেবা না পেলে অনুগ্রহ করে আমাদের মেসেজ দিন।

@Globalverifyed_support`
  );

  return true;
}

// ================= ADMIN DELIVERY BUTTON =================
async function handleDeliveryButton(bot, query) {
  const data = query.data;
  const adminId = query.from.id;

  if (!data.startsWith("delivery_")) return false;

  const customerChatId = data.replace("delivery_", "");
  const order = pendingOrders[customerChatId] || orders[customerChatId];

  if (!order) {
    await bot.sendMessage(adminId, "❌ Order not found or already delivered.");
    return true;
  }

  deliveryMode[adminId] = {
    customerChatId,
    order,
    adminOrderChatId: query.message.chat.id,
    adminOrderMessageId: query.message.message_id
  };

  await bot.sendMessage(
    adminId,
    `✅ Delivery mode active.

Now send the product/data for:

📦 Product: ${order.name}
📊 Package: ${order.package}
🧾 Type: ${order.accountType || "N/A"}
💰 Price: ${order.price}
💰 Nagad Amount: ${convertDollarToTaka(order.price)}

👤 Customer: ${order.customerName || "No Name"}
🔗 Username: ${order.username || "No Username"}
🆔 ID: ${order.userId || customerChatId}

আপনি এখন যেটা পাঠাবেন, সেটা শুধু এই customer-এর কাছেই যাবে।`
  );

  return true;
}

// ================= ADMIN SEND DELIVERY DATA =================
async function handleAdminDeliveryMessage(bot, msg) {
  const adminId = msg.from.id;

  if (!deliveryMode[adminId]) return false;

  const {
    customerChatId,
    order,
    adminOrderChatId,
    adminOrderMessageId
  } = deliveryMode[adminId];

  if (msg.text) {
    await bot.sendMessage(
      customerChatId,
      `🎉 Delivery Received!

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
        `🎉 Delivery Received!\n\n` +
        `📦 Product: ${order.name}\n` +
        `📊 Package: ${order.package}\n` +
        `🧾 Type: ${order.accountType || "N/A"}`
    });
  } else if (msg.document) {
    await bot.sendDocument(customerChatId, msg.document.file_id, {
      caption:
        `🎉 Delivery Received!\n\n` +
        `📦 Product: ${order.name}\n` +
        `📊 Package: ${order.package}\n` +
        `🧾 Type: ${order.accountType || "N/A"}`
    });
  } else {
    await bot.sendMessage(adminId, "⚠️ Please send text, photo, or document.");
    return true;
  }

  order.status = "delivered";
  order.deliveredAt = new Date().toISOString();

  deliveredOrders[customerChatId] = order;

  delete pendingOrders[customerChatId];
  delete orders[customerChatId];
  delete deliveryMode[adminId];

  await bot.editMessageReplyMarkup(
    {
      inline_keyboard: [
        [{ text: "✅ Delivery Success", callback_data: "delivery_success" }]
      ]
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