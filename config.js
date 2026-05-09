// config.js
require("dotenv").config();

const ADMIN_CHAT_IDS = (process.env.ADMIN_CHAT_IDS || process.env.ADMIN_CHAT_ID || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

module.exports = {
  CHANNEL_ID: Number(process.env.CHANNEL_ID || -1003704005774),
  CHANNEL_LINK: process.env.CHANNEL_URL || "",
  SUPPORT_URL: process.env.SUPPORT_URL || "",
  ADMIN_CHAT_ID: ADMIN_CHAT_IDS[0] || process.env.ADMIN_CHAT_ID || "",
  ADMIN_CHAT_IDS
};
