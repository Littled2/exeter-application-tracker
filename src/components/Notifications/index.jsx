import styles from "./styles.module.css"
import { useNotifications } from "../../contexts/notificationsContext"
import { IoClose } from "react-icons/io5"
import { useRecapPopupContext } from "../../contexts/recapPopupContext"
import { useEffect } from "react";

export function Notifications() {

    const { notifications, setNotifications } = useNotifications()
    const { setRecapPopupOpen } = useRecapPopupContext()

    return notifications.length > 0 && (
        <div className={styles.notifications}>
            {
                notifications?.map((notification, i) => {
                    return (
                        <div key={'notification_' + i} className={[ styles.notification, notification?.important ? styles.important : ''  ].join(' ')}>
                            <div className={styles.textContent}>
                                {notification.textContent}
                                {
                                    notification?.showRecapButton && (
                                        <button onClick={() => setRecapPopupOpen(true)} style={{ display: "inline-flex" }}>View your recap</button>
                                    )
                                }
                            </div>
                            <div
                                onClick={() => {
                                    setNotifications(prevItems => {
                                        const newItems = [...prevItems];
                                        newItems.splice(i, 1);
                                        return newItems;
                                    })
                                }}
                                className={styles.close}
                            >
                                <IoClose />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}