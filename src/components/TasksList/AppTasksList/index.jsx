import { useCallback, useEffect, useState } from "react"
import { TableSection } from "../../TableSection"
import { TableRows } from "../../ApplicationsList/TableRows"
import styles from "./styles.module.css"
import { Popup } from "../../Popup"
import { TaskView } from "../../forms/TaskView"
import { usePocket } from "../../../contexts/pocketContext"
import { getDate } from "../../../helpers/dates"
import { NewTask } from "../../forms/NewTask"


export function AppTasksList({ application, counter, setCounter }) {

    const [ popupOpen, setPopupOpen ] = useState(false)
    const [ selectedTask, setSelectedTask ] = useState(null)
    const [ newTaskOpen, setNewTaskOpen ] = useState()

    const [ todoTasks, setTodoTasks ] = useState([])
    const [ completeTasks, setCompleteTasks ] = useState([])

    const { pb } = usePocket()

    useEffect(() => {

        pb.collection("tasks").getFullList({ sort: "deadline", filter: `complete = false && application = "${application.id}"` })
        .then(tasks => {
            setTodoTasks(tasks)
        })
        .catch(err => console.error("Error getting TODO tasks", err))

        pb.collection("tasks").getFullList({ sort: "deadline", filter: `complete = true && application = "${application.id}"` })
        .then(tasks => {
            setCompleteTasks(tasks)
        })
        .catch(err => console.error("Error getting complete tasks", err))

    }, [ application.id, counter ])

    
    const handleKeyPress = useCallback(e => {
        if(e.ctrlKey && e.key === "q") {
            e.preventDefault()
            e.stopPropagation()
            setNewTaskOpen(true)
        }
    }, [ setNewTaskOpen ])

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress)

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress])
    

    return (
        <>

            <div className="flex col gap-s">
                                            
                <table>
                    <thead>
                        <tr>
                            <th style={{ maxWidth: "15px" }}></th>
                            <th width="70%">Task</th>
                            <th width="25%">Deadline</th>
                        </tr>
                    </thead>
                    <tbody>

                        <TableSection name={"TODO"} amount={todoTasks.length}>
                            {
                                todoTasks.filter(t => t.complete === false).map(task => {
                                    return (
                                        <tr
                                        className="cursor-pointer"
                                        key={task.taskID}
                                        onClick={() => {
                                            setSelectedTask(task)
                                            setPopupOpen(true)
                                        }}
                                        >
                                            <td>
                                                <input type="checkbox" checked={task?.complete} />
                                            </td>
                                            <td>{task?.info}</td>
                                            <td>{getDate(task?.deadline)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </TableSection>

                        <TableSection name={"Complete"} defaultOpen={false} amount={completeTasks.length}>
                            {
                                completeTasks.filter(t => t.complete === true).map(task => {
                                    return (
                                        <tr
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setSelectedTask(task)
                                            setPopupOpen(true)
                                        }} key={task.taskID}>
                                            <td>
                                                <input type="checkbox" checked={task?.complete} />
                                            </td>
                                            <td>{task?.info}</td>
                                            <td>{getDate(task?.deadline)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </TableSection>

                    </tbody>
                </table>


                <Popup title="Task View" trigger={popupOpen} setTrigger={setPopupOpen} onDelete={() => pb.collection("tasks").delete(selectedTask?.id)}>
                    {
                        selectedTask !== null ? (
                            <TaskView task={selectedTask} setTrigger={setPopupOpen} counter={counter} setCounter={setCounter} />
                        ) : (
                            <></>
                        )
                    }
                </Popup>

                <div className="flex justify-center">
                    <button className={styles.newTask} onClick={() => setNewTaskOpen(true)}>
                        Add Task
                        <span className={styles.keyIndicators}>
                            <span>ctrl</span>
                            +
                            <span>q</span>    
                        </span>
                    </button>

                    <Popup title={"Create Task"} trigger={newTaskOpen} setTrigger={setNewTaskOpen}>
                        <NewTask appID={application.id} counter={counter} setCounter={setCounter} setTrigger={setNewTaskOpen} />
                    </Popup>
                </div>
            </div>
        </>
    )
}