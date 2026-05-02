const { showPaymentMethods } = require("./payment");
const { sendOrEdit } = require("./utils");
const { isAvailable, getStock } = require("./stock_manager");

const pendingOrders = {};

const accountTypes = {
  old_account: "OLD Account",
  new_account: "New Account",
  redeem_code: "Redeem Code"
};

function needsAccountType(order) {
  return order.productKey === "proxy_ip" || order.productKey === "proxy_gb";
}

const proxyProducts = {
  // =========================
  // ABC PROXY
  // =========================
  abc_discount_1gb: { productKey: "abc_proxy", itemKey: "abc_d_1", name: "ABC Proxy", package: "1GB Discount", price: "$1", back: "abc_discount_menu" },
  abc_discount_2gb: { productKey: "abc_proxy", itemKey: "abc_d_2", name: "ABC Proxy", package: "2GB Discount", price: "$2", back: "abc_discount_menu" },
  abc_discount_3gb: { productKey: "abc_proxy", itemKey: "abc_d_3", name: "ABC Proxy", package: "3GB Discount", price: "$3", back: "abc_discount_menu" },
  abc_discount_4gb: { productKey: "abc_proxy", itemKey: "abc_d_4", name: "ABC Proxy", package: "4GB Discount", price: "$4", back: "abc_discount_menu" },
  abc_discount_5gb: { productKey: "abc_proxy", itemKey: "abc_d_5", name: "ABC Proxy", package: "5GB Discount", price: "$5", back: "abc_discount_menu" },
  abc_discount_10gb: { productKey: "abc_proxy", itemKey: "abc_d_10", name: "ABC Proxy", package: "10GB Discount", price: "$9.5", back: "abc_discount_menu" },

  abc_regular_1gb: { productKey: "abc_proxy", itemKey: "abc_r_1", name: "ABC Proxy", package: "1GB Regular", price: "$1.10", back: "abc_regular_menu" },
  abc_regular_2gb: { productKey: "abc_proxy", itemKey: "abc_r_2", name: "ABC Proxy", package: "2GB Regular", price: "$2.20", back: "abc_regular_menu" },
  abc_regular_3gb: { productKey: "abc_proxy", itemKey: "abc_r_3", name: "ABC Proxy", package: "3GB Regular", price: "$3.30", back: "abc_regular_menu" },
  abc_regular_4gb: { productKey: "abc_proxy", itemKey: "abc_r_4", name: "ABC Proxy", package: "4GB Regular", price: "$4.40", back: "abc_regular_menu" },
  abc_regular_5gb: { productKey: "abc_proxy", itemKey: "abc_r_5", name: "ABC Proxy", package: "5GB Regular", price: "$5.50", back: "abc_regular_menu" },
  abc_regular_10gb: { productKey: "abc_proxy", itemKey: "abc_r_10", name: "ABC Proxy", package: "10GB Regular", price: "$10.50", back: "abc_regular_menu" },
  abc_regular_15gb: { productKey: "abc_proxy", itemKey: "abc_r_15", name: "ABC Proxy", package: "15GB Regular", price: "$16.50", back: "abc_regular_menu" },
  abc_regular_20gb: { productKey: "abc_proxy", itemKey: "abc_r_20", name: "ABC Proxy", package: "20GB Regular", price: "$21.00", back: "abc_regular_menu" },

  // =========================
  // PROXY SELLER
  // =========================
  proxy_seller_discount_1gb: { productKey: "proxy_seller", itemKey: "ps_d_1", name: "Proxy Seller", package: "1GB Discount", price: "$1.5", back: "proxy_seller_discount_menu" },
  proxy_seller_discount_2gb: { productKey: "proxy_seller", itemKey: "ps_d_2", name: "Proxy Seller", package: "2GB Discount", price: "$3", back: "proxy_seller_discount_menu" },
  proxy_seller_discount_3gb: { productKey: "proxy_seller", itemKey: "ps_d_3", name: "Proxy Seller", package: "3GB Discount", price: "$4.5", back: "proxy_seller_discount_menu" },
  proxy_seller_discount_4gb: { productKey: "proxy_seller", itemKey: "ps_d_4", name: "Proxy Seller", package: "4GB Discount", price: "$6", back: "proxy_seller_discount_menu" },
  proxy_seller_discount_5gb: { productKey: "proxy_seller", itemKey: "ps_d_5", name: "Proxy Seller", package: "5GB Discount", price: "$7.5", back: "proxy_seller_discount_menu" },

  proxy_seller_regular_1gb: { productKey: "proxy_seller", itemKey: "ps_r_1", name: "Proxy Seller", package: "1GB Regular", price: "$1.10", back: "proxy_seller_regular_menu" },
  proxy_seller_regular_2gb: { productKey: "proxy_seller", itemKey: "ps_r_2", name: "Proxy Seller", package: "2GB Regular", price: "$2.20", back: "proxy_seller_regular_menu" },
  proxy_seller_regular_3gb: { productKey: "proxy_seller", itemKey: "ps_r_3", name: "Proxy Seller", package: "3GB Regular", price: "$3.30", back: "proxy_seller_regular_menu" },
  proxy_seller_regular_4gb: { productKey: "proxy_seller", itemKey: "ps_r_4", name: "Proxy Seller", package: "4GB Regular", price: "$4.40", back: "proxy_seller_regular_menu" },
  proxy_seller_regular_5gb: { productKey: "proxy_seller", itemKey: "ps_r_5", name: "Proxy Seller", package: "5GB Regular", price: "$5.50", back: "proxy_seller_regular_menu" },
  proxy_seller_regular_10gb: { productKey: "proxy_seller", itemKey: "ps_r_10", name: "Proxy Seller", package: "10GB Regular", price: "$10.50", back: "proxy_seller_regular_menu" },
  proxy_seller_regular_15gb: { productKey: "proxy_seller", itemKey: "ps_r_15", name: "Proxy Seller", package: "15GB Regular", price: "$16.50", back: "proxy_seller_regular_menu" },
  proxy_seller_regular_20gb: { productKey: "proxy_seller", itemKey: "ps_r_20", name: "Proxy Seller", package: "20GB Regular", price: "$21.00", back: "proxy_seller_regular_menu" },

  // =========================
  // PROXY LIGHT
  // =========================
  proxy_light_discount_1gb: { productKey: "proxy_light", itemKey: "pl_d_1", name: "Proxy Light", package: "1GB Discount", price: "$1.5", back: "proxy_light_discount_menu" },
  proxy_light_discount_2gb: { productKey: "proxy_light", itemKey: "pl_d_2", name: "Proxy Light", package: "2GB Discount", price: "$3", back: "proxy_light_discount_menu" },
  proxy_light_discount_3gb: { productKey: "proxy_light", itemKey: "pl_d_3", name: "Proxy Light", package: "3GB Discount", price: "$4.5", back: "proxy_light_discount_menu" },
  proxy_light_discount_4gb: { productKey: "proxy_light", itemKey: "pl_d_4", name: "Proxy Light", package: "4GB Discount", price: "$6", back: "proxy_light_discount_menu" },
  proxy_light_discount_5gb: { productKey: "proxy_light", itemKey: "pl_d_5", name: "Proxy Light", package: "5GB Discount", price: "$7.5", back: "proxy_light_discount_menu" },

  proxy_light_regular_1gb: { productKey: "proxy_light", itemKey: "pl_r_1", name: "Proxy Light", package: "1GB Regular", price: "$1.10", back: "proxy_light_regular_menu" },
  proxy_light_regular_2gb: { productKey: "proxy_light", itemKey: "pl_r_2", name: "Proxy Light", package: "2GB Regular", price: "$2.20", back: "proxy_light_regular_menu" },
  proxy_light_regular_3gb: { productKey: "proxy_light", itemKey: "pl_r_3", name: "Proxy Light", package: "3GB Regular", price: "$3.30", back: "proxy_light_regular_menu" },
  proxy_light_regular_4gb: { productKey: "proxy_light", itemKey: "pl_r_4", name: "Proxy Light", package: "4GB Regular", price: "$4.40", back: "proxy_light_regular_menu" },
  proxy_light_regular_5gb: { productKey: "proxy_light", itemKey: "pl_r_5", name: "Proxy Light", package: "5GB Regular", price: "$5.50", back: "proxy_light_regular_menu" },
  proxy_light_regular_10gb: { productKey: "proxy_light", itemKey: "pl_r_10", name: "Proxy Light", package: "10GB Regular", price: "$10.50", back: "proxy_light_regular_menu" },
  proxy_light_regular_15gb: { productKey: "proxy_light", itemKey: "pl_r_15", name: "Proxy Light", package: "15GB Regular", price: "$16.50", back: "proxy_light_regular_menu" },
  proxy_light_regular_20gb: { productKey: "proxy_light", itemKey: "pl_r_20", name: "Proxy Light", package: "20GB Regular", price: "$21.00", back: "proxy_light_regular_menu" },

  // =========================
  // NOV PROXY
  // =========================
  nov_proxy_discount_1gb: { productKey: "nov_proxy", itemKey: "nv_d_1", name: "Nov Proxy", package: "1GB Discount", price: "$1.5", back: "nov_proxy_discount_menu" },
  nov_proxy_discount_2gb: { productKey: "nov_proxy", itemKey: "nv_d_2", name: "Nov Proxy", package: "2GB Discount", price: "$3", back: "nov_proxy_discount_menu" },
  nov_proxy_discount_3gb: { productKey: "nov_proxy", itemKey: "nv_d_3", name: "Nov Proxy", package: "3GB Discount", price: "$4.5", back: "nov_proxy_discount_menu" },
  nov_proxy_discount_4gb: { productKey: "nov_proxy", itemKey: "nv_d_4", name: "Nov Proxy", package: "4GB Discount", price: "$6", back: "nov_proxy_discount_menu" },
  nov_proxy_discount_5gb: { productKey: "nov_proxy", itemKey: "nv_d_5", name: "Nov Proxy", package: "5GB Discount", price: "$7.5", back: "nov_proxy_discount_menu" },

  nov_proxy_regular_1gb: { productKey: "nov_proxy", itemKey: "nv_r_1", name: "Nov Proxy", package: "1GB Regular", price: "$1.10", back: "nov_proxy_regular_menu" },
  nov_proxy_regular_2gb: { productKey: "nov_proxy", itemKey: "nv_r_2", name: "Nov Proxy", package: "2GB Regular", price: "$2.20", back: "nov_proxy_regular_menu" },
  nov_proxy_regular_3gb: { productKey: "nov_proxy", itemKey: "nv_r_3", name: "Nov Proxy", package: "3GB Regular", price: "$3.30", back: "nov_proxy_regular_menu" },
  nov_proxy_regular_4gb: { productKey: "nov_proxy", itemKey: "nv_r_4", name: "Nov Proxy", package: "4GB Regular", price: "$4.40", back: "nov_proxy_regular_menu" },
  nov_proxy_regular_5gb: { productKey: "nov_proxy", itemKey: "nv_r_5", name: "Nov Proxy", package: "5GB Regular", price: "$5.50", back: "nov_proxy_regular_menu" },
  nov_proxy_regular_10gb: { productKey: "nov_proxy", itemKey: "nv_r_10", name: "Nov Proxy", package: "10GB Regular", price: "$10.50", back: "nov_proxy_regular_menu" },
  nov_proxy_regular_15gb: { productKey: "nov_proxy", itemKey: "nv_r_15", name: "Nov Proxy", package: "15GB Regular", price: "$16.50", back: "nov_proxy_regular_menu" },
  nov_proxy_regular_20gb: { productKey: "nov_proxy", itemKey: "nv_r_20", name: "Nov Proxy", package: "20GB Regular", price: "$21.00", back: "nov_proxy_regular_menu" },

  // =========================
  // IPROCKET PROXY
  // =========================
  iprocket_discount_1gb: { productKey: "iprocket_proxy", itemKey: "ir_d_1", name: "IpRocket Proxy", package: "1GB Discount", price: "$1.5", back: "iprocket_discount_menu" },
  iprocket_discount_2gb: { productKey: "iprocket_proxy", itemKey: "ir_d_2", name: "IpRocket Proxy", package: "2GB Discount", price: "$3", back: "iprocket_discount_menu" },
  iprocket_discount_3gb: { productKey: "iprocket_proxy", itemKey: "ir_d_3", name: "IpRocket Proxy", package: "3GB Discount", price: "$4.5", back: "iprocket_discount_menu" },
  iprocket_discount_4gb: { productKey: "iprocket_proxy", itemKey: "ir_d_4", name: "IpRocket Proxy", package: "4GB Discount", price: "$6", back: "iprocket_discount_menu" },
  iprocket_discount_5gb: { productKey: "iprocket_proxy", itemKey: "ir_d_5", name: "IpRocket Proxy", package: "5GB Discount", price: "$7.5", back: "iprocket_discount_menu" },

  iprocket_regular_1gb: { productKey: "iprocket_proxy", itemKey: "ir_r_1", name: "IpRocket Proxy", package: "1GB Regular", price: "$1.10", back: "iprocket_regular_menu" },
  iprocket_regular_2gb: { productKey: "iprocket_proxy", itemKey: "ir_r_2", name: "IpRocket Proxy", package: "2GB Regular", price: "$2.20", back: "iprocket_regular_menu" },
  iprocket_regular_3gb: { productKey: "iprocket_proxy", itemKey: "ir_r_3", name: "IpRocket Proxy", package: "3GB Regular", price: "$3.30", back: "iprocket_regular_menu" },
  iprocket_regular_4gb: { productKey: "iprocket_proxy", itemKey: "ir_r_4", name: "IpRocket Proxy", package: "4GB Regular", price: "$4.40", back: "iprocket_regular_menu" },
  iprocket_regular_5gb: { productKey: "iprocket_proxy", itemKey: "ir_r_5", name: "IpRocket Proxy", package: "5GB Regular", price: "$5.50", back: "iprocket_regular_menu" },
  iprocket_regular_10gb: { productKey: "iprocket_proxy", itemKey: "ir_r_10", name: "IpRocket Proxy", package: "10GB Regular", price: "$10.50", back: "iprocket_regular_menu" },
  iprocket_regular_15gb: { productKey: "iprocket_proxy", itemKey: "ir_r_15", name: "IpRocket Proxy", package: "15GB Regular", price: "$16.50", back: "iprocket_regular_menu" },
  iprocket_regular_20gb: { productKey: "iprocket_proxy", itemKey: "ir_r_20", name: "IpRocket Proxy", package: "20GB Regular", price: "$21.00", back: "iprocket_regular_menu" },

  // =========================
  // NODEMAVEN
  // =========================
  nodemaven_discount_1gb: { productKey: "nodemaven", itemKey: "nm_d_1", name: "Nodemaven", package: "1GB Discount", price: "$1.5", back: "nodemaven_discount_menu" },
  nodemaven_discount_2gb: { productKey: "nodemaven", itemKey: "nm_d_2", name: "Nodemaven", package: "2GB Discount", price: "$3", back: "nodemaven_discount_menu" },
  nodemaven_discount_3gb: { productKey: "nodemaven", itemKey: "nm_d_3", name: "Nodemaven", package: "3GB Discount", price: "$4.5", back: "nodemaven_discount_menu" },
  nodemaven_discount_4gb: { productKey: "nodemaven", itemKey: "nm_d_4", name: "Nodemaven", package: "4GB Discount", price: "$6", back: "nodemaven_discount_menu" },
  nodemaven_discount_5gb: { productKey: "nodemaven", itemKey: "nm_d_5", name: "Nodemaven", package: "5GB Discount", price: "$7.5", back: "nodemaven_discount_menu" },

  nodemaven_regular_1gb: { productKey: "nodemaven", itemKey: "nm_r_1", name: "Nodemaven", package: "1GB Regular", price: "$1.10", back: "nodemaven_regular_menu" },
  nodemaven_regular_2gb: { productKey: "nodemaven", itemKey: "nm_r_2", name: "Nodemaven", package: "2GB Regular", price: "$2.20", back: "nodemaven_regular_menu" },
  nodemaven_regular_3gb: { productKey: "nodemaven", itemKey: "nm_r_3", name: "Nodemaven", package: "3GB Regular", price: "$3.30", back: "nodemaven_regular_menu" },
  nodemaven_regular_4gb: { productKey: "nodemaven", itemKey: "nm_r_4", name: "Nodemaven", package: "4GB Regular", price: "$4.40", back: "nodemaven_regular_menu" },
  nodemaven_regular_5gb: { productKey: "nodemaven", itemKey: "nm_r_5", name: "Nodemaven", package: "5GB Regular", price: "$5.50", back: "nodemaven_regular_menu" },
  nodemaven_regular_10gb: { productKey: "nodemaven", itemKey: "nm_r_10", name: "Nodemaven", package: "10GB Regular", price: "$10.50", back: "nodemaven_regular_menu" },
  nodemaven_regular_15gb: { productKey: "nodemaven", itemKey: "nm_r_15", name: "Nodemaven", package: "15GB Regular", price: "$16.50", back: "nodemaven_regular_menu" },
  nodemaven_regular_20gb: { productKey: "nodemaven", itemKey: "nm_r_20", name: "Nodemaven", package: "20GB Regular", price: "$21.00", back: "nodemaven_regular_menu" },

  // =========================
  // CLIPROXY
  // =========================
  cliproxy_discount_1gb: { productKey: "cliproxy", itemKey: "cp_d_1", name: "CLiProxy", package: "1GB Discount", price: "$1.5", back: "cliproxy_discount_menu" },
  cliproxy_discount_2gb: { productKey: "cliproxy", itemKey: "cp_d_2", name: "CLiProxy", package: "2GB Discount", price: "$3", back: "cliproxy_discount_menu" },
  cliproxy_discount_3gb: { productKey: "cliproxy", itemKey: "cp_d_3", name: "CLiProxy", package: "3GB Discount", price: "$4.5", back: "cliproxy_discount_menu" },
  cliproxy_discount_4gb: { productKey: "cliproxy", itemKey: "cp_d_4", name: "CLiProxy", package: "4GB Discount", price: "$6", back: "cliproxy_discount_menu" },
  cliproxy_discount_5gb: { productKey: "cliproxy", itemKey: "cp_d_5", name: "CLiProxy", package: "5GB Discount", price: "$7.5", back: "cliproxy_discount_menu" },

  cliproxy_regular_1gb: { productKey: "cliproxy", itemKey: "cp_r_1", name: "CLiProxy", package: "1GB Regular", price: "$1.10", back: "cliproxy_regular_menu" },
  cliproxy_regular_2gb: { productKey: "cliproxy", itemKey: "cp_r_2", name: "CLiProxy", package: "2GB Regular", price: "$2.20", back: "cliproxy_regular_menu" },
  cliproxy_regular_3gb: { productKey: "cliproxy", itemKey: "cp_r_3", name: "CLiProxy", package: "3GB Regular", price: "$3.30", back: "cliproxy_regular_menu" },
  cliproxy_regular_4gb: { productKey: "cliproxy", itemKey: "cp_r_4", name: "CLiProxy", package: "4GB Regular", price: "$4.40", back: "cliproxy_regular_menu" },
  cliproxy_regular_5gb: { productKey: "cliproxy", itemKey: "cp_r_5", name: "CLiProxy", package: "5GB Regular", price: "$5.50", back: "cliproxy_regular_menu" },
  cliproxy_regular_10gb: { productKey: "cliproxy", itemKey: "cp_r_10", name: "CLiProxy", package: "10GB Regular", price: "$10.50", back: "cliproxy_regular_menu" },
  cliproxy_regular_15gb: { productKey: "cliproxy", itemKey: "cp_r_15", name: "CLiProxy", package: "15GB Regular", price: "$16.50", back: "cliproxy_regular_menu" },
  cliproxy_regular_20gb: { productKey: "cliproxy", itemKey: "cp_r_20", name: "CLiProxy", package: "20GB Regular", price: "$21.00", back: "cliproxy_regular_menu" },

  // =========================
  // CHERRY PROXY
  // =========================
  cherry_discount_1gb: { productKey: "cherry_proxy", itemKey: "ch_d_1", name: "CHerry Proxy", package: "1GB Discount", price: "$1.5", back: "cherry_discount_menu" },
  cherry_discount_2gb: { productKey: "cherry_proxy", itemKey: "ch_d_2", name: "CHerry Proxy", package: "2GB Discount", price: "$3", back: "cherry_discount_menu" },
  cherry_discount_3gb: { productKey: "cherry_proxy", itemKey: "ch_d_3", name: "CHerry Proxy", package: "3GB Discount", price: "$4.5", back: "cherry_discount_menu" },
  cherry_discount_4gb: { productKey: "cherry_proxy", itemKey: "ch_d_4", name: "CHerry Proxy", package: "4GB Discount", price: "$6", back: "cherry_discount_menu" },
  cherry_discount_5gb: { productKey: "cherry_proxy", itemKey: "ch_d_5", name: "CHerry Proxy", package: "5GB Discount", price: "$7.5", back: "cherry_discount_menu" },

  cherry_regular_1gb: { productKey: "cherry_proxy", itemKey: "ch_r_1", name: "CHerry Proxy", package: "1GB Regular", price: "$1.10", back: "cherry_regular_menu" },
  cherry_regular_2gb: { productKey: "cherry_proxy", itemKey: "ch_r_2", name: "CHerry Proxy", package: "2GB Regular", price: "$2.20", back: "cherry_regular_menu" },
  cherry_regular_3gb: { productKey: "cherry_proxy", itemKey: "ch_r_3", name: "CHerry Proxy", package: "3GB Regular", price: "$3.30", back: "cherry_regular_menu" },
  cherry_regular_4gb: { productKey: "cherry_proxy", itemKey: "ch_r_4", name: "CHerry Proxy", package: "4GB Regular", price: "$4.40", back: "cherry_regular_menu" },
  cherry_regular_5gb: { productKey: "cherry_proxy", itemKey: "ch_r_5", name: "CHerry Proxy", package: "5GB Regular", price: "$5.50", back: "cherry_regular_menu" },
  cherry_regular_10gb: { productKey: "cherry_proxy", itemKey: "ch_r_10", name: "CHerry Proxy", package: "10GB Regular", price: "$10.50", back: "cherry_regular_menu" },
  cherry_regular_15gb: { productKey: "cherry_proxy", itemKey: "ch_r_15", name: "CHerry Proxy", package: "15GB Regular", price: "$16.50", back: "cherry_regular_menu" },
  cherry_regular_20gb: { productKey: "cherry_proxy", itemKey: "ch_r_20", name: "CHerry Proxy", package: "20GB Regular", price: "$21.00", back: "cherry_regular_menu" },

  // =========================
  // DIGI PROXY
  // =========================
  digi_discount_1gb: { productKey: "digi_proxy", itemKey: "dg_d_1", name: "Digi Proxy", package: "1GB Discount", price: "$1.5", back: "digi_discount_menu" },
  digi_discount_2gb: { productKey: "digi_proxy", itemKey: "dg_d_2", name: "Digi Proxy", package: "2GB Discount", price: "$3", back: "digi_discount_menu" },
  digi_discount_3gb: { productKey: "digi_proxy", itemKey: "dg_d_3", name: "Digi Proxy", package: "3GB Discount", price: "$4.5", back: "digi_discount_menu" },
  digi_discount_4gb: { productKey: "digi_proxy", itemKey: "dg_d_4", name: "Digi Proxy", package: "4GB Discount", price: "$6", back: "digi_discount_menu" },
  digi_discount_5gb: { productKey: "digi_proxy", itemKey: "dg_d_5", name: "Digi Proxy", package: "5GB Discount", price: "$7.5", back: "digi_discount_menu" },

  digi_regular_1gb: { productKey: "digi_proxy", itemKey: "dg_r_1", name: "Digi Proxy", package: "1GB Regular", price: "$1.10", back: "digi_regular_menu" },
  digi_regular_2gb: { productKey: "digi_proxy", itemKey: "dg_r_2", name: "Digi Proxy", package: "2GB Regular", price: "$2.20", back: "digi_regular_menu" },
  digi_regular_3gb: { productKey: "digi_proxy", itemKey: "dg_r_3", name: "Digi Proxy", package: "3GB Regular", price: "$3.30", back: "digi_regular_menu" },
  digi_regular_4gb: { productKey: "digi_proxy", itemKey: "dg_r_4", name: "Digi Proxy", package: "4GB Regular", price: "$4.40", back: "digi_regular_menu" },
  digi_regular_5gb: { productKey: "digi_proxy", itemKey: "dg_r_5", name: "Digi Proxy", package: "5GB Regular", price: "$5.50", back: "digi_regular_menu" },
  digi_regular_10gb: { productKey: "digi_proxy", itemKey: "dg_r_10", name: "Digi Proxy", package: "10GB Regular", price: "$10.50", back: "digi_regular_menu" },
  digi_regular_15gb: { productKey: "digi_proxy", itemKey: "dg_r_15", name: "Digi Proxy", package: "15GB Regular", price: "$16.50", back: "digi_regular_menu" },
  digi_regular_20gb: { productKey: "digi_proxy", itemKey: "dg_r_20", name: "Digi Proxy", package: "20GB Regular", price: "$21.00", back: "digi_regular_menu" }
};

async function showProductOptions(bot, query, order) {
  const chatId = query.message.chat.id;
  const stockCount = getStock(order.productKey, order.itemKey);

  // শুধু 9proxy IP / 9proxy GB এর জন্য account type দেখাবে
  if (needsAccountType(order)) {
    pendingOrders[chatId] = order;

    await sendOrEdit(
      bot,
      query,
      `✅ Selected Product

📦 Product: ${order.name}
📊 Package: ${order.package}
💰 Price: ${order.price}
📦 Stock: ${stockCount} Available

Select account type:`,
      [
        [
          { text: "👴 OLD Account", callback_data: "old_account" },
          { text: "🆕 New Account", callback_data: "new_account" }
        ],
        [{ text: "🎟️ Redeem Code", callback_data: "redeem_code" }],
        [{ text: "⬅️ Back", callback_data: order.back }]
      ]
    );

    return;
  }

  // বাকি সব product সরাসরি payment method এ যাবে
  await showPaymentMethods(bot, chatId, {
    ...order,
    stock: stockCount
  });
}

async function handleProductOptions(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  // package click handle
  if (proxyProducts[data]) {
    const order = proxyProducts[data];

    if (!isAvailable(order.productKey, order.itemKey)) {
      await sendOrEdit(bot, query, "❌ Out of Stock!", [
        [{ text: "⬅️ Back", callback_data: order.back }]
      ]);
      return true;
    }

    await showProductOptions(bot, query, order);
    return true;
  }

  // account type handle only for 9proxy IP / GB
  if (!accountTypes[data]) return false;

  const order = pendingOrders[chatId];

  if (!order) {
    await bot.sendMessage(chatId, "⚠️ Please select product/package first.");
    return true;
  }

  await showPaymentMethods(bot, chatId, {
    ...order,
    accountType: accountTypes[data]
  });

  delete pendingOrders[chatId];

  return true;
}

module.exports = {
  showProductOptions,
  handleProductOptions
};