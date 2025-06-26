/// <reference path="../pb_data/types.d.ts" />


/**
 * Loads the default organisations stored in ../default_data/organisations.json
 */


$app.rootCmd.addCommand(new Command({
    use: "load-default-organisations",
    run: (cmd, args) => {

        /**
         * Checks if a organisation already is registered in the database
         * @param {String} name 
         * @returns {Boolean}
         */
        function organisation_exists(name) {
            const result = arrayOf(new DynamicModel({
                "id":    ""
            }))

            $app.db()
                .select("id")
                .from("organisations")
                .where($dbx.like("name", name))
                .orWhere($dbx.like("name", name.trim().toLowerCase()))
                .all(result)

            return result.length !== 0
        }

        /**
         * Adds a new organisation to the database
         * @param {Object} organisation 
         */
        function add_organisation(organisation) {
            let organisationsCollection = $app.findCollectionByNameOrId("organisations")

            let newOrganisationRecord = new Record(organisationsCollection)

            newOrganisationRecord.set("name", organisation.name)
            newOrganisationRecord.set("distX", organisation.distX)
            newOrganisationRecord.set("distY", organisation.distY)
            newOrganisationRecord.set("user", "")

            $app.save(newOrganisationRecord);
        }

        try {

            const json = String.fromCharCode(...$os.readFile(__hooks + "/../default_data/organisations.json"))

            const defaultOrganisations = JSON.parse(json)

            defaultOrganisations.forEach(organisation => {

                // If the organisation is not already in the database, add it
                if(!organisation_exists(organisation?.name)) {
                    add_organisation(organisation)
                }
            })
            
        } catch (error) {
            cmd.print("ERROR loading default organisations: ", error)
        }
        


    }
}))