import { useEffect, useRef, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import { DateInput } from "../../inputs/DateInput"
import { IoCalendarOutline } from "react-icons/io5"
import { useActiveYear } from "../../../contexts/activeYearContext"

export function NewTask({ appID=null, setCounter, setTrigger }) {

    const [ info, setInfo ] = useState()
    const [ deadline, setDeadline ] = useState(null)
    const [ detailsOpen, setDetailsOpen ] = useState(false)
    const { activeYear } = useActiveYear()

    const { pb, user } = usePocket()

    const taskInput = useRef()

    
    function submit(e) {
        e.preventDefault()

        let newTask = {
            "info": info,
            "deadline": deadline,
            "user": user.id,
            "year": activeYear,
            "complete": false
        }

        if(appID) {
            newTask["application"] = appID
        }

        pb.collection("tasks").create(newTask)
        .then(() => {
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
        <form className="form flex col gap-m" onSubmit={(e) => submit(e)}>
            <div>
                <div>
                    <label>Task</label>
                </div>
                <input placeholder="Eg. Request reference from tutor" ref={taskInput} type="text" value={info} onChange={e => setInfo(e.target.value)} required />
            </div>
            <p onClick={() => setDetailsOpen(!detailsOpen)} type="button" className="flex gap-s align-center cursor-pointer">
                {
                    !detailsOpen ? (
                        <>
                            <span className="text-blue">Add deadline</span>
                            <span className="text-blue flex align-center">
                                <IoCalendarOutline />
                            </span>
                        </>
                    ) : (
                        <span onClick={() => setDeadline(null)} className="text-blue">Cancel deadline</span>
                    )
                }
            </p>
            {
                detailsOpen && (
                    <div>
                        <div>
                            <label>Deadline</label>
                        </div>
                        <DateInput date={deadline} setDate={setDeadline} />
                    </div>
                )
            }
            <div>
                <button className="m-submit-btn" type="submit">Create task</button>
            </div>
        </form>
    )
}