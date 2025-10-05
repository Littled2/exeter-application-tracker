/// <reference path="../pb_data/types.d.ts" />


routerAdd("GET", "/cal/{calendarToken}", (e) => {

    const { generateICSForApplications } = require(`${__hooks}/helpers/ics_helpers.js`)

    const { getUpcomingDeadlinesForUser, getUserIDFromToken, updateCalendarLastRequestedTime } = require(`${__hooks}/helpers/calendar.js`)

    try {
     
        let calendarToken = e.request.pathValue("calendarToken")

        let userID = getUserIDFromToken(calendarToken)
        
        if(!userID) {
            // Token is invalid as does not exist on a user's record
            return e.string(403, "Forbidden")
        }

        let applications = getUpcomingDeadlinesForUser(userID)

        updateCalendarLastRequestedTime(userID)

        return e.string(200, generateICSForApplications(applications))

    } catch (error) {
        
        console.error("Error processing", error)
        $app.logger().error("Error processing calendar request", error?.message)
        return e.string(500, "Error processing: ", error?.message)

    }

})