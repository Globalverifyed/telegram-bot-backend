const { showPaymentMethods, startAccountDetailsFlow } = require("./payment");
const { sendOrEdit, formatPrice } = require("./utils");
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
  // 🌍 9PROXY IP
  // Account type লাগবে: OLD / New / Redeem
  // =========================
  proxy_ip_discount_25: { productKey: "proxy_ip", itemKey: "ip_d_25", name: "9proxy IP", package: "25 IP Discount", price: "$0.79", back: "proxy_ip_discount_menu" },
  proxy_ip_discount_50: { productKey: "proxy_ip", itemKey: "ip_d_50", name: "9proxy IP", package: "50 IP Discount", price: "$1.49", back: "proxy_ip_discount_menu" },
  proxy_ip_discount_100: { productKey: "proxy_ip", itemKey: "ip_d_100", name: "9proxy IP", package: "100 IP Discount", price: "$2.49", back: "proxy_ip_discount_menu" },
  proxy_ip_discount_200: { productKey: "proxy_ip", itemKey: "ip_d_200", name: "9proxy IP", package: "200 IP Discount", price: "$4.79", back: "proxy_ip_discount_menu" },
  proxy_ip_discount_300: { productKey: "proxy_ip", itemKey: "ip_d_300", name: "9proxy IP", package: "300 IP Discount", price: "$7.10", back: "proxy_ip_discount_menu" },
  proxy_ip_discount_500: { productKey: "proxy_ip", itemKey: "ip_d_500", name: "9proxy IP", package: "500 IP Discount", price: "$11.90", back: "proxy_ip_discount_menu" },
  proxy_ip_discount_1000: { productKey: "proxy_ip", itemKey: "ip_d_1000", name: "9proxy IP", package: "1000 IP Discount", price: "$23.69", back: "proxy_ip_discount_menu" },

  // =========================
  // 📦 9PROXY GB
  // Account type লাগবে: OLD / New / Redeem
  // =========================
  proxy_gb_discount_1: { productKey: "proxy_gb", itemKey: "gb_d_1", name: "9proxy GB", package: "1GB Discount", price: "$1.00", back: "proxy_gb_discount_menu" },
  proxy_gb_discount_2: { productKey: "proxy_gb", itemKey: "gb_d_2", name: "9proxy GB", package: "2GB Discount", price: "$2.00", back: "proxy_gb_discount_menu" },
  proxy_gb_discount_3: { productKey: "proxy_gb", itemKey: "gb_d_3", name: "9proxy GB", package: "3GB Discount", price: "$3.00", back: "proxy_gb_discount_menu" },
  proxy_gb_discount_5: { productKey: "proxy_gb", itemKey: "gb_d_5", name: "9proxy GB", package: "5GB Discount", price: "$5.00", back: "proxy_gb_discount_menu" },
  proxy_gb_discount_10: { productKey: "proxy_gb", itemKey: "gb_d_10", name: "9proxy GB", package: "10GB Discount", price: "$10.00", back: "proxy_gb_discount_menu" },
  proxy_gb_discount_15: { productKey: "proxy_gb", itemKey: "gb_d_15", name: "9proxy GB", package: "15GB Discount", price: "$15.00", back: "proxy_gb_discount_menu" },
  proxy_gb_discount_20: { productKey: "proxy_gb", itemKey: "gb_d_20", name: "9proxy GB", package: "20GB Discount", price: "$20.00", back: "proxy_gb_discount_menu" },
  // =========================
  // ABC PROXY
  // =========================
  abc_discount_1gb: { productKey: "abc_proxy", itemKey: "abc_d_1", name: "ABC Proxy", package: "1GB Discount", price: "$1.10 USDT", back: "abc_discount_menu" },
abc_discount_2gb: { productKey: "abc_proxy", itemKey: "abc_d_2", name: "ABC Proxy", package: "2GB Discount", price: "$2.20 USDT", back: "abc_discount_menu" },
abc_discount_3gb: { productKey: "abc_proxy", itemKey: "abc_d_3", name: "ABC Proxy", package: "3GB Discount", price: "$3.30 USDT", back: "abc_discount_menu" },
abc_discount_4gb: { productKey: "abc_proxy", itemKey: "abc_d_4", name: "ABC Proxy", package: "4GB Discount", price: "$4.40 USDT", back: "abc_discount_menu" },
abc_discount_5gb: { productKey: "abc_proxy", itemKey: "abc_d_5", name: "ABC Proxy", package: "5GB Discount", price: "$5.50 USDT", back: "abc_discount_menu" },
abc_discount_10gb: { productKey: "abc_proxy", itemKey: "abc_d_10", name: "ABC Proxy", package: "10GB Discount", price: "$10.50 USDT", back: "abc_discount_menu" },

  abc_regular_1gb: { productKey: "abc_proxy", itemKey: "abc_r_1", name: "ABC Proxy", package: "1GB Regular", price: "$2.00", back: "abc_regular_menu" },
  abc_regular_2gb: { productKey: "abc_proxy", itemKey: "abc_r_2", name: "ABC Proxy", package: "2GB Regular", price: "$4.00", back: "abc_regular_menu" },
  abc_regular_3gb: { productKey: "abc_proxy", itemKey: "abc_r_3", name: "ABC Proxy", package: "3GB Regular", price: "$5.05", back: "abc_regular_menu" },
  abc_regular_4gb: { productKey: "abc_proxy", itemKey: "abc_r_4", name: "ABC Proxy", package: "4GB Regular", price: "$7.75", back: "abc_regular_menu" },
  abc_regular_5gb: { productKey: "abc_proxy", itemKey: "abc_r_5", name: "ABC Proxy", package: "5GB Regular", price: "$9.50", back: "abc_regular_menu" },
  abc_regular_10gb: { productKey: "abc_proxy", itemKey: "abc_r_10", name: "ABC Proxy", package: "10GB Regular", price: "$16.50", back: "abc_regular_menu" },
  abc_regular_15gb: { productKey: "abc_proxy", itemKey: "abc_r_15", name: "ABC Proxy", package: "15GB Regular", price: "$23.15", back: "abc_regular_menu" },
  abc_regular_20gb: { productKey: "abc_proxy", itemKey: "abc_r_20", name: "ABC Proxy", package: "20GB Regular", price: "$30.50", back: "abc_regular_menu" },

  // =========================
  // PROXY SELLER
  // =========================
  proxy_seller_discount_1gb: { productKey: "proxy_seller", itemKey: "ps_d_1", name: "Proxy Seller", package: "1GB Discount", price: "$2.00", back: "proxy_seller_discount_menu" },
  proxy_seller_discount_2gb: { productKey: "proxy_seller", itemKey: "ps_d_2", name: "Proxy Seller", package: "2GB Discount", price: "$4.00", back: "proxy_seller_discount_menu" },
  proxy_seller_discount_3gb: { productKey: "proxy_seller", itemKey: "ps_d_3", name: "Proxy Seller", package: "3GB Discount", price: "$5.90", back: "proxy_seller_discount_menu" },
  proxy_seller_discount_4gb: { productKey: "proxy_seller", itemKey: "ps_d_4", name: "Proxy Seller", package: "4GB Discount", price: "$7.85", back: "proxy_seller_discount_menu" },
  proxy_seller_discount_5gb: { productKey: "proxy_seller", itemKey: "ps_d_5", name: "Proxy Seller", package: "5GB Discount", price: "$9.80", back: "proxy_seller_discount_menu" },

  proxy_seller_regular_1gb: { productKey: "proxy_seller", itemKey: "ps_r_1", name: "Proxy Seller", package: "1GB Regular", price: "$2.50", back: "proxy_seller_regular_menu" },
  proxy_seller_regular_2gb: { productKey: "proxy_seller", itemKey: "ps_r_2", name: "Proxy Seller", package: "2GB Regular", price: "$5.00", back: "proxy_seller_regular_menu" },
  proxy_seller_regular_3gb: { productKey: "proxy_seller", itemKey: "ps_r_3", name: "Proxy Seller", package: "3GB Regular", price: "$7.50", back: "proxy_seller_regular_menu" },
  proxy_seller_regular_4gb: { productKey: "proxy_seller", itemKey: "ps_r_4", name: "Proxy Seller", package: "4GB Regular", price: "$9.50", back: "proxy_seller_regular_menu" },
  proxy_seller_regular_5gb: { productKey: "proxy_seller", itemKey: "ps_r_5", name: "Proxy Seller", package: "5GB Regular", price: "$11.50", back: "proxy_seller_regular_menu" },
  proxy_seller_regular_10gb: { productKey: "proxy_seller", itemKey: "ps_r_10", name: "Proxy Seller", package: "10GB Regular", price: "$22.50", back: "proxy_seller_regular_menu" },
  proxy_seller_regular_15gb: { productKey: "proxy_seller", itemKey: "ps_r_15", name: "Proxy Seller", package: "15GB Regular", price: "$33.00", back: "proxy_seller_regular_menu" },
  proxy_seller_regular_20gb: { productKey: "proxy_seller", itemKey: "ps_r_20", name: "Proxy Seller", package: "20GB Regular", price: "$42.00", back: "proxy_seller_regular_menu" },

  // =========================
  // PROXY LIGHT
  // =========================
  proxy_light_discount_1gb: { productKey: "proxy_light", itemKey: "pl_d_1", name: "Proxy Light", package: "1GB Discount", price: "$3.50", back: "proxy_light_discount_menu" },
  proxy_light_discount_2gb: { productKey: "proxy_light", itemKey: "pl_d_2", name: "Proxy Light", package: "2GB Discount", price: "$7.00", back: "proxy_light_discount_menu" },
  proxy_light_discount_3gb: { productKey: "proxy_light", itemKey: "pl_d_3", name: "Proxy Light", package: "3GB Discount", price: "$10.50", back: "proxy_light_discount_menu" },
  proxy_light_discount_4gb: { productKey: "proxy_light", itemKey: "pl_d_4", name: "Proxy Light", package: "4GB Discount", price: "$14.00", back: "proxy_light_discount_menu" },
  proxy_light_discount_5gb: { productKey: "proxy_light", itemKey: "pl_d_5", name: "Proxy Light", package: "5GB Discount", price: "$17.50", back: "proxy_light_discount_menu" },

  proxy_light_regular_1gb: { productKey: "proxy_light", itemKey: "pl_r_1", name: "Proxy Light", package: "1GB Regular", price: "$4.50", back: "proxy_light_regular_menu" },
  proxy_light_regular_2gb: { productKey: "proxy_light", itemKey: "pl_r_2", name: "Proxy Light", package: "2GB Regular", price: "$8.50", back: "proxy_light_regular_menu" },
  proxy_light_regular_3gb: { productKey: "proxy_light", itemKey: "pl_r_3", name: "Proxy Light", package: "3GB Regular", price: "$13.00", back: "proxy_light_regular_menu" },
  proxy_light_regular_4gb: { productKey: "proxy_light", itemKey: "pl_r_4", name: "Proxy Light", package: "4GB Regular", price: "$16.50", back: "proxy_light_regular_menu" },
  proxy_light_regular_5gb: { productKey: "proxy_light", itemKey: "pl_r_5", name: "Proxy Light", package: "5GB Regular", price: "$19.50", back: "proxy_light_regular_menu" },
  proxy_light_regular_10gb: { productKey: "proxy_light", itemKey: "pl_r_10", name: "Proxy Light", package: "10GB Regular", price: "$31.50", back: "proxy_light_regular_menu" },
  proxy_light_regular_15gb: { productKey: "proxy_light", itemKey: "pl_r_15", name: "Proxy Light", package: "15GB Regular", price: "$46.00", back: "proxy_light_regular_menu" },
  proxy_light_regular_20gb: { productKey: "proxy_light", itemKey: "pl_r_20", name: "Proxy Light", package: "20GB Regular", price: "$62.00", back: "proxy_light_regular_menu" },

  // =========================
  // NOV PROXY
  // =========================
  nov_proxy_discount_25ip: { productKey: "nov_proxy", itemKey: "nv_d_25", name: "Nov Proxy", package: "25 IP Discount", price: "$2.00", back: "nov_proxy_discount_menu" },
  nov_proxy_discount_50ip: { productKey: "nov_proxy", itemKey: "nv_d_50", name: "Nov Proxy", package: "50 IP Discount", price: "$4.00", back: "nov_proxy_discount_menu" },
  nov_proxy_discount_100ip: { productKey: "nov_proxy", itemKey: "nv_d_100", name: "Nov Proxy", package: "100 IP Discount", price: "$8.00", back: "nov_proxy_discount_menu" },
  nov_proxy_discount_200ip: { productKey: "nov_proxy", itemKey: "nv_d_200", name: "Nov Proxy", package: "200 IP Discount", price: "$16.00", back: "nov_proxy_discount_menu" },
  nov_proxy_discount_400ip: { productKey: "nov_proxy", itemKey: "nv_d_400", name: "Nov Proxy", package: "400 IP Discount", price: "$32.00", back: "nov_proxy_discount_menu" },

  nov_proxy_regular_25ip: { productKey: "nov_proxy", itemKey: "nv_r_25", name: "Nov Proxy", package: "25 IP Regular", price: "$3.00", back: "nov_proxy_regular_menu" },
  nov_proxy_regular_50ip: { productKey: "nov_proxy", itemKey: "nv_r_50", name: "Nov Proxy", package: "50 IP Regular", price: "$6.00", back: "nov_proxy_regular_menu" },
  nov_proxy_regular_100ip: { productKey: "nov_proxy", itemKey: "nv_r_100", name: "Nov Proxy", package: "100 IP Regular", price: "$12.00", back: "nov_proxy_regular_menu" },
  nov_proxy_regular_200ip: { productKey: "nov_proxy", itemKey: "nv_r_200", name: "Nov Proxy", package: "200 IP Regular", price: "$22.00", back: "nov_proxy_regular_menu" },
  nov_proxy_regular_400ip: { productKey: "nov_proxy", itemKey: "nv_r_400", name: "Nov Proxy", package: "400 IP Regular", price: "$42.00", back: "nov_proxy_regular_menu" },
  nov_proxy_regular_800ip: { productKey: "nov_proxy", itemKey: "nv_r_800", name: "Nov Proxy", package: "800 IP Regular", price: "$78.00", back: "nov_proxy_regular_menu" },
  nov_proxy_regular_1000ip: { productKey: "nov_proxy", itemKey: "nv_r_1000", name: "Nov Proxy", package: "1000 IP Regular", price: "$88.00", back: "nov_proxy_regular_menu" },
  nov_proxy_regular_1200ip: { productKey: "nov_proxy", itemKey: "nv_r_1200", name: "Nov Proxy", package: "1200 IP Regular", price: "$99.00", back: "nov_proxy_regular_menu" },

  // =========================
  // IPROCKET PROXY
  // =========================
  iprocket_discount_2gb: { productKey: "iprocket_proxy", itemKey: "ir_d_2", name: "IpRocket Proxy", package: "2GB Discount", price: "$1.6", back: "iprocket_discount_menu" },
  iprocket_discount_4gb: { productKey: "iprocket_proxy", itemKey: "ir_d_4", name: "IpRocket Proxy", package: "4GB Discount", price: "$3.20", back: "iprocket_discount_menu" },
  iprocket_discount_6gb: { productKey: "iprocket_proxy", itemKey: "ir_d_6", name: "IpRocket Proxy", package: "6GB Discount", price: "$4.80", back: "iprocket_discount_menu" },
  iprocket_discount_8gb: { productKey: "iprocket_proxy", itemKey: "ir_d_8", name: "IpRocket Proxy", package: "8GB Discount", price: "$6.40", back: "iprocket_discount_menu" },
  iprocket_discount_10gb: { productKey: "iprocket_proxy", itemKey: "ir_d_10", name: "IpRocket Proxy", package: "10GB Discount", price: "$8.00", back: "iprocket_discount_menu" },

  iprocket_regular_2gb: { productKey: "iprocket_proxy", itemKey: "ir_r_2", name: "IpRocket Proxy", package: "2GB Regular", price: "$2.00", back: "iprocket_regular_menu" },
  iprocket_regular_4gb: { productKey: "iprocket_proxy", itemKey: "ir_r_4", name: "IpRocket Proxy", package: "4GB Regular", price: "$4.00", back: "iprocket_regular_menu" },
  iprocket_regular_6gb: { productKey: "iprocket_proxy", itemKey: "ir_r_6", name: "IpRocket Proxy", package: "6GB Regular", price: "$6.00", back: "iprocket_regular_menu" },
  iprocket_regular_8gb: { productKey: "iprocket_proxy", itemKey: "ir_r_8", name: "IpRocket Proxy", package: "8GB Regular", price: "$8.00", back: "iprocket_regular_menu" },
  iprocket_regular_10gb: { productKey: "iprocket_proxy", itemKey: "ir_r_10", name: "IpRocket Proxy", package: "10GB Regular", price: "$10.00", back: "iprocket_regular_menu" },
  iprocket_regular_12gb: { productKey: "iprocket_proxy", itemKey: "ir_r_12", name: "IpRocket Proxy", package: "12GB Regular", price: "$12.00", back: "iprocket_regular_menu" },
  iprocket_regular_15gb: { productKey: "iprocket_proxy", itemKey: "ir_r_15", name: "IpRocket Proxy", package: "15GB Regular", price: "$14.50", back: "iprocket_regular_menu" },
  iprocket_regular_20gb: { productKey: "iprocket_proxy", itemKey: "ir_r_20", name: "IpRocket Proxy", package: "20GB Regular", price: "$18.00", back: "iprocket_regular_menu" },

  // =========================
  // NODEMAVEN
  // =========================
  nodemaven_discount_1gb: { productKey: "nodemaven", itemKey: "nm_d_1", name: "Nodemaven", package: "1GB Discount", price: "$4.20", back: "nodemaven_discount_menu" },
  nodemaven_discount_2gb: { productKey: "nodemaven", itemKey: "nm_d_2", name: "Nodemaven", package: "2GB Discount", price: "$8.40", back: "nodemaven_discount_menu" },
  nodemaven_discount_3gb: { productKey: "nodemaven", itemKey: "nm_d_3", name: "Nodemaven", package: "3GB Discount", price: "$12.50", back: "nodemaven_discount_menu" },
  nodemaven_discount_4gb: { productKey: "nodemaven", itemKey: "nm_d_4", name: "Nodemaven", package: "4GB Discount", price: "$16.50", back: "nodemaven_discount_menu" },
  nodemaven_discount_5gb: { productKey: "nodemaven", itemKey: "nm_d_5", name: "Nodemaven", package: "5GB Discount", price: "$20.00", back: "nodemaven_discount_menu" },

  nodemaven_regular_1gb: { productKey: "nodemaven", itemKey: "nm_r_1", name: "Nodemaven", package: "1GB Regular", price: "$5.50", back: "nodemaven_regular_menu" },
  nodemaven_regular_2gb: { productKey: "nodemaven", itemKey: "nm_r_2", name: "Nodemaven", package: "2GB Regular", price: "$10.50", back: "nodemaven_regular_menu" },
  nodemaven_regular_3gb: { productKey: "nodemaven", itemKey: "nm_r_3", name: "Nodemaven", package: "3GB Regular", price: "$15.50", back: "nodemaven_regular_menu" },
  nodemaven_regular_4gb: { productKey: "nodemaven", itemKey: "nm_r_4", name: "Nodemaven", package: "4GB Regular", price: "$20.50", back: "nodemaven_regular_menu" },
  nodemaven_regular_5gb: { productKey: "nodemaven", itemKey: "nm_r_5", name: "Nodemaven", package: "5GB Regular", price: "$25.50", back: "nodemaven_regular_menu" },
  nodemaven_regular_10gb: { productKey: "nodemaven", itemKey: "nm_r_10", name: "Nodemaven", package: "10GB Regular", price: "$48.00", back: "nodemaven_regular_menu" },
  nodemaven_regular_15gb: { productKey: "nodemaven", itemKey: "nm_r_15", name: "Nodemaven", package: "15GB Regular", price: "$73.00", back: "nodemaven_regular_menu" },
  nodemaven_regular_20gb: { productKey: "nodemaven", itemKey: "nm_r_20", name: "Nodemaven", package: "20GB Regular", price: "$95.00", back: "nodemaven_regular_menu" },

  // =========================
  // CLIPROXY
  // =========================
  cliproxy_discount_25ip: { productKey: "cliproxy", itemKey: "cp_d_25", name: "CLiProxy", package: "25 IP Discount", price: "$2.00", back: "cliproxy_discount_menu" },
  cliproxy_discount_50ip: { productKey: "cliproxy", itemKey: "cp_d_50", name: "CLiProxy", package: "50 IP Discount", price: "$4.00", back: "cliproxy_discount_menu" },
  cliproxy_discount_100ip: { productKey: "cliproxy", itemKey: "cp_d_100", name: "CLiProxy", package: "100 IP Discount", price: "$8.00", back: "cliproxy_discount_menu" },
  cliproxy_discount_200ip: { productKey: "cliproxy", itemKey: "cp_d_200", name: "CLiProxy", package: "200 IP Discount", price: "$16.00", back: "cliproxy_discount_menu" },
  cliproxy_discount_400ip: { productKey: "cliproxy", itemKey: "cp_d_400", name: "CLiProxy", package: "400 IP Discount", price: "$32.00", back: "cliproxy_discount_menu" },

  cliproxy_regular_25ip: { productKey: "cliproxy", itemKey: "cp_r_25", name: "CLiProxy", package: "25 IP Regular", price: "$3.00", back: "cliproxy_regular_menu" },
  cliproxy_regular_50ip: { productKey: "cliproxy", itemKey: "cp_r_50", name: "CLiProxy", package: "50 IP Regular", price: "$6.00", back: "cliproxy_regular_menu" },
  cliproxy_regular_100ip: { productKey: "cliproxy", itemKey: "cp_r_100", name: "CLiProxy", package: "100 IP Regular", price: "$12.00", back: "cliproxy_regular_menu" },
  cliproxy_regular_200ip: { productKey: "cliproxy", itemKey: "cp_r_200", name: "CLiProxy", package: "200 IP Regular", price: "$22.00", back: "cliproxy_regular_menu" },
  cliproxy_regular_400ip: { productKey: "cliproxy", itemKey: "cp_r_400", name: "CLiProxy", package: "400 IP Regular", price: "$42.00", back: "cliproxy_regular_menu" },
  cliproxy_regular_800ip: { productKey: "cliproxy", itemKey: "cp_r_800", name: "CLiProxy", package: "800 IP Regular", price: "$78.00", back: "cliproxy_regular_menu" },
  cliproxy_regular_1000ip: { productKey: "cliproxy", itemKey: "cp_r_1000", name: "CLiProxy", package: "1000 IP Regular", price: "88.00", back: "cliproxy_regular_menu" },
  cliproxy_regular_1200ip: { productKey: "cliproxy", itemKey: "cp_r_1200", name: "CLiProxy", package: "1200 IP Regular", price: "$99.00", back: "cliproxy_regular_menu" },

  // =========================
  // CHERRY PROXY
  // =========================
  cherry_discount_1gb: { productKey: "cherry_proxy", itemKey: "ch_d_1", name: "CHerry Proxy", package: "1GB Discount", price: "$3.00", back: "cherry_discount_menu" },
  cherry_discount_2gb: { productKey: "cherry_proxy", itemKey: "ch_d_2", name: "CHerry Proxy", package: "2GB Discount", price: "$6.00", back: "cherry_discount_menu" },
  cherry_discount_3gb: { productKey: "cherry_proxy", itemKey: "ch_d_3", name: "CHerry Proxy", package: "3GB Discount", price: "$8.50", back: "cherry_discount_menu" },
  cherry_discount_4gb: { productKey: "cherry_proxy", itemKey: "ch_d_4", name: "CHerry Proxy", package: "4GB Discount", price: "$11.50", back: "cherry_discount_menu" },
  cherry_discount_5gb: { productKey: "cherry_proxy", itemKey: "ch_d_5", name: "CHerry Proxy", package: "5GB Discount", price: "$14.50", back: "cherry_discount_menu" },

  cherry_regular_1gb: { productKey: "cherry_proxy", itemKey: "ch_r_1", name: "CHerry Proxy", package: "1GB Regular", price: "$3.50", back: "cherry_regular_menu" },
  cherry_regular_2gb: { productKey: "cherry_proxy", itemKey: "ch_r_2", name: "CHerry Proxy", package: "2GB Regular", price: "$7.00", back: "cherry_regular_menu" },
  cherry_regular_3gb: { productKey: "cherry_proxy", itemKey: "ch_r_3", name: "CHerry Proxy", package: "3GB Regular", price: "$10.50", back: "cherry_regular_menu" },
  cherry_regular_4gb: { productKey: "cherry_proxy", itemKey: "ch_r_4", name: "CHerry Proxy", package: "4GB Regular", price: "$13.50", back: "cherry_regular_menu" },
  cherry_regular_5gb: { productKey: "cherry_proxy", itemKey: "ch_r_5", name: "CHerry Proxy", package: "5GB Regular", price: "$16.50", back: "cherry_regular_menu" },
  cherry_regular_10gb: { productKey: "cherry_proxy", itemKey: "ch_r_10", name: "CHerry Proxy", package: "10GB Regular", price: "$32.00", back: "cherry_regular_menu" },
  cherry_regular_15gb: { productKey: "cherry_proxy", itemKey: "ch_r_15", name: "CHerry Proxy", package: "15GB Regular", price: "$49.00", back: "cherry_regular_menu" },
  cherry_regular_20gb: { productKey: "cherry_proxy", itemKey: "ch_r_20", name: "CHerry Proxy", package: "20GB Regular", price: "$62.00", back: "cherry_regular_menu" },

  // =========================
  // DIGI PROXY
  // =========================
  digi_discount_1gb: { productKey: "digi_proxy", itemKey: "dg_d_1", name: "Digi Proxy", package: "1GB Discount", price: "$3.00", back: "digi_discount_menu" },
  digi_discount_2gb: { productKey: "digi_proxy", itemKey: "dg_d_2", name: "Digi Proxy", package: "2GB Discount", price: "$6.00", back: "digi_discount_menu" },
  digi_discount_3gb: { productKey: "digi_proxy", itemKey: "dg_d_3", name: "Digi Proxy", package: "3GB Discount", price: "$8.50", back: "digi_discount_menu" },
  digi_discount_4gb: { productKey: "digi_proxy", itemKey: "dg_d_4", name: "Digi Proxy", package: "4GB Discount", price: "$11.50", back: "digi_discount_menu" },
  digi_discount_5gb: { productKey: "digi_proxy", itemKey: "dg_d_5", name: "Digi Proxy", package: "5GB Discount", price: "$14.50", back: "digi_discount_menu" },

  digi_regular_1gb: { productKey: "digi_proxy", itemKey: "dg_r_1", name: "Digi Proxy", package: "1GB Regular", price: "$3.50", back: "digi_regular_menu" },
  digi_regular_2gb: { productKey: "digi_proxy", itemKey: "dg_r_2", name: "Digi Proxy", package: "2GB Regular", price: "$7.00", back: "digi_regular_menu" },
  digi_regular_3gb: { productKey: "digi_proxy", itemKey: "dg_r_3", name: "Digi Proxy", package: "3GB Regular", price: "$10.50", back: "digi_regular_menu" },
  digi_regular_4gb: { productKey: "digi_proxy", itemKey: "dg_r_4", name: "Digi Proxy", package: "4GB Regular", price: "$13.50", back: "digi_regular_menu" },
  digi_regular_5gb: { productKey: "digi_proxy", itemKey: "dg_r_5", name: "Digi Proxy", package: "5GB Regular", price: "$16.50", back: "digi_regular_menu" },
  digi_regular_10gb: { productKey: "digi_proxy", itemKey: "dg_r_10", name: "Digi Proxy", package: "10GB Regular", price: "$32.00", back: "digi_regular_menu" },
  digi_regular_15gb: { productKey: "digi_proxy", itemKey: "dg_r_15", name: "Digi Proxy", package: "15GB Regular", price: "$49.00", back: "digi_regular_menu" },
  digi_regular_20gb: { productKey: "digi_proxy", itemKey: "dg_r_20", name: "Digi Proxy", package: "20GB Regular", price: "$62.00", back: "digi_regular_menu" }
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
💰 Price: ${formatPrice(order.price)}
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

  // New account customer will provide details
  if (data === "new_account_own_details") {
    const order = pendingOrders[chatId];

    if (!order) {
      await bot.sendMessage(chatId, "⚠️ Please select product/package first.");
      return true;
    }

    await startAccountDetailsFlow(bot, chatId, {
      ...order,
      accountDetailsRequired: true,
      accountDetailsMode: "new_account_own"
    });

    delete pendingOrders[chatId];
    return true;
  }

  // New account from admin, no email/password needed from customer
  if (data === "new_account_from_admin") {
    const order = pendingOrders[chatId];

    if (!order) {
      await bot.sendMessage(chatId, "⚠️ Please select product/package first.");
      return true;
    }

    await showPaymentMethods(bot, chatId, {
      ...order,
      accountDetails: "Customer wants account from admin"
    });

    delete pendingOrders[chatId];
    return true;
  }

  // account type handle only for 9proxy IP / GB
  if (!accountTypes[data]) return false;

  const order = pendingOrders[chatId];

  if (!order) {
    await bot.sendMessage(chatId, "⚠️ Please select product/package first.");
    return true;
  }

  const selectedAccountType = accountTypes[data];

  // OLD Account হলে customer-এর email/password লাগবে
  if (data === "old_account") {
    await startAccountDetailsFlow(bot, chatId, {
      ...order,
      accountType: selectedAccountType,
      accountDetailsRequired: true,
      accountDetailsMode: "old_account"
    });

    delete pendingOrders[chatId];
    return true;
  }

  // New Account হলে customer choose করবে নিজের account দিবে নাকি admin থেকে নিবে
  if (data === "new_account") {
    pendingOrders[chatId] = {
      ...order,
      accountType: selectedAccountType
    };

    await bot.sendMessage(
      chatId,
      `🆕 New Account Option

আপনি কোনভাবে নিতে চান?

1️⃣ নিজের Email/Password দিবেন
2️⃣ আমাদের কাছ থেকে account নিবেন`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "📩 I will provide Email/Password", callback_data: "new_account_own_details" }],
            [{ text: "🛒 I need account from admin", callback_data: "new_account_from_admin" }],
            [{ text: "⬅️ Back", callback_data: order.back }]
          ]
        }
      }
    );

    return true;
  }

  // Redeem Code হলে সরাসরি payment method এ যাবে
  await showPaymentMethods(bot, chatId, {
    ...order,
    accountType: selectedAccountType,
    accountDetails: "Redeem Code"
  });

  delete pendingOrders[chatId];

  return true;
}

module.exports = {
  showProductOptions,
  handleProductOptions
};