/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("51e6wbmlsn4htcf")

  // update collection data
  unmarshal({
    "createRule": "  @request.auth.id = user.id || user = \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("51e6wbmlsn4htcf")

  // update collection data
  unmarshal({
    "createRule": "  @request.auth.id = user.id"
  }, collection)

  return app.save(collection)
})
