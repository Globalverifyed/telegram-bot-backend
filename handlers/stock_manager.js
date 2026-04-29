const stockRegistry = {
  dataimpulse: {
  title: "⚡ DataImpulse",
  items: {
    di_5: { label: "5 GB", stock: 0 },
    di_6: { label: "6 GB", stock: 0 },
    di_6_5: { label: "6.5 GB", stock: 0 },

    di_7_5: { label: "7.5 GB", stock: 5 },

    di_8: { label: "8 GB", stock: 0 },
    di_8_5: { label: "8.5 GB", stock: 0 },
    di_10: { label: "10 GB", stock: 0 },
    di_12_5: { label: "12.5 GB", stock: 0 },
    di_14: { label: "14 GB", stock: 1 },
    di_15: { label: "15 GB", stock: 0 },
    di_16: { label: "16 GB", stock: 0 },
    di_17_5: { label: "17.5 GB", stock: 0 },
    di_20: { label: "20 GB", stock: 4 },

    di_25: { label: "25 GB", stock: 0 },

    di_30: { label: "30 GB", stock: 0 },
    di_50: { label: "50 GB", stock: 0 },
    di_100: { label: "100 GB", stock: 0 }
  }
},

  proxy_ip: {
    title: "🌍 9proxy IP",
    items: {
      ip25: { label: "25 IP", stock: 5 },
      ip50: { label: "50 IP", stock: 5 },
      ip100: { label: "100 IP", stock: 5 },
      ip200: { label: "200 IP", stock: 5 },
      ip300: { label: "300 IP", stock: 5 },
      ip500: { label: "500 IP", stock: 5 },
      ip1000: { label: "1000 IP", stock: 5 }
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