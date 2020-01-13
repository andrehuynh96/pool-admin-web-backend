const config = require("app/config");

if (config.enableSeed) {
  try {
    require("./user");
  }
  catch (err) {
    console.log(err)
  }
}