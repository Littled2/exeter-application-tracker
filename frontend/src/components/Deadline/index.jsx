import { getDate } from "../../helpers/dates"
import styles from "./styles.module.css"

export function Deadline({ deadline, highlight=true }) {

    let time_difference = new Date(deadline).getTime() - new Date().getTime()

    const DAYS_TO_DEADLINE = Math.floor(time_difference / (1000 * 60 * 60 * 24));

    if(!highlight) {
        return (
            <span>
                {
                    getDate(deadline)
                }
            </span>
        )
    }

    return (
        // If the deadline has passed
        DAYS_TO_DEADLINE < 0 ? (
            <span className={styles.missed}>
                {
                    getDate(deadline)
                }
            </span>
        ) : (
            // Deadline is today
            DAYS_TO_DEADLINE >= 0 ? (
                <span className={styles.upcoming}>
                    {
                        getDate(deadline)
                    }
                </span>
            ) : (
                // Deadline is in the next three days
                <spa className={styles.upcoming}>
                    {
                        getDate(deadline)
                    }
                </spa>
            )
        )
    )
}