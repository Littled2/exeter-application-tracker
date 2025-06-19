import { useCallback, useEffect, useState } from "react"
import { TableSection } from "../../TableSection"
import styles from "./styles.module.css"
import { Popup } from "../../Popup"
import { TaskView } from "../../forms/TaskView"
import { usePocket } from "../../../contexts/pocketContext"
import { NewTask } from "../../forms/NewTask"
import { Deadline } from "../../Deadline"


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

    const deleteTask = (taskID) => {
        pb.collection("tasks").delete(taskID)
        .then(() => {
            console.log("Task deleted")
            setCounter(c => c + 1)
            setSelectedTask(null)
            setPopupOpen(false)
        })
        .catch(err => {
            console.error("Error deleting task", err)
        })
    }
    

    return (
        <>

            <div className="flex col gap-s">
                                            
                <table style={{ tableLayout: "fixed" }}>
                    <thead>
                        <tr>
                            <th width="30px"></th>
                            <th>Task</th>
                            <th width="25%">Due</th>
                        </tr>
                    </thead>
                    <tbody>

                        <TableSection name={"TODO"} amount={todoTasks.length}>
                            {
                                todoTasks.filter(t => t.complete === false).map(task => {
                                    return (
                                        <tr
                                            className="cursor-pointer"
                                            key={task.id}
                                            onClick={() => {
                                                setSelectedTask(task)
                                                setPopupOpen(true)
                                            }}
                                        >
                                            <td>
                                                <input type="checkbox" defaultChecked={task?.complete} />
                                            </td>
                                            <td>{task?.info}</td>
                                            <td><Deadline deadline={task?.deadline} /></td>
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
                                            }} key={task.id}
                                        >
                                            <td>
                                                <input type="checkbox" defaultChecked={task?.complete} />
                                            </td>
                                            <td>{task?.info}</td>
                                            <td className={styles.deadline}><Deadline highlight={false} deadline={task?.deadline} /></td>
                                        </tr>
                                    )
                                })
                            }
                        </TableSection>

                    </tbody>
                </table>


                <Popup title="Task View" trigger={popupOpen} setTrigger={setPopupOpen} onDelete={() => deleteTask(selectedTask?.id)}>
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
                        + Add Task
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