/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("eu6oplzq5igxifc")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "bool3582250329",
    "name": "forwarded",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("eu6oplzq5igxifc")

  // remove field
  collection.fields.removeById("bool3582250329")

  return app.save(collection)
})
