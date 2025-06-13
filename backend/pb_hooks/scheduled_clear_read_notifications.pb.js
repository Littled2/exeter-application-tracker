/// <reference path="../pb_data/types.d.ts" />

// Every 24 hours, delete all read notifications
cronAdd("deleteReadNotifications", "0 0 * * 1", () => {

        try {
    
        const readNotifications = arrayOf(new DynamicModel({
            "id": ""
        }))

        $app.db()
        .select("id")
        .from("sent_notifications")
        .where(
            $dbx.exp("read = true")
        )
        .all(readNotifications)


        // Clear read notifications
        readNotifications.forEach(doc => {

            let record = $app.findRecordById("sent_notifications", doc.id)
            $app.delete(record)

        })

    } catch (error) {
        console.error("Error removing read notifications", error)
        $app.logger().error("Error removing read notifications", error)
    }


})