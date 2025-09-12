import { useEffect, useState } from "react"
import styles from "./styles.module.css"
import { usePocket } from "../../contexts/pocketContext"
import { NewTask } from "../../components/forms/NewTask"
import { TaskView } from "../../components/forms/TaskView"
import { Popup } from "../../components/Popup"
import { TodoTasks } from "../../components/TasksList/TodoTasks"
import { IoAddCircleOutline } from "react-icons/io5"
import { useActiveYear } from "../../contexts/activeYearContext"
import { InputInformation } from "../../components/InputInformation"
import { Confirm } from "../../components/forms/Confirm"

export function TasksWrapper({ setOpenAppID }) {

    const [ newTaskOpen, setNewTaskOpen ] = useState(false)
    const [ openTask, setOpenTask ] = useState(null)
    const [ counter, setCounter ] = useState(0)
    const [ tasks, setTasks ] = useState([])
    const [ deleteOpen, setDeleteOpen ] = useState(false)
    const { pb } = usePocket()
    const { activeYear } = useActiveYear()

    useEffect(() => {
        pb.collection("tasks").getFullList({ sort: "deadline", filter: `year = '${activeYear}'` })
        .then(tasks => {
            setTasks(tasks)
        })
        .catch(err => {
            console.error("Error getting complete tasks", err)
        })
    }, [ counter, activeYear ])

    const deleteTask = (taskID) => {
        pb.collection("tasks").delete(taskID)
        .then(() => {
            setOpenTask(false)
            setCounter(c => c + 1)
        })
        .catch(err => {
            console.error("Error deleting task", err)
        })
    }

    
    return (
        <div id={"tutorial-step-2"} className={styles.tasksWrapper}>
            {/* <b>-</b> */}
            {/* <h3 className="m-show-block">Tasks</h3> */}
            {/* <p className="m-show-block text-grey">Open an application to add a task</p> */}
            <h3 className="text-grey m-hide line-height-1 flex gap-s align-center">
                <InputInformation id={"yourTasks"} text={"Add tasks that you need to complete for your applications"} place="left" />
                <span>Tasks</span>
                <button onClick={() => setNewTaskOpen(true)} style={{ padding: "0" }} className={[ "text-orange simple-btn", styles.newTaskBtn ].join(" ")}>+</button>
            </h3>

            <TodoTasks setNewTaskOpen={setNewTaskOpen} tasks={tasks} counter={counter} setCounter={setCounter} setOpenTask={setOpenTask} setOpenAppID={setOpenAppID} />

            <Popup title={"Create Task"} trigger={newTaskOpen} setTrigger={setNewTaskOpen}>
                <NewTask counter={counter} setCounter={setCounter} setTrigger={setNewTaskOpen} />
            </Popup>

            <Popup title="Task" trigger={openTask} setTrigger={setOpenTask} onDelete={() => setDeleteOpen(true)}>
                <TaskView task={openTask} setTrigger={setOpenTask} counter={counter} setCounter={setCounter} />
            </Popup>

            <Confirm trigger={deleteOpen} setTrigger={setDeleteOpen} message={"Are you sure you want to delete this task?"} onConfirm={() => deleteTask(openTask?.id)}></Confirm>

            <button onClick={() => setNewTaskOpen(true)} className={styles.newTaskButtonMobile}>
                <IoAddCircleOutline />
            </button>
        </div>
    )
}