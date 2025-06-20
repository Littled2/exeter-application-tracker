/// <reference path="../pb_data_OLD/types.d.ts" />


/**
 * Loads the default locations stored in ../default_data/locations.json
 */


$app.rootCmd.addCommand(new Command({
    use: "load-default-locations",
    run: (cmd, args) => {

        /**
         * Checks if a location already is registered in the database
         * @param {String} name 
         * @returns {Boolean}
         */
        function location_exists(name) {
            const result = arrayOf(new DynamicModel({
                "id":    ""
            }))

            $app.db()
                .select("id")
                .from("locations")
                .where($dbx.like("name", name))
                .orWhere($dbx.like("name", name.trim().toLowerCase()))
                .all(result)

            return result.length !== 0
        }

        /**
         * Adds a new location to the database
         * @param {Object} location 
         */
        function add_location(location) {
            let locationsCollection = $app.findCollectionByNameOrId("locations")

            let newLocationRecord = new Record(locationsCollection)

            newLocationRecord.set("name", location.name)
            newLocationRecord.set("distX", location.distX)
            newLocationRecord.set("distY", location.distY)
            newLocationRecord.set("user", "")

            $app.save(newLocationRecord);
        }

        try {

            const json = String.fromCharCode(...$os.readFile(__hooks + "/../default_data/locations.json"))

            const defaultLocations = JSON.parse(json)

            defaultLocations.forEach(location => {

                // If the location is not already in the database, add it
                if(!location_exists(location?.name)) {
                    add_location(location)
                }
            })
            
        } catch (error) {
            cmd.print("ERROR loading default locations: ", error)
        }
        


    }
}))