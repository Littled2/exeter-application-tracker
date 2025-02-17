import { useCallback, useEffect, useRef, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import { useMobile } from "../../../contexts/mobileContext"

export function NewTicket({ setTrigger }) {

    const ticketRef = useRef()

    const { pb, user } = usePocket()
    const [ err, setErr ] = useState(false)
    const [ success, setSuccess ] = useState(false)
    const { isMobile } = useMobile()

    const submit = useCallback(e => {
        e.preventDefault()

        setErr(false)

        pb.collection('tickets').create({
            "user": user.id,
            "info": ticketRef.current.value
        })
        .then(() => {
            setSuccess(true)
        })
        .catch(err => {
            console.error("Error creating ticket", err)
            setErr(true)
        })
    }, [ pb, user, err, success ])

    useEffect(() => {
        if(!isMobile) {
            ticketRef.current.focus()
        }
    }, [])

    return !success ? (
        <form className="form flex col gap-s" onSubmit={submit}>

            <p className="text-white">Found a bug, or want a feature? Create an engineering ticket.</p>

            <div>
                <div>
                    <label>Engineering Ticket</label>
                </div>
                <textarea minLength={10} maxLength={300} ref={ticketRef} placeholder="Eg. Please fix this" required></textarea>
            </div>
            {
                err ? (
                    <p>Something went wrong!</p>
                ) : (
                    <></>
                )
            }
            <div>
                <button className="m-submit-btn" type="submit">Submit</button>
            </div>
        </form>
    ) : (
        <p>Ticket received. Thank you!</p>
    )
}