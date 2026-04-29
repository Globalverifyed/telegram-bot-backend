const ADMIN_IDS = [
  "8747545932", // main admin
  "5869510759",
  "8120415526"
];

function isAdmin(userId) {
  return ADMIN_IDS.includes(String(userId));
}

module.exports = {
  ADMIN_IDS,
  isAdmin
};