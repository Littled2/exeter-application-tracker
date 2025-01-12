import { useEffect, useRef, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"

export function NewOrganisation({ setTrigger, setSelectedOrgID, sc }) {

    const { pb, user } = usePocket()

    const [ name, setName ] = useState('')

    const submit = e => {
        e.preventDefault()
        pb.collection("organisations").create({
            name: name,
            user: user.id
        })
        .then(res => {
            console.log(res)
            if(setSelectedOrgID) setSelectedOrgID(res.id)
            setTrigger(false)
            sc(c => c + 1)
        })
        .catch(err => {
            console.error("Error creating organisation", err)
        })
    }

    const newInput = useRef()

    useEffect(() => newInput.current.focus(), [])

    return (
        <form className="form">

            <div>
                <label>Organisation</label>
            </div>
            <div>
                <input ref={newInput} value={name} onChange={e => setName(e.target.value)} type="text" />
            </div>

            <br />

            <button className="m-submit-btn" onClick={submit}>Create</button>

        </form>
    )
}