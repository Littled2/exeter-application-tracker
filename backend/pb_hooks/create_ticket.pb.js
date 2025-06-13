/// <reference path="../pb_data/types.d.ts" />




onRecordCreate((e) => {

    const { load_env_vars } = require(`${__hooks}/helpers/env.js`)

    // Load environment variables into process.env
    load_env_vars()

    try {

        // Forward the ticket to rapid apps
        const formData = new FormData();

        formData.append("title", e.record.get("info"))
        formData.append("application_id", process.env.RAPID_APPS_APPLICATION_TRACKER_ID)
        formData.append("ticket_id", e.record.get("id"))
        formData.append("info", e.record.get("info"))

        const res = $http.send({
            url: process.env.RAPID_APPS_CREATE_TICKET_URL,
            method: "POST",
            body: formData,
        })

        // If the request fails, mark as not forwarded

        if (res.statusCode == 200) {
            e.record.set("forwarded", true)
        } else {
            e.record.set("forwarded", false)
        }

    } catch (error) {
        console.log("Failed to forward ticket to Rapid Apps", error)
        $app.logger().error("Failed to forward ticket to Rapid Apps", error)

        e.record.set("forwarded", false)
    }

    e.next()

}, "tickets")