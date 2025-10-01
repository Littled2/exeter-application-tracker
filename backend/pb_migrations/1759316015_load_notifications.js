/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {


	let notification_templates = [
		{
			"cooldownSeconds": 60,
			"important": false,
			"showRecapButton": false,
			"textContent": "Congrats on creating your first application 🔥 Add 3 to see where you rank!",
			"title": "firstApplicationForGroup",
		},
		{
			"cooldownSeconds": 604800,
			"important": false,
			"showRecapButton": true,
			"textContent": "Your ranking is ready! See how you compare to other users",
			"title": "yourRankingIsReady",
		}
	]

	let templatesCollection = app.findCollectionByNameOrId("notification_templates")
	
	notification_templates.forEach(template => {
		let newTemplate = new Record(templatesCollection)

		Object.keys(template).forEach(key => {
			newTemplate.set(key, template[key])
		})

		app.save(newTemplate)
	})
}, (app) => {

	// Delete the records

})
