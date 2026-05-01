const { pendingOrders = {}, deliveredOrders = {} } = require("./payment");
const { isAdmin } = require("./admin_access");

function getPriceNumber(price) {
  const num = parseFloat(String(price).replace(/[^0-9.]/g, ""));
  return Number.isNaN(num) ? 0 : num;
}

async function showAdminDashboard(bot, chatId) {
  await bot.sendMessage(chatId, "📊 Admin Dashboard", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📦 Pending Orders", callback_data: "admin_pending" },
          { text: "✅ Delivered Orders", callback_data: "admin_delivered" }
        ],
        [
          { text: "💰 Today Sales", callback_data: "admin_sales" },
          { text: "👥 Customers", callback_data: "admin_customers" }
        ],
        [
          { text: "📊 Stock Dashboard", callback_data: "admin_stock" }
        ],
        [
          { text: "⚙️ Settings", callback_data: "admin_settings" }
        ]
      ]
    }
  });
}

async function handleAdmin(bot, msg) {
  const chatId = msg.chat.id;

  if (!isAdmin(msg.from.id)) {
    await bot.sendMessage(chatId, "❌ You are not admin.");
    return true;
  }

  await showAdminDashboard(bot, chatId);
  return true;
}

async function handleAdminButtons(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (!isAdmin(query.from.id)) return false;

  if (data === "admin_back") {
    await showAdminDashboard(bot, chatId);
    return true;
  }

  if (data === "admin_pending") {
    const orders = Object.values(pendingOrders);

    if (orders.length === 0) {
      await bot.sendMessage(chatId, "📭 No pending orders.");
      return true;
    }

    for (const order of orders) {
      await bot.sendMessage(
        chatId,
        `📦 Pending Order

🛒 Product: ${order.name}
📊 Package: ${order.package}
🧾 Type: ${order.accountType || "N/A"}
💰 Price: ${order.price}

👤 Customer: ${order.customerName || "No Name"}
🔗 Username: ${order.username || "No Username"}
🆔 ID: ${order.userId || order.customerChatId}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🚚 Deliver This Order",
                  callback_data: delivery_${order.customerChatId}
                }
              ]
            ]
          }
        }
      );
    }

    return true;
  }

  if (data === "admin_delivered") {
    const orders = Object.values(deliveredOrders);

    if (orders.length === 0) {
      await bot.sendMessage(chatId, "📭 No delivered orders yet.");
      return true;
    }

    for (const order of orders) {
      await bot.sendMessage(
        chatId,
        `✅ Delivered Order

🛒 Product: ${order.name}
📊 Package: ${order.package}
🧾 Type: ${order.accountType || "N/A"}
💰 Price: ${order.price}

👤 Customer: ${order.customerName || "No Name"}
🔗 Username: ${order.username || "No Username"}
🆔 ID: ${order.userId || order.customerChatId}`
      );
    }

    return true;
  }

  if (data === "admin_sales") {
    const delivered = Object.values(deliveredOrders);
    const total = delivered.reduce((sum, order) => {
      return sum + getPriceNumber(order.price);
    }, 0);

    await bot.sendMessage(
      chatId,
      `💰 Today Sales

✅ Delivered Orders: ${delivered.length}
💵 Total Sales: $${total.toFixed(2)}`
    );

    return true;
  }

  if (data === "admin_customers") {
    const allOrders = [
      ...Object.values(pendingOrders),
      ...Object.values(deliveredOrders)
    ];

    if (allOrders.length === 0) {
      await bot.sendMessage(chatId, "👥 No customers yet.");
      return true;
    }

    const customers = {};

    allOrders.forEach((order) => {
      const id = order.userId || order.customerChatId;
      customers[id] = {
        name: order.customerName || "No Name",
        username: order.username || "No Username",
        id
      };
    });

    const text = Object.values(customers)
      .map(
        (c, index) =>
          ${index + 1}. 👤 ${c.name}\n🔗 ${c.username}\n🆔 ${c.id}
      )
      .join("\n\n");

    await bot.sendMessage(chatId, 👥 Customers List\n\n${text});
    return true;
  }

  if (data === "admin_settings") {
    await bot.sendMessage(
      chatId,
      `⚙️ Settings

✅ Bot Status: Online
✅ Multi Admin: Enabled
✅ Payment: Binance + Nagad
✅ Delivery: Manual Admin Delivery
✅ Stock Dashboard: Enabled`
    );

    return true;
  }

  return false;
}

module.exports = {
  handleAdmin,
  handleAdminButtons
 }; 