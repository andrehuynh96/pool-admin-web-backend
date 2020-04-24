const config = require("app/config");

(async () => {
  try {
    await Promise.all([require("./permission")()]);
    if (config.enableSeed) {
      await Promise.all([require("./user")(), require("./role")()]);
      require("./role-permission")();
      require("./user-role")();
      require("./cold-wallet")();
      await require("./setting")(); 
    }
    require("./root-permission")();
  }
  catch (err) {
    console.log(err)
  }
}
)()