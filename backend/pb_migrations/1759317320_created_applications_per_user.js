/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "json3885137012",
        "maxSize": 1,
        "name": "email",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "json3988965680",
        "maxSize": 1,
        "name": "numApps",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "json2159557072",
        "maxSize": 1,
        "name": "ranking",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      }
    ],
    "id": "pbc_3069943636",
    "indexes": [],
    "listRule": null,
    "name": "applications_per_user",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "-- Step 1: Count applications per user\nWITH user_counts AS ( SELECT u.id, u.email, COUNT(a.id) AS numApps FROM users u LEFT JOIN applications a ON u.id = a.user GROUP BY u.id )\n\n-- Step 2: Rank users by numApps\nSELECT uc.id AS id, uc.email AS email, uc.numApps, ( SELECT COUNT(*) + 1 FROM user_counts uc2 WHERE uc2.numApps > uc.numApps ) AS ranking FROM user_counts uc ORDER BY uc.numApps DESC;",
    "viewRule": "@request.auth.id = id"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3069943636");

  return app.delete(collection);
})
