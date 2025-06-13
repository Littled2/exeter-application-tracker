/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2301922722")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number3442062977",
    "max": null,
    "min": null,
    "name": "cooldownSeconds",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2301922722")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number3442062977",
    "max": null,
    "min": null,
    "name": "minRepeatNotificationTimeInSeconds",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
