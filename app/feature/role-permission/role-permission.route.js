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


/*********************************************************************/
/**
* @swagger
* /web/permissions:
*   get:
*     summary: get list permission
*     tags:
*       - Role Permission
*     description:
*     parameters:
*       - name: offset
*         in: query
*         type: integer
*         format: int32
*       - name: limit
*         in: query
*         type: integer
*         format: int32
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data": {
                    "items": [
                        {
                            "id": 4,
                            "name": "UPDATE_USER",
                            "description": "UPDATE_USER",
                            "deleted_flg": false,
                            "createdAt": "2020-02-12T10:10:37.797Z",
                            "updatedAt": "2020-02-12T10:10:37.797Z"
                        },
                        {
                            "id": 5,
                            "name": "DELETE_USER",
                            "description": "DELETE_USER",
                            "deleted_flg": false,
                            "createdAt": "2020-02-12T10:10:37.797Z",
                            "updatedAt": "2020-02-12T10:10:37.797Z"
                        },
                        {
                            "id": 6,
                            "name": "VIEW_LIST_USER",
                            "description": "VIEW_LIST_USER",
                            "deleted_flg": false,
                            "createdAt": "2020-02-12T10:10:37.797Z",
                            "updatedAt": "2020-02-12T10:10:37.797Z"
                        }
                      ]
                    }
                }
*       400:
*         description: Error
*         schema:
*           $ref: '#/definitions/400'
*       401:
*         description: Error
*         schema:
*           $ref: '#/definitions/401'
*       404:
*         description: Error
*         schema:
*           $ref: '#/definitions/404'
*       500:
*         description: Error
*         schema:
*           $ref: '#/definitions/500'
*
*/

/**
* @swagger
* /web/permissions/me:
*   get:
*     summary: get list permission of role
*     tags:
*       - Role Permission
*     description:
*     parameters:
*       - name: offset
*         in: query
*         type: integer
*         format: int32
*       - name: limit
*         in: query
*         type: integer
*         format: int32
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data": {
                    "items": [
                        {
                            "id": 4,
                            "name": "UPDATE_USER",
                            "description": "UPDATE_USER",
                            "deleted_flg": false,
                            "createdAt": "2020-02-12T10:10:37.797Z",
                            "updatedAt": "2020-02-12T10:10:37.797Z"
                        },
                        {
                            "id": 5,
                            "name": "DELETE_USER",
                            "description": "DELETE_USER",
                            "deleted_flg": false,
                            "createdAt": "2020-02-12T10:10:37.797Z",
                            "updatedAt": "2020-02-12T10:10:37.797Z"
                        },
                        {
                            "id": 6,
                            "name": "VIEW_LIST_USER",
                            "description": "VIEW_LIST_USER",
                            "deleted_flg": false,
                            "createdAt": "2020-02-12T10:10:37.797Z",
                            "updatedAt": "2020-02-12T10:10:37.797Z"
                        }
                      ]
                    }
                }
*       400:
*         description: Error
*         schema:
*           $ref: '#/definitions/400'
*       401:
*         description: Error
*         schema:
*           $ref: '#/definitions/401'
*       404:
*         description: Error
*         schema:
*           $ref: '#/definitions/404'
*       500:
*         description: Error
*         schema:
*           $ref: '#/definitions/500'
*
*/

/**
 * @swagger
 * /web/roles:
 *   post:
 *     summary: create role
 *     tags:
 *       - Role Permission
 *     description:
 *     parameters:
 *       - in: body
 *         name: name
 *         type: string
 *         required: true
 *       - in: body
 *         name: level
 *         type: string
 *         required: true
 *      - in: body
 *         name: permission_id
 *         type: array
 *         required: true
 *         schema:
 *            type: object
 *            - name
 *            example:
 *               {
                    "name":"User",
                    "level": 50,
                    "permission_id":[17,18,19,20]
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                  "data": {
                      "role_permissions": [
                          {
                              "role_id": 15,
                              "permission_id": 17
                          },
                          {
                              "role_id": 15,
                              "permission_id": 18
                          },
                          {
                              "role_id": 15,
                              "permission_id": 19
                          },
                          {
                              "role_id": 15,
                              "permission_id": 20
                          }
                      ]
                  }
              }
 *       400:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/400'
 *       401:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/401'
 *       404:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/404'
 *       500:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/500'
*/
/**
 * @swagger
 * /web/roles/{id}:
 *   put:
 *     summary: update role
 *     tags:
 *       - Role Permission
 *     description:
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *       - in: body
 *         name: name
 *         type: string
 *         required: true
 *       - in: body
 *         name: level
 *         type: string
 *         required: true
 *      - in: body
 *         name: permission_id
 *         type: array
 *         required: true
 *         schema:
 *            type: object
 *            - name
 *            example:
 *               {
                    "name":"User1",
                    "level": 50,
                    "permission_id":[17,18]
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                  "data": true
              }
 *       400:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/400'
 *       401:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/401'
 *       404:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/404'
 *       500:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/500'
*/