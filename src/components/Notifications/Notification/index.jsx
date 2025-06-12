import { useNotifications } from "../../../contexts/notificationsContext"
import { useRecapPopupContext } from "../../../contexts/recapPopupContext"
import { IoClose } from "react-icons/io5"
import styles from "./styles.module.css"
import { usePocket } from "../../../contexts/pocketContext"

export function Notification({ sentNotification, index, markAsRead }) {

    const { pb } = usePocket()

    const { setNotifications } = useNotifications()
    const { setRecapPopupOpen } = useRecapPopupContext()

    return (
        <div className={[ styles.notification, sentNotification?.expand?.notification?.important ? styles.important : ''  ].join(' ')}>
            <div className={styles.textContent}>
                {sentNotification?.expand?.notification?.textContent}
                {
                    sentNotification?.expand?.notification?.showRecapButton && (
                        <button onClick={() => setRecapPopupOpen(true)} style={{ display: "inline-flex" }}>View your recap</button>
                    )
                }
            </div>
            <div
                onClick={() => {
                    markAsRead(sentNotification?.id)
                    setNotifications(prevItems => {
                        const newItems = [...prevItems];
                        newItems.splice(index, 1);
                        return newItems;
                    })
                }}
                className={styles.close}
            >
                <IoClose />
            </div>
        </div>
    )
}