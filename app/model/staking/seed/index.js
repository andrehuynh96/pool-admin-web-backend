const config = require("app/config");
require("./permission");

if (config.enableSeed) {
  try {
    require("./user");
    require("./role");
    require("./role-permission");
    require("./user-role");
  }
  catch (err) {
    console.log(err)
  }
}