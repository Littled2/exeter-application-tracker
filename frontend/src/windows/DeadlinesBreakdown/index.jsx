import { AppsDeadlinesChart } from "./AppsDeadlinesChart"
import { TasksDeadlinesChart } from "./TasksDeadlinesChart"
import styles from "./styles.module.css"

export function DeadlinesBreakdown() {
    return (
        <div className={styles.wrapper}>

            <AppsDeadlinesChart />

            <TasksDeadlinesChart />

        </div>
    )
}