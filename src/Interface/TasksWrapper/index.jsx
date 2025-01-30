import { useEffect, useState } from "react"
import styles from "./styles.module.css"
import { usePocket } from "../../contexts/pocketContext"
import { NewTask } from "../../components/forms/NewTask"
import { TaskView } from "../../components/forms/TaskView"
import { Popup } from "../../components/Popup"
import { TodoTasks } from "../../components/TasksList/TodoTasks"
import { IoCheckbox, IoCheckboxOutline } from "react-icons/io5"
import { useActiveYear } from "../../contexts/activeYearContext"

export function TasksWrapper({ setOpenAppID }) {

    const [ newTaskOpen, setNewTaskOpen ] = useState(false)
    const [ openTask, setOpenTask ] = useState(null)
    const [ counter, setCounter ] = useState(0)
    const [ tasks, setTasks ] = useState([])
    const { pb } = usePocket()
    const { activeYear } = useActiveYear()

    useEffect(() => {
        pb.collection("tasks").getFullList({ sort: "deadline", filter: `year = '${activeYear}'` })
        .then(tasks => {
            console.log(tasks)
            setTasks(tasks)
        })
        .catch(err => {
            console.error("Error getting complete tasks", err)
        })
    }, [ counter, activeYear ])

    const deleteTask = (taskID) => {
        pb.collection("tasks").delete(taskID)
        .then(() => {
            console.log("Task deleted")
            setOpenTask(false)
            setCounter(c => c + 1)
        })
        .catch(err => {
            console.error("Error deleting task", err)
        })
    }

    
    return (
        <div className={styles.tasksWrapper}>
            {/* <b>-</b> */}
            {/* <h3 className="m-show-block">Tasks</h3> */}
            {/* <p className="m-show-block text-grey">Open an application to add a task</p> */}
            <h3 className="text-grey m-hide line-height-1 flex gap-s align-center">
                <span>Tasks</span>
                <button onClick={() => setNewTaskOpen(true)} style={{ padding: "0" }} className={[ "text-orange simple-btn", styles.newTaskBtn ].join(" ")}>+</button>
            </h3>

            <TodoTasks setNewTaskOpen={setNewTaskOpen} tasks={tasks} counter={counter} setCounter={setCounter} setOpenTask={setOpenTask} setOpenAppID={setOpenAppID} />

            <Popup title={"Create Task"} trigger={newTaskOpen} setTrigger={setNewTaskOpen}>
                <NewTask counter={counter} setCounter={setCounter} setTrigger={setNewTaskOpen} />
            </Popup>

            <Popup title="Task" trigger={openTask} setTrigger={setOpenTask} onDelete={() => deleteTask(openTask?.id)}>
                <TaskView task={openTask} setTrigger={setOpenTask} counter={counter} setCounter={setCounter} />
            </Popup>


            <button onClick={() => setNewTaskOpen(true)} className={styles.newTaskButtonMobile}>
                <IoCheckboxOutline />
            </button>
        </div>
    )
}