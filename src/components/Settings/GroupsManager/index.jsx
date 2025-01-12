import { useCallback, useState } from "react"
import { Confirm } from "../../forms/Confirm"
import { Popup } from "../../Popup"
import styles from "./styles.module.css"
import { useActiveYear } from "../../../contexts/activeYearContext"
import { useMasterCounter } from "../../../contexts/masterCounterContext"
import { BiDownArrow, BiEdit, BiUpArrow } from "react-icons/bi"
import { usePocket } from "../../../contexts/pocketContext"
import { BsTrash } from "react-icons/bs"
import { NewYears } from "../../forms/NewYears"

export function GroupsManager() {

    const [ edit, setEdit ] = useState()
    const [ toDelete, setToDelete ] = useState()
    const [ newYearOpen, setNewYearOpen ] = useState(false)

    const { pb } = usePocket()

    const { clearActiveYears, activeYear, setActiveYear, years } = useActiveYear()

    const { setMasterCounter } = useMasterCounter()


    const updateOrder = useCallback(async tempYears => {
        for (let i = 0; i < tempYears.length; i++) {
            const tempYear = tempYears[i]
            await pb.collection("years").update(tempYear?.id, {
                order: Math.min(i / (tempYears.length === 0 ? 1 : tempYears.length), 0.999) // Never hit 1, so when a new group is added it will appear at the end
            })            
        }
    }, [ pb ])

    
    return (
        <div className={styles.tab}>
            <div className="flex col gap-m">
                <div className="flex space-between">
                    <h5 className="text-grey">My Groups</h5>
                    <button onClick={() => setNewYearOpen(true)} className={styles.reOrderButton}>+ <span className="underline">Create group</span></button>
                </div>

                <table>
                    {/* <thead>
                        <th>Year</th>
                        <th>Rename</th>
                        <th>Delete</th>
                    </thead> */}
                    <tbody>
                        {
                            years.map((yr, i) => {
                                return (
                                    <tr key={"account_year_" + yr.id}>
                                        <td className={activeYear === yr.id ? styles.selectedGroup : ''} onClick={() => setActiveYear(yr.id)}>{yr.year}</td>
                                        <td>
                                            <button disabled={i === 0} className={styles.reOrderButton} onClick={() => {
                                                let tempYrs = JSON.parse(JSON.stringify(years))
                                                let tempEl = tempYrs[i - 1]
                                                tempYrs[i - 1] = tempYrs[i]
                                                tempYrs[i] = tempEl
                                                updateOrder(tempYrs)
                                            }}>
                                                <BiUpArrow />
                                            </button>
                                            <button disabled={i === years.length - 1} className={styles.reOrderButton} onClick={() => {
                                                let tempYrs = JSON.parse(JSON.stringify(years))
                                                let tempEl = tempYrs[i + 1]
                                                tempYrs[i + 1] = tempYrs[i]
                                                tempYrs[i] = tempEl
                                                updateOrder(tempYrs)
                                            }}>
                                                <BiDownArrow />
                                            </button>
                                        </td>
                                        <td>
                                            <button className={styles.reOrderButton} onClick={() => setEdit(yr)}><BiEdit /></button>
                                        </td>
                                        <td>
                                            <button className={styles.reOrderButton} onClick={() => setToDelete(yr)}><BsTrash /></button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>


            {
                edit && (
                    <Popup trigger={edit} setTrigger={setEdit} title={"Change Group Name"}>
                        <div className={[ styles.section, 'form' ].join(' ')}>
                            <h5>Change Group Name</h5>


                            <input type="text" value={edit?.year} onInput={e => setEdit(val => {
                                return {
                                    ...val,
                                    year: e.target.value
                                }
                            })} />

                            <div>
                                <button
                                    className="m-submit-btn"
                                    onClick={() => {
                                        pb.collection("years").update(edit?.id, {
                                            year: edit?.year
                                        }).then(() => setEdit(null))
                                    }}
                                >Save</button>
                            </div>
                        </div>
                    </Popup>
                )
            }

            {
                toDelete && (
                    <Confirm message={'Are you sure you want to delete the group "' + toDelete?.year + '"?'} trigger={toDelete} setTrigger={setToDelete} onConfirm={() => {
                            pb.collection("years").delete(toDelete?.id)
                            .then(() => {
                                setToDelete(null)
                                setMasterCounter(c => c + 1)
                            })
                            .catch(err => console.error("Error deleting group", err))
                        }}
                    />
                )
            }

            
            <Popup title={"New Group"} trigger={newYearOpen} setTrigger={setNewYearOpen}>
                <NewYears setTrigger={setNewYearOpen} />
            </Popup>

        </div>
    )
}