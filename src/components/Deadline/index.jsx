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
        // If the deadline is in more than 3 days or if it has passed, don't highlight
        DAYS_TO_DEADLINE > 3 || DAYS_TO_DEADLINE < 0 ? (
            <span>
                {
                    getDate(deadline)
                }
            </span>
        ) : (
            // Deadline is today
            DAYS_TO_DEADLINE === 0 ? (
                <span className={styles.today}>
                    {
                        getDate(deadline)
                    }
                </span>
            ) : (
                // Deadline is in the next three days
                <spa className={styles.upcomingDeadline}>
                    {
                        getDate(deadline)
                    }
                </spa>
            )
        )
    )
}