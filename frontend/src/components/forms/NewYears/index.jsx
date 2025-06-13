import { useCallback, useEffect, useRef, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import { useActiveYear } from "../../../contexts/activeYearContext"
import { AnimatedButton } from "../../AnimatedButton"
import { useMobile } from "../../../contexts/mobileContext"

export function NewYears({ setTrigger, setActiveYear }) {

    const { pb, user } = usePocket()

    const [ year, setYear ] = useState()
    const [ processing, setProcessing ] = useState(false)
    const { isMobile } = useMobile()

    const inputRef = useRef()

    const submit = useCallback((e) => {
        e.preventDefault()

        setProcessing(true)
        
        pb.collection('years').create({
            "user": user.id,
            "year": year,
            "order": 1
        })
        .then(year => {

            if(setTrigger) {
                setTrigger(false)
            }

            setActiveYear(year.id)

            setProcessing(false)

        })
        .catch(err => {
            console.error("Error creating new year", err)
            setProcessing(false)
        })

    }, [ year, user, setActiveYear, setTrigger ])

    useEffect(() => {
        if(!isMobile) {
            inputRef.current.focus()   
        }
    }, [])

    return (
        <form onSubmit={submit} className="form flex col gap-s">

            <div>
                <label>Group name</label>
                <div>
                    <input ref={inputRef} style={{ width: "100%" }} value={year} onChange={e => setYear(e.target.value)} type="text" placeholder="eg. Uni Second Year" required />
                </div>
            </div>

            <div>
                <AnimatedButton submitting={processing} type="submit" className="m-submit-btn">
                    Create
                </AnimatedButton>
            </div>

        </form>
    )
}