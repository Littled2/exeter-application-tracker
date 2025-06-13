import { useCallback, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"

export function NewOpportunityForm({ setTrigger }) {

    const [ name, setName ] = useState('')
    const [ info, setInfo ] = useState('')

    const { pb, user } = usePocket()


    const submit = useCallback((e) => {

        e.preventDefault()
        
        pb.collection('opportunities').create({
            "info": info,
            "name": name,
            "complete": false,
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
                <button type="submit">Submit</button>
            </div>

        </form>
    )
}