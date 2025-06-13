import { useCallback, useEffect, useRef, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import { useMobile } from "../../../contexts/mobileContext"
import { AnimatedButton } from "../../AnimatedButton"

export function NewTicket({ setTrigger }) {

    const ticketRef = useRef()

    const { pb, user } = usePocket()
    const [ err, setErr ] = useState(false)
    const [ success, setSuccess ] = useState(false)
    const { isMobile } = useMobile()
    const [ submitting, setSubmitting ] = useState(false)

    const submit = useCallback(e => {
        e.preventDefault()

        setErr(false)
        setSubmitting(true)

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
        .finally(() => {
            setSubmitting(false)
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
                <AnimatedButton submitting={submitting} className="m-submit-btn" type="submit">Submit</AnimatedButton>
            </div>
        </form>
    ) : (
        <p>Ticket received. Thank you!</p>
    )
}