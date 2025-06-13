import styles from "./styles.module.css"
import { useNotifications } from "../../contexts/notificationsContext"
import { Notification } from "./Notification";
import { usePocket } from "../../contexts/pocketContext";
import { useCallback } from "react";

export function Notifications() {

    const { notifications } = useNotifications()

    const { pb } = usePocket()

    const markAsRead = sentNotificationId => {
        pb.collection("sent_notifications").update(sentNotificationId, { read: true })
        .catch(err => {
            console.error("Failed to mark notification as read", err)
        })
    }

    return notifications.length > 0 && (
        <div className={styles.notifications}>
            {
                notifications?.map((notification, i) => {
                    return (
                        <Notification sentNotification={notification} markAsRead={markAsRead} key={"_notification_" + i } />
                    )
                })
            }
        </div>
    )
}