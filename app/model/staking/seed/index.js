const config = require("app/config");

(async () => {
  try {
    await Promise.all([require("./permission")()]);
    if (config.enableSeed) {
      await Promise.all([require("./user")(), require("./role")()]);
      require("./role-permission")();
      require("./user-role")();
      await require("./setting")();
      require('./cold-wallet')();
    }
    require("./root-permission")();
  }
  catch (err) {
    console.log(err)
  }
}
)()