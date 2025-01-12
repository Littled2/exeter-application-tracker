import { useCallback, useEffect, useRef, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import { useActiveYear } from "../../../contexts/activeYearContext"

export function NewYears({ setTrigger }) {

    const { pb, user } = usePocket()

    const [ year, setYear ] = useState()

    const { setActiveYear } = useActiveYear()

    const inputRef = useRef()

    const submit = useCallback((e) => {
        e.preventDefault()
        
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

        })

    }, [ year, user, setActiveYear, setTrigger ])

    useEffect(() => {
        inputRef.current.focus()
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
                <button className="m-submit-btn" type="submit">Create</button>
            </div>

        </form>
    )
}