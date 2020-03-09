const config = require("app/config");
require("./permission");

if (config.enableSeed) {
  try {
    require("./user");
    require("./role");
    require("./setting");
  }
  catch (err) {
    console.log(err)
  }
}