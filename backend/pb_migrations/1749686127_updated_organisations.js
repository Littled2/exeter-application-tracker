/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("ws1lknfvl437x0k")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id = user.id || user = \"\"",
    "viewRule": "@request.auth.id = user.id || user = \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("ws1lknfvl437x0k")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id = user",
    "viewRule": "@request.auth.id = user"
  }, collection)

  return app.save(collection)
})
