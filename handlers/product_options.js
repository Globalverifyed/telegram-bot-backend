const { showPaymentMethods, startAccountDetailsFlow } = require("./payment");
const { sendOrEdit, formatPrice } = require("./utils");
const { isAvailable, getStock } = require("./stock_manager");

const pendingOrders = {};

const accountTypes = {
  old_account: "OLD Account",
  new_account: "New Account",
  redeem_code: "Redeem Code",
  web_login: "Web Login",
  phone_login: "Phone Login"
};

function needsAccountType(order) {
  return [
    "proxy_ip",
    "proxy_gb",
    "google_voice",
    "textnow",
    "textfree",
    "textplus",
    "texttone",
    "sideline"
  ].includes(order.productKey);
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
  digi_regular_20gb: { productKey: "digi_proxy", itemKey: "dg_r_20", name: "Digi Proxy", package: "20GB Regular", price: "$62.00", back: "digi_regular_menu" },

  // =========================
  // 📦 OTHERS PRODUCTS
  // =========================

  google_ai_pro_1m: { productKey: "google_ai_pro", itemKey: "gaip_1m", name: "Google AI Pro (Gemini)", package: "1 Month", price: "$6", back: "others" },

  chatgpt_go_10m: { productKey: "chatgpt_go", itemKey: "cg_10m", name: "ChatGPT Go", package: "10 Month", price: "$8.50", back: "others" },

  chatgpt_plus_1m: { productKey: "chatgpt_plus", itemKey: "cgp_1m", name: "ChatGPT Plus", package: "1 Month", price: "$5.50", back: "others" },

  capcut_pro_1m: { productKey: "capcut_pro", itemKey: "ccp_1m", name: "Capcut Pro", package: "1 Month", price: "$1.80", back: "others" },

  telegram_premium_1m: { productKey: "telegram_premium", itemKey: "tg_1m", name: "Telegram Premium", package: "1 Month", price: "$12", back: "others", forceStockOut: true },
  telegram_premium_3m: { productKey: "telegram_premium", itemKey: "tg_3m", name: "Telegram Premium", package: "3 Month", price: "$16", back: "others" },
  telegram_premium_6m: { productKey: "telegram_premium", itemKey: "tg_6m", name: "Telegram Premium", package: "6 Month", price: "$22", back: "others" },
  telegram_premium_12m: { productKey: "telegram_premium", itemKey: "tg_12m", name: "Telegram Premium", package: "12 Month", price: "$36", back: "others" },

  canva_pro_1m: { productKey: "canva_pro", itemKey: "cv_1m", name: "Canva Pro", package: "1 Month", price: "$0.30", back: "others" },
  canva_pro_3m: { productKey: "canva_pro", itemKey: "cv_3m", name: "Canva Pro", package: "3 Month", price: "$0.50", back: "others" },
  canva_pro_6m: { productKey: "canva_pro", itemKey: "cv_6m", name: "Canva Pro", package: "6 Month", price: "$1", back: "others" },
  canva_pro_12m: { productKey: "canva_pro", itemKey: "cv_12m", name: "Canva Pro", package: "12 Month", price: "$2", back: "others" },

  amazon_prime_1m: { productKey: "amazon_prime", itemKey: "ap_1m", name: "Amazon Prime Video", package: "1 Month", price: "$5", back: "others" },

  disney_plus_1m: { productKey: "disney_plus", itemKey: "dp_1m", name: "Disney Plus", package: "1 Month", price: "$5", back: "others" },

  netflix_1m: { productKey: "netflix_premium", itemKey: "nf_1m", name: "Netflix Premium Personal", package: "1 Month", price: "$6.50", back: "others" },
  netflix_3m: { productKey: "netflix_premium", itemKey: "nf_3m", name: "Netflix Premium Personal", package: "3 Month", price: "$15", back: "others" },
  netflix_6m: { productKey: "netflix_premium", itemKey: "nf_6m", name: "Netflix Premium Personal", package: "6 Month", price: "$25", back: "others" },

  veo_3: { productKey: "veo_3", itemKey: "veo_contact", name: "VEO 3", package: "Contact Support", price: "Contact Support", back: "others" },

  spotify_premium: { productKey: "spotify_premium", itemKey: "sp_contact", name: "Spotify Premium", package: "Contact Support", price: "Contact Support", back: "others" },

  outlook_old_25: { productKey: "outlook_old", itemKey: "outlook_ps25", name: "Outlook Mail Old", package: "PS25", price: "$1.99", back: "others" },
  outlook_old_50: { productKey: "outlook_old", itemKey: "outlook_ps50", name: "Outlook Mail Old", package: "PS50", price: "$3.49", back: "others" },

  hotmail_25: { productKey: "hotmail", itemKey: "hotmail_ps25", name: "Hotmail", package: "PS25", price: "$1.99", back: "others" },
  hotmail_50: { productKey: "hotmail", itemKey: "hotmail_ps50", name: "Hotmail", package: "PS50", price: "$3.49", back: "others" },

  edu_us_10: { productKey: "edu_us", itemKey: "edu_us_10", name: "EDU Mail (.us)", package: "10 Mail", price: "$1.99", back: "others" },
  edu_us_25: { productKey: "edu_us", itemKey: "edu_us_25", name: "EDU Mail (.us)", package: "25 Mail", price: "$4.90", back: "others" },

  edu_us_org_10: { productKey: "edu_us_org", itemKey: "edu_org_10", name: "EDU Mail (.US.ORG)", package: "10 Mail", price: "$1.99", back: "others" },
  edu_us_org_25: { productKey: "edu_us_org", itemKey: "edu_org_25", name: "EDU Mail (.US.ORG)", package: "25 Mail", price: "$4.90", back: "others" },

  google_voice: { productKey: "google_voice", itemKey: "gv_1", name: "Google Voice Account", package: "1 Account", price: "$3", back: "others" },

  textnow: { productKey: "textnow", itemKey: "tn_1", name: "TextNow (TN)", package: "1 Account", price: "$2", back: "others" },
  textfree: { productKey: "textfree", itemKey: "tf_1", name: "TextFree (TF)", package: "1 Account", price: "$2", back: "others" },
  textplus: { productKey: "textplus", itemKey: "tp_1", name: "TextPlus", package: "1 Account", price: "$2", back: "others" },
  texttone: { productKey: "texttone", itemKey: "tt_1", name: "TextTone (TT)", package: "1 Account", price: "$2", back: "others" },
  sideline: { productKey: "sideline", itemKey: "sl_1", name: "Sideline (SL)", package: "1 Account", price: "$2", back: "others" },

  hitmess: { productKey: "hitmess", itemKey: "hm_new", name: "Hitmess", package: "New Account", price: "$25", back: "others", accountType: "New Account" },

  iplum_premium: { productKey: "iplum_premium", itemKey: "iplum_new", name: "IPLUM Account Premium", package: "New Account", price: "$25", back: "others", accountType: "New Account" },

  magic_app: { productKey: "magic_app", itemKey: "magic_new", name: "Magic App", package: "New Account", price: "$25", back: "others", accountType: "New Account" }
};

function isOthersProduct(order) {
  return [
    "google_ai_pro",
    "chatgpt_go",
    "chatgpt_plus",
    "capcut_pro",
    "telegram_premium",
    "canva_pro",
    "amazon_prime",
    "disney_plus",
    "netflix_premium",
    "veo_3",
    "spotify_premium",
    "outlook_old",
    "hotmail",
    "edu_us",
    "edu_us_org",
    "google_voice",
    "textnow",
    "textfree",
    "textplus",
    "texttone",
    "sideline",
    "hitmess",
    "iplum_premium",
    "magic_app"
  ].includes(order.productKey);
}

const otherProductGroups = {
  google_ai_pro: ["google_ai_pro_1m"],
  chatgpt_go: ["chatgpt_go_10m"],
  chatgpt_plus: ["chatgpt_plus_1m"],
  capcut_pro: ["capcut_pro_1m"],

  telegram_premium: [
    "telegram_premium_1m",
    "telegram_premium_3m",
    "telegram_premium_6m",
    "telegram_premium_12m"
  ],

  canva_pro: [
    "canva_pro_1m",
    "canva_pro_3m",
    "canva_pro_6m",
    "canva_pro_12m"
  ],

  amazon_prime: ["amazon_prime_1m"],
  disney_plus: ["disney_plus_1m"],

  netflix_premium: [
    "netflix_1m",
    "netflix_3m",
    "netflix_6m"
  ],

  veo_3: ["veo_3"],
  spotify_premium: ["spotify_premium"],

  outlook_old: [
    "outlook_old_25",
    "outlook_old_50"
  ],

  hotmail: [
    "hotmail_25",
    "hotmail_50"
  ],

  edu_us: [
    "edu_us_10",
    "edu_us_25"
  ],

  edu_us_org: [
    "edu_us_org_10",
    "edu_us_org_25"
  ],

  google_voice: ["google_voice"],
  textnow: ["textnow"],
  textfree: ["textfree"],
  textplus: ["textplus"],
  texttone: ["texttone"],
  sideline: ["sideline"],

  hitmess: ["hitmess"],
  iplum_premium: ["iplum_premium"],
  magic_app: ["magic_app"]
};

function buildPackageButtons(packageKeys) {
  const rows = [];
  const buttons = packageKeys.map((key) => {
    const item = proxyProducts[key];

    const stockText = item.forceStockOut ? " - Stock Out" : "";
    const priceText = item.price ? ` - ${item.price}` : "";

    return {
      text: `${item.package}${priceText}${stockText}`,
      callback_data: key
    };
  });

  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }

  rows.push([{ text: "⬅️ Back", callback_data: "others" }]);

  return rows;
}

async function showOtherProductPackageMenu(bot, query, groupKey) {
  const packageKeys = otherProductGroups[groupKey];

  if (!packageKeys) return false;

  const firstProduct = proxyProducts[packageKeys[0]];

  await sendOrEdit(
    bot,
    query,
    `📦 ${firstProduct.name}

Select package:`,
    buildPackageButtons(packageKeys)
  );

  return true;
}

function getStockText(order) {
  if (order.forceStockOut) return "Out of Stock";

  if (isOthersProduct(order)) {
    return "Available";
  }

  const stockCount = getStock(order.productKey, order.itemKey);
  return `${stockCount} Available`;
}

function buildAccountTypeButtons(order) {
  if (order.productKey === "google_voice") {
    return [
      [
        { text: "👴 OLD Account - $6", callback_data: "old_account" },
        { text: "🆕 New Account - $3", callback_data: "new_account" }
      ],
      [{ text: "⬅️ Back", callback_data: order.back }]
    ];
  }

  if (["textnow", "textfree", "textplus", "texttone", "sideline"].includes(order.productKey)) {
    return [
      [
        { text: "🌐 Web Login - $2", callback_data: "web_login" },
        { text: "📱 Phone Login - $1", callback_data: "phone_login" }
      ],
      [{ text: "⬅️ Back", callback_data: order.back }]
    ];
  }

  return [
    [
      { text: "👴 OLD Account", callback_data: "old_account" },
      { text: "🆕 New Account", callback_data: "new_account" }
    ],
    [{ text: "🎟️ Redeem Code", callback_data: "redeem_code" }],
    [{ text: "⬅️ Back", callback_data: order.back }]
  ];
}

async function showProductOptions(bot, query, order) {
  const chatId = query.message.chat.id;

  if (order.forceStockOut) {
    await sendOrEdit(bot, query, "❌ Out of Stock!", [
      [{ text: "⬅️ Back", callback_data: order.back }]
    ]);
    return;
  }

  if (needsAccountType(order)) {
    pendingOrders[chatId] = order;

    await sendOrEdit(
      bot,
      query,
      `✅ Selected Product

📦 Product: ${order.name}
📊 Package: ${order.package}
💰 Price: ${formatPrice(order.price)}
📦 Stock: ${getStockText(order)}

Select account type:`,
      buildAccountTypeButtons(order)
    );

    return;
  }

  await showPaymentMethods(bot, chatId, {
    ...order,
    stock: getStockText(order)
  });
}

async function handleProductOptions(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (otherProductGroups[data]) {
    await showOtherProductPackageMenu(bot, query, data);
    return true;
  }

  if (proxyProducts[data]) {
    const order = proxyProducts[data];

    if (order.forceStockOut) {
      await sendOrEdit(bot, query, "❌ Out of Stock!", [
        [{ text: "⬅️ Back", callback_data: order.back }]
      ]);
      return true;
    }

    if (!isOthersProduct(order) && !isAvailable(order.productKey, order.itemKey)) {
      await sendOrEdit(bot, query, "❌ Out of Stock!", [
        [{ text: "⬅️ Back", callback_data: order.back }]
      ]);
      return true;
    }

    if (String(order.price).toLowerCase().includes("contact support")) {
      await sendOrEdit(
        bot,
        query,
        `📦 ${order.name}

এই product এর জন্য support এ contact করুন।`,
        [
          [{ text: "☎ Contact Support", callback_data: "hotline" }],
          [{ text: "⬅️ Back", callback_data: order.back }]
        ]
      );

      return true;
    }

    await showProductOptions(bot, query, order);
    return true;
  }

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

  if (!accountTypes[data]) return false;

  const order = pendingOrders[chatId];

  if (!order) {
    await bot.sendMessage(chatId, "⚠️ Please select product/package first.");
    return true;
  }

  const selectedAccountType = accountTypes[data];

  if (order.productKey === "google_voice") {
    await showPaymentMethods(bot, chatId, {
      ...order,
      accountType: selectedAccountType,
      price: data === "old_account" ? "$6" : "$3"
    });

    delete pendingOrders[chatId];
    return true;
  }

  if (data === "web_login" || data === "phone_login") {
    const selectedType = data === "web_login" ? "Web Login" : "Phone Login";

    await showPaymentMethods(bot, chatId, {
      ...order,
      accountType: selectedType,
      price: data === "web_login" ? "$2" : "$1"
    });

    delete pendingOrders[chatId];
    return true;
  }

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