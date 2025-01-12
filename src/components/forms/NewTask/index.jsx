import { useEffect, useRef, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import { DateInput } from "../../inputs/DateInput"

export function NewTask({ appID, setCounter, setTrigger }) {

    const [ info, setInfo ] = useState()
    const [ deadline, setDeadline ] = useState(new Date())

    const { pb, user } = usePocket()

    const taskInput = useRef()

    
    function submit(e) {
        e.preventDefault()

        pb.collection("tasks").create({
            "info": info,
            "deadline": deadline,
            "user": user.id,
            "complete": false,
            "application": appID
        })
        .then(res => {
            setCounter(c => c + 1)
            setTrigger(false)
        })
        .catch(err => {
            console.error("Error creating task", err)
        })

    }

    useEffect(() => {
        taskInput.current.focus()
    }, [])

    return (
        <form className="form flex col gap-s" onSubmit={(e) => submit(e)}>
            <div>
                <div>
                    <label>Task</label>
                </div>
                <input placeholder="Eg. Request reference from tutor" ref={taskInput} type="text" value={info} onChange={e => setInfo(e.target.value)} required />
            </div>
            <div>
                <div>
                    <label>Deadline</label>
                </div>
                <DateInput date={deadline} setDate={setDeadline} />
            </div>
            <div>
                <button className="m-submit-btn" type="submit">Create task</button>
            </div>
        </form>
    )
}