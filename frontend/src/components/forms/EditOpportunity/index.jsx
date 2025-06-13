import { useCallback, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"

export function EditOpportunityForm({ opp, setTrigger }) {

    const [ name, setName ] = useState(opp.name)
    const [ info, setInfo ] = useState(opp.info)
    const [ complete, setComplete ] = useState(opp.complete)

    const { pb, user } = usePocket()


    const submit = useCallback((e) => {

        e.preventDefault()
        
        pb.collection('opportunities').update(opp.id, {
            "info": info,
            "name": name,
            "complete": complete,
            "user": user.id
        })
        .then(res => {
            setTrigger(false)
        })
        .catch(err => {
            console.error("Error creating opportunity", err)
        })

    }, [ name, info, setTrigger ])


    return (
        <form className="form" onSubmit={submit}>

            <div>
                <div>
                    <label>Name</label>
                </div>
                <input value={name} onChange={(e => setName(e.target.value))} type="text" />
            </div>

            <br />

            <div>
                <div>
                    <label>Info</label>
                </div>
                <textarea value={info} onChange={(e => setInfo(e.target.value))} cols="30" rows="10"></textarea>
            </div>

            <br />

            <div>
                <label>
                    <span>Checked</span>
                    <input type="checkbox" checked={complete} onChange={(e) => setComplete(e.target.checked)} />
                </label>
            </div>

            <br />

            <div>
                <button className="m-submit-btn" type="submit">Submit</button>
            </div>

        </form>
    )
}