import { useRef, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import { DateInput } from "../../inputs/DateInput"

export function TaskView({ task, counter, setCounter, setTrigger }) {

    const taskRef = useRef()
    const deadlineRef = useRef()
    const completeRef = useRef()

    const [ info, setInfo ] = useState(task.info)
    const [ deadline, setDeadline ] = useState(new Date(task.deadline))
    const [ complete, setComplete ] = useState(task.complete)

    const { pb } = usePocket()

    function submit(e) {
        e.preventDefault()

        pb.collection("tasks").update(task.id, {
            "info": info,
            "deadline": deadline,
            "complete": complete,
            "application": task.application
        })
        .then(res => {
            console.log(res)
            setTrigger(false)
            setCounter(c => c + 1)
        })
        .catch(err => {
            console.error("Error updating task", err)
        })

    }

    return (
        <form className="form flex col gap-s" onSubmit={submit}>
            <div>
                <div>
                    <label>Task</label>
                </div>
                <input type="text" value={info} onChange={e => setInfo(e.target.value)} />
            </div>
            <div>
                <div>
                    <label>Deadline</label>
                </div>
                <DateInput date={deadline} setDate={setDeadline} />
            </div>
            <div>
                <div>
                    <label className="flex align-center">
                        <input checked={complete} onChange={e => setComplete(e.target.checked)} type="checkbox"/>
                        <span>Complete</span>
                    </label>
                </div>
            </div>
            <div>
                <button className="m-submit-btn" type="submit">Save</button>
            </div>
        </form>
    )
}