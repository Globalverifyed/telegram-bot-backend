function safeRequire(path) {
  try {
    return require(path);
  } catch (err) {
    console.log(`Handler load failed: ${path}`, err.message);
    return {};
  }
}

module.exports = {
  ...safeRequire("./support"),
  ...safeRequire("./ip_proxy"),
  ...safeRequire("./dataimpulse"),
  ...safeRequire("./9proxy_ip"),
  ...safeRequire("./9proxy_gb"),
  ...safeRequire("./swift_proxy"),
  ...safeRequire("./nice_proxy"),
  ...safeRequire("./abc_proxy"),
  ...safeRequire("./proxy_seller"),
  ...safeRequire("./proxy_light"),
  ...safeRequire("./nov_proxy"),
  ...safeRequire("./iprocket_proxy"),
  ...safeRequire("./nodemaven"),
  ...safeRequire("./cliproxy"),
  ...safeRequire("./cherry_proxy"),
  ...safeRequire("./digi_proxy"),
  ...safeRequire("./vpn"),
  ...safeRequire("./subscription"),
  ...safeRequire("./product_options"),
  ...safeRequire("./others")
};