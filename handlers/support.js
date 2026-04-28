const { showMainMenu } = require("./menu");
const { sendOrEdit } = require("./utils");

async function handleSupport(bot, query) {
  const data = query.data;

  if (data === "back_main") {
    await showMainMenu(bot, query);
    return true;
  }

  if (data === "join_channel") {
    await sendOrEdit(bot, query, "📢 Join our channel:", [
      [{ text: "👉 Join Channel", url: process.env.CHANNEL_URL }],
      [{ text: "⬅ Back", callback_data: "back_main" }]
    ]);
    return true;
  }

  if (data === "hotline") {
    await sendOrEdit(bot, query, "☎ Contact Support:", [
      [{ text: "💬 Message Support", url: process.env.SUPPORT_URL }],
      [{ text: "⬅ Back", callback_data: "back_main" }]
    ]);
    return true;
  }

  if (data === "others") {
    await sendOrEdit(bot, query, "📦 Others section coming soon.", [
      [{ text: "⬅ Back", callback_data: "back_main" }]
    ]);
    return true;
  }

  return false;
}

module.exports = { handleSupport };