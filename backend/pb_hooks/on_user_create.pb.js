/// <reference path="../pb_data/types.d.ts" />


/**
 * Generates a token for each user that will be used to access their deadlines calender via an ical subscription link
 * 
 * Sets initial values for a new user
*/

onRecordAfterCreateSuccess((e) => {

    try {
        
        
        // Set a calendar token
        const calendarToken = $security.randomString(128)
        e.record.set("calendarToken", calendarToken)
        
        // Set the default values for locationsView, stagesView and deadlinesView
        e.record.set("locationsView", true)
        e.record.set("stagesView", true)
        e.record.set("deadlinesView", true)

        $app.save(e.record)


    } catch (error) {
        console.log("Error generating initial calendarToken for a new user!", error)
        $app.logger().error("Error generating initial calendarToken for a new user!", error)
    }

    e.next()

}, "users")



/**
 * Generates a token when a user record is updated to not have a calendar token.
 * This is used when a user wants to re-generate their token
 */

onRecordAfterUpdateSuccess((e) => {

    if(e.record.get("calendarToken") === "") {
        try {
            
            const newCalendarToken = $security.randomString(128)

            e.record.set("calendarToken", newCalendarToken)

            $app.save(e.record)


        } catch (error) {
            console.log("Error generating calendarToken for a user!", error)
            $app.logger().error("Error generating calendarToken for a user!", error)
        }
    }

    e.next()

}, "users")