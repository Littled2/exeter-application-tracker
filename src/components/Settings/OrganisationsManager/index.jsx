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
import { NewOrganisation } from "../../forms/NewOrganisation"

export function OrganisationsManager() {

    const [ edit, setEdit ] = useState()
    const [ toDelete, setToDelete ] = useState()
    const [ newOrganisationOpen, setNewOrganisationOpen ] = useState(false)
    const [ errorFetching , setErrorFetching ] = useState(null)
    const [ organisations, setOrganisations ] = useState([])

    const { pb } = usePocket()

    const [ c, sc ] = useState(0)

    useEffect(() => {
        pb.collection("organisations").getFullList({ sort: "name" })
        .then(locs => {
            setOrganisations(locs)
        })
        .catch(err => {
            setErrorFetching(err)
        })
    }, [ c ])

    
    return (
        <div className={styles.tab}>

            <div className="flex space-between align-center">
                <h5 className="text-grey">My Organisations</h5>
                <button onClick={() => setNewOrganisationOpen(true)} className={styles.actionBtn}>+ <span className="underline">Create organisation</span></button>
            </div>

            {
                !errorFetching ? (
                    <>

                        <div className="flex col gap-s">
                            {
                                organisations.map(organisation => {
                                    return (
                                        <div className="flex space-between align-center">
                                            <p>{organisation.name}</p>
            
                                            <div className="flex gap-s">
                                                <button className={styles.actionBtn} onClick={() => setEdit(organisation)}><BsPencil /></button>
                                                <button className={styles.actionBtn} onClick={() => setToDelete(organisation)}><BsTrash /></button>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        {
                            edit && (
                                <Popup trigger={edit} setTrigger={setEdit} title={"Edit Organisation"}>
                                    <div className={styles.section}>
                                        <h5>Change Organisation Name</h5>


                                        <input type="text" value={edit?.name} onInput={e => setEdit(val => {
                                            return {
                                                ...val,
                                                name: e.target.value
                                            }
                                        })} />

                                        <div>
                                            <button
                                                onClick={() => {
                                                    pb.collection("organisations").update(edit?.id, {
                                                        name: edit?.name
                                                    }).then(() => {
                                                        sc(prev => prev + 1)
                                                        setEdit(null)
                                                    })
                                                }}
                                            >Save</button>
                                        </div>
                                    </div>
                                </Popup>
                            )
                        }
            
                        {
                            toDelete && (
                                <Confirm message={'Are you sure you want to delete the organisation "' + toDelete?.name + '"?'} trigger={toDelete} setTrigger={setToDelete} onConfirm={() => {
                                        pb.collection("organisations").delete(toDelete?.id)
                                        .then(() => {
                                            setToDelete(null)
                                            sc(c => c + 1)
                                        })
                                        .catch(err => console.error("Error deleting group", err))
                                    }}
                                />
                            )
                        }
            
                        
                        <Popup title={"New Organisation"} trigger={newOrganisationOpen} setTrigger={setNewOrganisationOpen}>
                            <NewOrganisation setTrigger={setNewOrganisationOpen} sc={sc} />
                        </Popup>
            
                    </>
                ) : (
                    <p className="text-red">Error fetching locations</p>
                )
            }
        </div>
    )
}