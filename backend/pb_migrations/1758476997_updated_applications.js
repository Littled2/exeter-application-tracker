/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("a7afhwwfdhn3gw7")

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "file4268157019",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "questionResponses",
    "presentable": false,
    "protected": true,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("a7afhwwfdhn3gw7")

  // remove field
  collection.fields.removeById("file4268157019")

  return app.save(collection)
})
