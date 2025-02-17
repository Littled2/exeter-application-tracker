import { useRef, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import { DateInput } from "../../inputs/DateInput"
import { IoCalendarOutline, IoClose } from "react-icons/io5"
import { Popup } from "../../Popup"
import { Confirm } from "../Confirm"

export function TaskView({ task, counter, setCounter, setTrigger }) {

    const [ info, setInfo ] = useState(task.info)
    const [ deadline, setDeadline ] = useState(new Date(task.deadline))
    const [ complete, setComplete ] = useState(task.complete)
    const [ detailsOpen, setDetailsOpen ] = useState(Boolean(task?.deadline))
    const [ deleteOpen, setDeleteOpen ] = useState(false)

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
        <form className="form flex col gap-m" onSubmit={submit}>
            <div>
                <div>
                    <label>Task Description</label>
                </div>
                <textarea type="text" value={info} onChange={e => setInfo(e.target.value)}></textarea>
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
                        <>
                            <span className="text-blue flex align-center">
                                <IoClose />
                            </span>
                            <span onClick={() => setDeadline(null)} className="text-blue">Cancel deadline</span>
                        </>
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
                <div className="flex justify-center">
                    <label className="flex gap-s align-center">
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