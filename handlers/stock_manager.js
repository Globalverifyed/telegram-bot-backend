const stockRegistry = {
  dataimpulse: {
    title: "⚡ DataImpulse",
    items: {
      // Discount packages
      di_5: { label: "5 GB (Discount)", stock: 0 },
      di_6: { label: "6 GB (Discount)", stock: 0 },
      di_6_5: { label: "6.5 GB (Discount)", stock: 0 },
      di_7_5: { label: "7.5 GB (Discount)", stock: 5 },
      di_8: { label: "8 GB (Discount)", stock: 0 },
      di_8_5: { label: "8.5 GB (Discount)", stock: 0 },
      di_10: { label: "10 GB (Discount)", stock: 0 },
      di_12_5: { label: "12.5 GB (Discount)", stock: 0 },
      di_15: { label: "15 GB (Discount)", stock: 0 },
      di_16: { label: "16 GB (Discount)", stock: 0 },
      di_17_5: { label: "17.5 GB (Discount)", stock: 0 },
      di_20: { label: "20 GB (Discount)", stock: 0 },
      di_25: { label: "25 GB (Discount)", stock: 3 },
      di_30: { label: "30 GB (Discount)", stock: 0 },
      di_50: { label: "50 GB (Discount)", stock: 0 },
      di_100: { label: "100 GB (Discount)", stock: 1 },

      // Regular packages
      r1: { label: "1 GB (Regular)", stock: 5 },
      r2: { label: "2 GB (Regular)", stock: 5 },
      r3: { label: "3 GB (Regular)", stock: 5 },
      r4: { label: "4 GB (Regular)", stock: 5 },
      r5: { label: "5 GB (Regular)", stock: 5 },
      r7_5: { label: "7.5 GB (Regular)", stock: 5 },
      r10: { label: "10 GB (Regular)", stock: 5 },
      r12: { label: "12 GB (Regular)", stock: 5 },
      r12_5: { label: "12.5 GB (Regular)", stock: 5 },
      r15: { label: "15 GB (Regular)", stock: 5 },
      r25: { label: "25 GB (Regular)", stock: 5 },
      r30: { label: "30 GB (Regular)", stock: 5 },
      r50: { label: "50 GB (Regular)", stock: 5 },
      r80: { label: "80 GB (Regular)", stock: 5 },
      r100: { label: "100 GB (Regular)", stock: 5 }
    }
  },

  proxy_ip: {
  title: "🌍 9proxy IP",
  items: {
    ip_d_25: { label: "25 IP (Discount)", stock: 5 },
    ip_d_50: { label: "50 IP (Discount)", stock: 5 },
    ip_d_100: { label: "100 IP (Discount)", stock: 5 },
    ip_d_200: { label: "200 IP (Discount)", stock: 5 },
    ip_d_300: { label: "300 IP (Discount)", stock: 5 },
    ip_d_400: { label: "400 IP (Discount)", stock: 5 },
    ip_d_500: { label: "500 IP (Discount)", stock: 5 },
    ip_d_1000: { label: "1000 IP (Discount)", stock: 5 },
    ip_d_2000: { label: "2000 IP (Discount)", stock: 5 },
    ip_d_3000: { label: "3000 IP (Discount)", stock: 5 },
    ip_d_4000: { label: "4000 IP (Discount)", stock: 5 },
    ip_d_5000: { label: "5000 IP (Discount)", stock: 5 },

    ip_r_25: { label: "25 IP (Regular)", stock: 5 },
    ip_r_50: { label: "50 IP (Regular)", stock: 5 },
    ip_r_100: { label: "100 IP (Regular)", stock: 5 },
    ip_r_200: { label: "200 IP (Regular)", stock: 5 },
    ip_r_300: { label: "300 IP (Regular)", stock: 5 },
    ip_r_400: { label: "400 IP (Regular)", stock: 5 },
    ip_r_500: { label: "500 IP (Regular)", stock: 5 },
    ip_r_1000: { label: "1000 IP (Regular)", stock: 5 },
    ip_r_2000: { label: "2000 IP (Regular)", stock: 5 },
    ip_r_3000: { label: "3000 IP (Regular)", stock: 5 },
    ip_r_4000: { label: "4000 IP (Regular)", stock: 5 },
    ip_r_5000: { label: "5000 IP (Regular)", stock: 5 }
  }
},

  proxy_gb: {
    title: "📦 9proxy GB",
    items: {
      gb1: { label: "1 GB", stock: 5 },
      gb2: { label: "2 GB", stock: 5 },
      gb3: { label: "3 GB", stock: 5 },
      gb5: { label: "5 GB", stock: 5 },
      gb10: { label: "10 GB", stock: 5 },
      gb15: { label: "15 GB", stock: 5 },
      gb20: { label: "20 GB", stock: 5 }
    }
  },

  swift_proxy: {
    title: "🚀 Swift Proxy",
    items: {
      sw1: { label: "1 GB", stock: 5 },
      sw2: { label: "2 GB", stock: 5 },
      sw3: { label: "3 GB", stock: 5 },
      sw5: { label: "5 GB", stock: 5 },
      sw10: { label: "10 GB", stock: 5 },
      sw15: { label: "15 GB", stock: 5 },
      sw20: { label: "20 GB", stock: 5 }
    }
  },

  nice_proxy: {
    title: "🔥 Nice Proxy",
    items: {
      np1: { label: "1 GB", stock: 5 },
      np2: { label: "2 GB", stock: 5 },
      np3: { label: "3 GB", stock: 5 },
      np5: { label: "5 GB", stock: 5 },
      np10: { label: "10 GB", stock: 5 },
      np15: { label: "15 GB", stock: 5 },
      np20: { label: "20 GB", stock: 5 }
    }
  }
};

function getStock(productKey, itemKey) {
  return stockRegistry[productKey]?.items[itemKey]?.stock || 0;
}

function isAvailable(productKey, itemKey) {
  return getStock(productKey, itemKey) > 0;
}

function reduceStock(productKey, itemKey) {
  if (stockRegistry[productKey]?.items[itemKey]?.stock > 0) {
    stockRegistry[productKey].items[itemKey].stock -= 1;
  }
}

function addStock(productKey, itemKey) {
  if (stockRegistry[productKey]?.items[itemKey]) {
    stockRegistry[productKey].items[itemKey].stock += 1;
  }
}

function removeStock(productKey, itemKey) {
  if (stockRegistry[productKey]?.items[itemKey]?.stock > 0) {
    stockRegistry[productKey].items[itemKey].stock -= 1;
  }
}

module.exports = {
  stockRegistry,
  getStock,
  isAvailable,
  reduceStock,
  addStock,
  removeStock
};