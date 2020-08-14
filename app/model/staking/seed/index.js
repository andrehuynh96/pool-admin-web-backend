const config = require("app/config");

(async () => {
  try {
    await Promise.all([require("./permission")()]);

    if (config.enableSeed) {
      await Promise.all([require("./user")(), require("./role")()]);
      await require("./role-permission")();
      await require("./user-role")();
      await require("./cold-wallet")();
      await require("./setting")();
    }

    await require("./root-permission")();
    console.log('Seeding data is completed.');
  }
  catch (err) {
    console.log(err);
  }
}
)();
