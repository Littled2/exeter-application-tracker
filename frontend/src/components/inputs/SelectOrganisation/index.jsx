import { useCallback, useEffect, useRef, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import styles from "./styles.module.css"
import { IoCloseOutline, IoSearchCircleOutline, IoSearchOutline } from "react-icons/io5"
import { useMobile } from "../../../contexts/mobileContext"

export function SelectOrganisation({ selected, setSelected, c, sc }) {

    const [ organisations, setOrganisations ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ name, setName ] = useState('')
    const [ ddOpen, setDdOpen ] = useState(false)
    const [ creating, setCreating ] = useState(false)

    const { pb, user } = usePocket()
    const { isMobile } = useMobile()

    const dropdownRef = useRef(null);
    const inputRef = useRef()

    const selectedRef = useRef(selected)

    useEffect(() => {
        // Update ref whenever selected changes
        selectedRef.current = selected
    }, [selected])

    useEffect(() => {
        // If there is a currently selected item when the component loads, go get it!
        if(selected) {
            pb.collection("organisations").getOne(selected)
            .then(res => {
                setName(res.name)
            })
        }

    }, [])

    useEffect(() => {

        setLoading(true)
        pb.collection("organisations").getList(1, 25, {
            sort: "name",
            filter: `name ~ '%${name}%'`,
            
        })
        .then(orgs => {
            setOrganisations(orgs?.items || [])
        })
        .catch(err => console.error("Error getting organisations", err))
        .finally(() => {
            setLoading(false)
        })

    }, [c, name])

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDdOpen(false);

            // console.log("Clicked outside", { selectedRef: selectedRef.current })

            // If the text inputted has not been made into an organisation, scrap it
            if (!selectedRef.current) {
                setName('')
            }
        }
    }, [ selected, dropdownRef, setDdOpen ])

    const createOrganisation = useCallback(() => {
        setCreating(true)
        pb.collection("organisations").create({
            name: name,
            user: user.id
        })
        .then(res => {
            setCreating(false)
            setDdOpen(false)
            setName(name)
            setSelected(res.id)
            sc(c => c + 1)
        })
        .catch(err => {
            console.error("Error creating organisation", err)
            setCreating(false)
        })
    }, [ name, user, setCreating, setName, sc, setSelected ])

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])


    return (
        <div className="flex col" style={{ gap: "2px", width: "100%" }} ref={dropdownRef}>
            <div className={styles.inputWrapper}>
                <div className={styles.searchIcon} onClick={() => inputRef.current.focus()}>
                    <IoSearchOutline />
                </div>
                <input
                    ref={inputRef}
                    className={styles.textInput}
                    onFocus={(e) => {
                        setDdOpen(true)
                        if(isMobile) e.target.scrollIntoView({ behavior: "smooth", block: "start" })
                    }}
                    type="text"
                    placeholder="Start typing organisation"
                    value={name}
                    onInput={e => {
                        setName(e.target.value)
                        if(selected) setSelected(null)
                    }}
                    onKeyDown={e => {
                        if(e.key === "Enter") {
                            createOrganisation()
                        }
                    }}
                />
                {
                    ((ddOpen && name) || selected) && (
                        <button
                            type="button"
                            className={styles.clearBtn}
                            onClick={() => {
                                setName('')
                                setSelected(null)
                            }}
                        >
                            <IoCloseOutline />
                        </button>
                    )
                }
            </div>

            {
                ddOpen && (
                    <div className={styles.select} value={selected} onInput={e => setSelected(e.target.value)}>
                        {
                            (name.length !== 0 && organisations.filter(org => org.name.toLowerCase() === name.toLowerCase()).length === 0) && (
                                <div
                                    onClick={() => createOrganisation()}
                                    className={styles.item}
                                >
                                    {
                                        !creating ? (
                                            <p className="text-grey">Add <span className="text-orange">{name}</span></p>
                                        ) : (
                                            <p className="text-grey text-center">Processing...</p>
                                        )
                                    }
                                </div>
                            )
                        }
                        
                        {
                            !loading ? (
                                organisations.map(org => {
                                    return <div
                                        className={styles.item}
                                        value={org.id}
                                        key={org.id}
                                        onClick={() => {
                                            setSelected(org.id)
                                            setName(org?.name)
                                            setDdOpen(false)
                                        }}
                                    >{org?.name}</div>
                                })
                            ) : (
                                <p className="text-center">Loading...</p>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}