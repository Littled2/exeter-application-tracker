import { getDate } from "../../helpers/dates"
import styles from "./styles.module.css"

export function Deadline({ deadline, highlight=true }) {

    const time_difference = new Date().getTime() - new Date(deadline).getTime()

    return highlight ? (
        time_difference > 0 ? (
            <span className={[ styles.deadline, styles.late ].join(' ')}>
                {
                    getDate(deadline)
                }
            </span>
        ) : (
            (time_difference / (-1 * 24 * 60 * 60 * 1000)) < 1 ? (
                // Same Day
                <span className={[ styles.deadline, styles.almostLate ].join(' ')}>
                    {
                        getDate(deadline)
                    }
                </span>
            ) : (
                <span className={styles.deadline}>
                    {
                        getDate(deadline)
                    }
                </span>
            )
        )
    ) : (
        <span className={styles.deadline}>
            {
                getDate(deadline)
            }
        </span>
    )
}