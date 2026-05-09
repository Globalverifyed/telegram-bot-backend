const { ADMIN_CHAT_IDS } = require("../config");

const FALLBACK_ADMIN_IDS = [
  "8747545932",
  "5869510759",
  "8120415526"
];

const ADMIN_IDS = ADMIN_CHAT_IDS.length > 0 ? ADMIN_CHAT_IDS : FALLBACK_ADMIN_IDS;

function isAdmin(userId) {
  return ADMIN_IDS.includes(String(userId));
}

module.exports = {
  ADMIN_IDS,
  isAdmin
};
