import { useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import { AnimatedButton } from "../../AnimatedButton"

export function EditAppInfo({ appID, app, setTrigger }) {

    const [ info, setInfo ] = useState(app?.info)
    const [ submitting, setSubmitting ] = useState(false)
    const [ error, setError ] = useState(null)

    const { pb } = usePocket()

    const saveInfo = (e) => {
        e.preventDefault()

        setSubmitting(true)

        pb.collection("applications")
        .update(app?.id, { info })
        .then(() => {
            setTrigger(false)
            setSubmitting(false)
        })
        .catch(err => {
            console.error("Error saving info field")
            setError(err)
            setSubmitting(false)
        })
    }

    return (
        <form className="form flex flex-col gap-m" onSubmit={saveInfo}>

            <div className="flex flex-col gap-s">
                <label>Notes</label>
                <textarea rows={15} value={info} onInput={e => setInfo(e.target.value)}></textarea>
            </div>

            {
                error && (
                    <p className="text-red">Something went wrong</p>
                )
            }

            <AnimatedButton submitting={submitting} className="m-submit-btn popup-btm" type="submit">Save</AnimatedButton>

        </form>
    )
}