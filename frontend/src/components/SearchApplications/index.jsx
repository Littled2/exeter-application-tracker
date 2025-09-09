import { useEffect, useRef, useState } from "react"
import { useActiveYear } from "../../contexts/activeYearContext"
import { useOpenApp } from "../../contexts/openAppContext"
import styles from "./styles.module.css"
import { usePocket } from "../../contexts/pocketContext"

export function SearchApplications({ searchOpen, setSearchOpen }) {

    const inputRef = useRef()


    const [ matches, setMatches ] = useState([])
    const [ query, setQuery ] = useState('')

    const { setOpenAppID } = useOpenApp()

    const { setActiveYear, years } = useActiveYear()
    
    const { pb } = usePocket()

    useEffect(() => {

        if(query === "") {
            setMatches([])
            return
        }

        pb.collection("applications").getFullList({
            filter: `(role ~ '${query}' || info ~ '${query}' || organisation.name ~ '${query}')`,
            expand: "organisation"
        })
        .then(apps => {
            setMatches(apps)
        })
        .catch(err => {
            console.error(err)
        })

    }, [ query ])


    useEffect(() => {
        if(!searchOpen) {
            setQuery('')
            setMatches([])
        } else {
            setTimeout(() => {
                inputRef.current.focus()
            }, 50)
        }
    }, [ searchOpen ])
    
    

    return (
        <div className="flex flex-col gap-s" style={{ position: "relative" }}>
            <div className="flex flex-col gap-s" style={{ position: "sticky", top: "0", backgroundColor: "var(--bg-colour)" }}>
                <div className="form">
                    <input ref={inputRef} type="text" value={query} onInput={e => setQuery(e.target.value)} placeholder="Search for a role or organisation" />
                </div>
                {
                    query !== '' && (
                        <div className="flex space-between">
                            <small className="text-grey">Results for: {query}</small>
                        </div>
                    )
                }
            </div>
            <div className="flex flex-col gap-s flex-1">
                {
                    matches?.map(m => {
                        return (
                            <div
                                className={styles.result}    
                                onClick={() => {
                                    setSearchOpen(false)
                                    setActiveYear(m?.year)
                                    setOpenAppID(m?.id)
                                }}
                            >
                                <p>{m?.expand?.organisation?.name}</p>
                                <small className="text-grey">{m?.role} | {years.filter(y => y.id === m.year)[0]?.year}</small>
                            </div>
                        )
                    })   
                }
            </div>
        </div>
    )
}