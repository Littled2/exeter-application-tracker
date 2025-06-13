/// <reference path="../pb_data/types.d.ts" />


/**
 * Generates a token for each user that will be used to access their deadlines calender via an ical subscription link
*/


onRecordAfterCreateSuccess((e) => {

    try {
        

        const calendarToken = $security.randomString(64);

        let record = $app.findRecordById("users", e.record.id)

        record.set("calendarToken", calendarToken)

        $app.save(record)



    } catch (error) {
        console.log("Error processing firstAppliedApplicationForGroup notification!", error)
        $app.logger().error("Error processing firstAppliedApplicationForGroup notification!", error)
    }

    e.next()

}, "users")