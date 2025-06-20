/// <reference path="../pb_data/types.d.ts" />


/**
 * FIRST APPLICATION NOTIFICATION
 * - Condition: When the user has submitted their first ever application for a particular group/year
*/


onRecordAfterCreateSuccess((e) => {

    // Is this the only application for this group?

    try {

        const { send_notification } = require(`${__hooks}/helpers/notifications.js`)
        
        const ACTIVE_YEAR = e.record.get("year")

        const applicationsThisYear = arrayOf(new DynamicModel({
            "created": ""
        }))

        // Get all applications from this year
        $app.db()
        .select("created")
        .from("applications")
        .where(
            $dbx.exp("year = {:year}", { year: ACTIVE_YEAR })
        )
        .andWhere(
            $dbx.exp("user = {:userId}", { userId: e.record.get("user") })
        )
        .all(applicationsThisYear)

        console.log("Application thi syear length:", applicationsThisYear.length)

        // If there is only 1 application for this year...
        if(applicationsThisYear && applicationsThisYear.length === 1) {

            send_notification(e.record.get("user"), "firstApplicationForGroup")

        }


    } catch (error) {
        console.log("Error processing firstAppliedApplicationForGroup notification!", error)
        $app.logger().error("Error processing firstAppliedApplicationForGroup notification!", error)
    }

    e.next()

}, "applications")