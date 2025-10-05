/// <reference path="../../pb_data/types.d.ts" />


function getUpcomingDeadlinesForUser(userID) {

    const result = arrayOf(new DynamicModel({
        "id":    "",
        "role": "",
        "info":    "",
        "organisation": "",
        "deadline": "",
    }))
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)

    $app.db()
        .select("applications.id", "role", "info", "deadline", "organisations.name as organisation")
        .from("applications")
        .innerJoin("organisations", $dbx.exp("applications.organisation = organisations.id"))
        .andWhere($dbx.in("stage", "idea", "applying")) // No need to show deadlines for things you have already applied to
        .andWhere($dbx.exp("deadline > {:yesterday}", { yesterday: yesterday.toISOString() }))
        .andWhere($dbx.exp("applications.user = {:user}", { user: userID }))
        .limit(1000)
        .all(result)

    return result
}

function getUserIDFromToken(calendarToken) {

    try {

        const user = new DynamicModel({
            "id":    ""
        })

        $app.db()
            .select("id")
            .from("users")
            .where(
                $dbx.exp("calendarToken = {:calendarToken}", { calendarToken })
            )
            .one(user)

        if(!user) {
            return null
        }

        return user.id

    } catch (error) {
        return null
    }
}

/**
 * Update's the user's record with the current time
 * @param {String} userID 
 */
function updateCalendarLastRequestedTime(userID) {
    try {

        let user = $app.findRecordById("users", userID)
        user.set("calendarLastRequested", new Date())
        $app.save(user)

    } catch (error) {
        console.log("Error updating calendarLastRequestedTime!", error)
        $app.logger().error("Error updating calendarLastRequestedTime!", error)
    }
}

module.exports = { getUpcomingDeadlinesForUser, getUserIDFromToken, updateCalendarLastRequestedTime }