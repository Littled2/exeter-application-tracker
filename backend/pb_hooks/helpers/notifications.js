/// <reference path="../../pb_data/types.d.ts" />


/**
 * Gets the template for a notification from the database
 * @param {String} notificationTitle 
 */
function fetch_notification_template(notificationTitle) {
    
    // Fetch the correct notification to send from the title
    const notification = new DynamicModel({
        "id": "",
        "textContent": "",
        "important": "",
        "showRecapButton": "",
        "cooldownSeconds": ""
    })

    $app.db("id", "textContent", "important", "showRecapButton", "cooldownSeconds")
    .select()
    .from("notification_templates")
    .where(
        $dbx.exp("title = {:title}", { title: notificationTitle })
    )
    .one(notification)

    return notification
}


/**
 * Create a notification from a template
 * @param {Notification} notification 
 * @param {String} userId 
 */
function build_notification_record_from_template(notificationTemplate, userId) {
    
    let collection = $app.findCollectionByNameOrId("sent_notifications")

    let newNotification = new Record(collection)

    newNotification.set("timeSent", new Date().toISOString().replace("T", " "))
    newNotification.set("notification", notificationTemplate.id)
    newNotification.set("read", false)
    newNotification.set("user", userId)

    return newNotification

}

function is_within_cool_down_period(notificationTemplate, userId) {

    // Calculate the cutoff = now - cooldownSeconds
    const cutoff = new Date(Date.now() - notificationTemplate.cooldownSeconds * 1000).toISOString().replace("T", " ");

    const previouslySentSameNotifications = arrayOf(new DynamicModel({
        "created": "",
    }))

    $app.db("created")
    .select()
    .from("sent_notifications")
    .where(
        $dbx.exp("timeSent >= {:cutoff}", { cutoff })
    )
    .andWhere(
        $dbx.exp("user = {:user}", { user: userId })
    ).all(previouslySentSameNotifications)

    if(previouslySentSameNotifications.length > 0) {
        // Then notification has already been sent
        return true
    }

    return false
    
}


/**
 * Send a notification to the user by adding a row to the sent_notifications collection
 * Note: Notification ONLY sends if the same notification wasn't sent previously to the same user within the cool-down period
 * 
 * @param {String} userId The user to send the notification to
 * @param {String} notificationTitle The identifier of the notification you wish to send
 */
function send_notification(userId, notificationTitle) {

    // Fetch the correct notification to send from the title
    const notificationTemplate = fetch_notification_template(notificationTitle)

    // Check if the notification was sent before within the cool-down period
    if(is_within_cool_down_period(notificationTemplate, userId)) {
        return
    }

    // If clear to send, add record to the sent_notifications collection
    const newNotification = build_notification_record_from_template(notificationTemplate, userId)

    $app.save(newNotification);
}

module.exports = { send_notification }