import { useEffect, useState } from "react"
import { TableSection } from "../../TableSection"
import { usePocket } from "../../../contexts/pocketContext"
import { daysToDate } from "../../../helpers/dates"
import { useActiveYear } from "../../../contexts/activeYearContext"
import { Deadline } from "../../Deadline"
import { Tabs } from "../../Tabs"
import styles from "./styles.module.css"
import { useMasterCounter } from "../../../contexts/masterCounterContext"
import { Tooltip } from "react-tooltip"
import illustration from "./no-tasks.svg"

export function TodoTasks({ setOpenAppID, tasks, setOpenTask, counter, setCounter, setNewTaskOpen }) {

    const [ todoTasks, setTodoTasks ] = useState([])
    const [ completeTasks, setCompleteTasks ] = useState([])

    const { activeYear } = useActiveYear()
    const { masterCounter } = useMasterCounter()

    const { pb } = usePocket()

    useEffect(() => {

        setTodoTasks(tasks.filter(task => task.complete === false))
        setCompleteTasks(tasks.filter(task => task.complete === true))

    }, [ activeYear, masterCounter, counter, tasks ])

    const setTaskComplete = (taskID, bool) => {
        console.log({ taskID, bool })
        pb.collection("tasks").update(taskID, {
            complete: bool
        })
        .then(() => {
            setCounter(c => c + 1)
        })
        .catch(err => {
            console.error("Error updating task", err)
        })
    }

    return (
        <Tabs
            saveActiveTabAs={"tasks_tab"}
            tabs={[
                {
                    name: todoTasks.length > 0 ? `Incomplete (${todoTasks.length})` : "Incomplete",
                    tab: (
                        <>
                            <table style={{ tableLayout: "fixed" }} className={styles.table}>
                                <thead className="m-hide">
                                    <th width={"30px"}></th>
                                    <th>Task</th>
                                    <th className="m-page-padding-right" width="35%">
                                        <span className="m-hide">Due</span>
                                    </th>
                                </thead>
                                <tbody>
                                    <TableSection name={"Incomplete"} amount={todoTasks.length}>
                                        {
                                            todoTasks.map(task => {
                                                return (
                                                    <tr
                                                        className="cursor-pointer m-flex"
                                                        key={'_' + task.id}
                                                    >
                                                        <td className="flex m-page-padding-left">
                                                            <input
                                                                defaultChecked={task?.complete}
                                                                className={styles.checkbox}
                                                                type="checkbox"
                                                                onInput={e => {
                                                                    setTaskComplete(task?.id, e.target.checked)
                                                                    // e.target.classList.add(styles.justChecked)
                                                                }}
                                                                data-tooltip-id={"task-complete-tooltip_" + task?.id}
                                                                data-tooltip-content="Mark as complete"
                                                                data-tooltip-place="left"
                                                            />

                                                            <Tooltip id={"task-complete-tooltip_" + task?.id} />
                                                        </td>
                                                        <td style={{ verticalAlign: "top" }} className={styles.taskInfo} onClick={() => setOpenTask(task)}>{task?.info}</td>
                                                        <td style={{ verticalAlign: "top" }} onClick={() => setOpenTask(task)} className={styles.deadline}>
                                                            {
                                                                task?.deadline && (
                                                                    <>
                                                                        <p>
                                                                            <Deadline deadline={task?.deadline} />
                                                                        </p>
                                                                        <small className={styles.timeAgo}>
                                                                            {daysToDate(task?.deadline)}
                                                                        </small>       
                                                                    </>
                                                                )
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </TableSection>
                                </tbody>
                            </table>

                            {
                                todoTasks.length === 0 && (
                                    <div className={styles.statusInfo}>
                                        <img className={styles.illustration} src={illustration} alt="" />
                                        <small className="text-grey text-center">Track tasks you need to do for your applications</small>
                                        <small className="text-grey">No incomplete tasks</small>
                                        <p onClick={() => setNewTaskOpen(true)} className="text-center cursor-pointer text-blue">+ Add Task</p>
                                    </div>
                                )
                            }
                        </>
                    )
                },
                {
                    name: completeTasks.length > 0 ? `Complete (${completeTasks.length})` : "Complete",
                    tab: (
                        <>
                            <table style={{ tableLayout: "fixed" }} className={styles.table}>
                                <thead className="m-hide">
                                    <th width={"30px"}></th>
                                    <th>Task</th>
                                    <th className="m-page-padding-right" width="35%">
                                        <span className="m-hide">Due</span>
                                    </th>
                                </thead>
                                <tbody>
                                    <TableSection name={"Complete"} amount={completeTasks.length}>
                                        {
                                            completeTasks.map(task => {
                                                return (
                                                    <tr
                                                        className="cursor-pointer m-flex"
                                                        key={'__' + task.id}
                                                    >
                                                        <td className="flex m-page-padding-left">
                                                            <input
                                                                defaultChecked={task?.complete}
                                                                className={styles.checkbox}
                                                                type="checkbox"
                                                                onInput={e => setTaskComplete(task?.id, e.target.checked)}
                                                                data-tooltip-id={"task-incomplete-tooltip_" + task?.id}
                                                                data-tooltip-content="Mark as incomplete"
                                                                data-tooltip-place="left"
                                                            />

                                                            <Tooltip id={"task-incomplete-tooltip_" + task?.id} />
                                                        </td>
                                                        <td style={{ verticalAlign: "top" }} className={styles.taskInfo} onClick={() => setOpenTask(task)}>{task?.info}</td>
                                                        <td style={{ verticalAlign: "top" }} onClick={() => setOpenTask(task)} className={styles.deadline}>
                                                            {
                                                                task?.deadline && (
                                                                    <>
                                                                        <Deadline highlight={false} deadline={task?.deadline} />
                                                                        <small className={styles.timeAgo}>
                                                                            {daysToDate(task?.deadline)}
                                                                        </small>       
                                                                    </>
                                                                )
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </TableSection>
                                </tbody>
                            </table>

                            {
                                completeTasks.length === 0 && (
                                    <div className={styles.statusInfo}>
                                        <img className={styles.illustration} src={illustration} alt="" />
                                        <small className="text-grey">No complete tasks</small>
                                        <p onClick={() => setNewTaskOpen(true)} className="text-center cursor-pointer text-blue">+ Add Task</p>
                                    </div>
                                )
                            }
                        </>
                    )
                }
            ]}
        />

    )
}