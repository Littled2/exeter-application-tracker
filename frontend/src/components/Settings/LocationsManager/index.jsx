import { useCallback, useEffect, useState } from "react"
import { Confirm } from "../../forms/Confirm"
import { Popup } from "../../Popup"
import styles from "./styles.module.css"
import { useActiveYear } from "../../../contexts/activeYearContext"
import { useMasterCounter } from "../../../contexts/masterCounterContext"
import { BiDownArrow, BiEdit, BiUpArrow } from "react-icons/bi"
import { usePocket } from "../../../contexts/pocketContext"
import { BsPencil, BsTrash } from "react-icons/bs"
import { NewYears } from "../../forms/NewYears"
import { EditLocation } from "../../forms/EditLocation"
import { NewLocation } from "../../forms/NewLocation"

export function LocationsManager() {

    const [ edit, setEdit ] = useState()
    const [ toDelete, setToDelete ] = useState()
    const [ newLocationOpen, setNewLocationOpen ] = useState(false)
    const [ errorFetching , setErrorFetching ] = useState(null)
    const [ locations, setLocations ] = useState([])
    const [ errorDeleting, setErrorDeleting ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    const { pb, user } = usePocket()

    const { masterCounter, setMasterCounter } = useMasterCounter()

    useEffect(() => {
        setLoading(true)
        pb.collection("locations").getFullList({ sort: "name", filter: `user = '${user?.id}'` })
        .then(locs => {
            setLocations(locs)
        })
        .catch(err => {
            setErrorFetching(err)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [ masterCounter ])

    
    return (
        <div className={styles.tab}>

            <div className="flex space-between align-center">
                <h5 className="text-white">My Locations</h5>
                <button onClick={() => setNewLocationOpen(true)} className={styles.newButton}>+ <span className="underline">Create location</span></button>
            </div>

            {
                !errorFetching ? (
                    <>

                        <div className="flex col gap-s">
                            {
                                loading && (
                                    <small className="text-grey text-center">Loading...</small>
                                )
                            }
                            {
                                locations.map(location => {
                                    return (
                                        <div className={styles.row} key={location?.id}>
                                            <p>{location.name}</p>
            
                                            <div className="flex gap-s">
                                                <button className={styles.actionBtn} onClick={() => setEdit(location)}><BsPencil /></button>
                                                <button className={styles.actionBtn} onClick={() => setToDelete(location)}><BsTrash /></button>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        {
                            edit && (
                                <Popup trigger={edit} setTrigger={setEdit} title={"Edit Location"}>
                                    <EditLocation setTrigger={setEdit} location={edit} />
                                </Popup>
                            )
                        }
            
                        {
                            toDelete && (
                                <Confirm message={'Are you sure you want to delete the location "' + toDelete?.name + '"?'} trigger={toDelete} setTrigger={setToDelete} onConfirm={() => {
                                        setErrorDeleting(null)
                                        pb.collection("locations").delete(toDelete?.id)
                                        .then(() => {
                                            setToDelete(null)
                                            setMasterCounter(c => c + 1)
                                        })
                                        .catch(err => {
                                            console.error("Error deleting group", err)
                                            setErrorDeleting(err)
                                        })
                                    }}
                                />
                            )
                        }
            
                        
                        <Popup title={"New Location"} trigger={newLocationOpen} setTrigger={setNewLocationOpen}>
                            <NewLocation setTrigger={setNewLocationOpen} />
                        </Popup>

                        <Popup title={"Cannot delete"} trigger={errorDeleting} setTrigger={setErrorDeleting}>
                            <p className="text-red">Cannot delete this location. <br /> <span className="text-grey">Please check no application's location is set to this location then try again.</span></p>
                        </Popup>
            
                    </>
                ) : (
                    <p className="text-red">Error fetching locations</p>
                )
            }
        </div>
    )
}