/// <reference path="../pb_data/types.d.ts" />

// Every 24 hours, delete all read notifications
cronAdd("reTryUnsentTickets", "0 0 * * 1", () => {

    try {
    
        const unsentTickets = arrayOf(new DynamicModel({
            "id": "",
            "info": ""
        }))

        $app.db()
        .select("id", "info")
        .from("tickets")
        .where(
            $dbx.exp("forwarded = false")
        )
        .all(unsentTickets)


        unsentTickets.forEach(doc => {

            // Attempt to re-send the ticket
            try {

                const formData = new FormData();

                formData.append("title", doc.info)
                formData.append("application_id", "674e4b64031d1")
                formData.append("ticket_id", doc.id)
                formData.append("info", doc.info)

                const res = $http.send({
                    url: "https://apps.edward-blewitt.uk/backend/api/issue-tracker/issues/POST-new-issue.php",
                    method: "POST",
                    body: formData,
                })

                // If the request fails, mark as not forwarded

                if (res.statusCode == 200) {
                    let record = $app.findRecordById("tickets", doc.id)
                    record.set("forwarded", true)
                    $app.save(record)
                }

            } catch (error) {
                console.log("Failed to re-send ticket to Rapid Apps", error)
                $app.logger().error("Failed to re-send ticket to Rapid Apps", error)
            }

        })

    } catch (error) {
        console.error("Error removing read notifications", error)
        $app.logger().error("Error removing read notifications", error)
    }


})