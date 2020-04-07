const express = require("express");
const controller = require("./role-permission.controller");
const { create, update } = require("./validator");
const validator = require("app/middleware/validator.middleware");
const authenticate = require('app/middleware/authenticate.middleware');
const PermissionKey = require('app/model/staking/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const route = express.Router();

route.get("/permissions", 
  authenticate,
  authority(PermissionKey.VIEW_LIST_PERMISSION),
  controller.getAll
);
route.get("/permissions/me",
  authenticate,
  authority(PermissionKey.VIEW_LIST_PERMISSION_DETAIL),
  controller.get
);
route.post("/roles",
  validator(create),  
  authenticate,
  // authority(PermissionKey.CREATE_ROLE),
  controller.create
);
route.put("/roles/:id",
  validator(update),  
  authenticate,
  // authority(PermissionKey.UPDATE_ROLE),
  controller.update
);

module.exports = route;