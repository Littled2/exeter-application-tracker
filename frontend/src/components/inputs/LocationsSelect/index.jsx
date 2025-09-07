import { BiX } from "react-icons/bi"
import styles from "./styles.module.css"
import { useCallback, useEffect, useRef, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5"
import { useMobile } from "../../../contexts/mobileContext"

export function LocationsSelect({ locations, setLocations, setNewLocationOpen, c }) {

    const { pb, user } = usePocket()
    const { isMobile } = useMobile()

    const [ allLocations, setAllLocations ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ name, setName ] = useState('')
    const [ ddOpen, setDdOpen ] = useState(false)
    const [ creating, setCreating ] = useState(false)
    const [ locationsNames, setLocationsNames ] = useState([])

    const dropdownRef = useRef(null);
    const inputRef = useRef()


    useEffect(() => {

        // Fetch the locations
        const filter = locations.map(id => `id="${id}"`).join(' || ');

        pb.collection("locations").getFullList({
            filter
        })
        .then(locDocs => {
            let names = []
            locations.forEach(loc => {
                let filtered = locDocs.filter(l => l.id === loc)
                names.push(filtered.length > 0 ? filtered[0].name : '')
            })
            setLocationsNames(names)
        })
        .catch(err => {
            console.error("Error getting initial locations", err)
        })


    }, [])

    useEffect(() => {
        pb.collection("locations").getList(1, 25, { sort: "name"})
        .then(locs => setAllLocations(locs))
        .catch(err => console.error("Error getting locations", err))
    }, [c])

    
    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDdOpen(false);
        }
    }, [ dropdownRef, setDdOpen ])


    useEffect(() => {

        setLoading(true)
        pb.collection("locations").getList(1, 25, {
            sort: "name",
            filter: `name ~ '%${name}%'`,
            
        })
        .then(locs => {
            setAllLocations(locs?.items || [])
        })
        .catch(err => console.error("Error getting locations", err))
        .finally(() => {
            setLoading(false)
        })

    }, [c, name])

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])


    const addLoc = (loc) => {
        setLocations(temp => [ ...temp, loc.id ])
        setLocationsNames(temp => [ ...temp, loc.name ])
    }

    const removeLoc = (index) => {
        let tempLocations = JSON.parse(JSON.stringify(locations))
        tempLocations.splice(index, 1)
        setLocations(tempLocations)
        let tempLocationsNames = JSON.parse(JSON.stringify(locationsNames))
        tempLocationsNames.splice(index, 1)
        setLocationsNames(tempLocationsNames)
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.locations}>
                {
                    locations.map((loc, i) => {
                        return (
                            <div className={styles.currentLocation} key={i}>
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    removeLoc(i)
                                }}>
                                    <BiX />
                                </button>
                                <span>
                                    {locationsNames[i]}
                                </span>
                            </div>
                        )
                    })
                }

                {
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
                                placeholder="Start typing location"
                                value={name}
                                onInput={e => {
                                    setName(e.target.value)
                                    // if(selected) setSelected(null)
                                }}
                                onKeyDown={e => {
                                    if(e.key === "Enter") {
                                        setNewLocationOpen(true)
                                    }
                                }}
                            />
                            {
                                (ddOpen && name) && (
                                    <button
                                        type="button"
                                        className={styles.clearBtn}
                                        onClick={() => {
                                            setName('')
                                            // setSelected(null)
                                        }}
                                    >
                                        <IoCloseOutline />
                                    </button>
                                )
                            }
                        </div>

                        {
                            ddOpen && (
                                <div className={styles.select}>
                                    {
                                        (name.length !== 0 && allLocations.filter(loc => loc.name.toLowerCase() === name.toLowerCase()).length === 0) && (
                                            <div
                                                onClick={() => setNewLocationOpen(true)}
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
                                        !loading && allLocations && allLocations?.length > 0 ? (
                                            allLocations?.map(loc => {
                                                return <div
                                                    className={styles.item}
                                                    value={loc.id}
                                                    key={"__" + loc.id}
                                                    onClick={() => {
                                                        addLoc(loc)
                                                        setName('')
                                                        setDdOpen(false)
                                                    }}
                                                >{loc?.name}</div>
                                            })
                                        ) : (
                                            <p className="text-center">Loading...</p>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>

                    // <select onChange={e => setLocations(l => [ ...l, e.target.value ])}>
                    //     <option disabled value="">Optionally select location(s)</option>
                    //     {
                    //         allLocations
                    //         .filter(location => !locations.some((selected) => selected === location.id))
                    //         .map(location => {
                    //             return (
                    //                 <option key={'__' + location.id} value={location.id}>{location.name}</option>
                    //             )
                    //         })
                    //     }
                    // </select>
                }
            </div>

            {/* <div className={styles.add}>
                <span>Add location</span>

            </div> */}
        </div>
    )
}