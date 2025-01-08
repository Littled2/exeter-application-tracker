import styles from "./styles.module.css"
import { BiDownArrow, BiEdit, BiLogOut, BiTrash, BiUpArrow } from "react-icons/bi"
import { usePocket } from "../../contexts/pocketContext"
import { useCallback, useEffect, useState } from "react"
import { FiDelete } from "react-icons/fi"
import { BsTrash } from "react-icons/bs"
import { useActiveYear } from "../../contexts/activeYearContext"
import { Popup } from "../Popup"
import { Confirm } from "../forms/Confirm"
import { NewYears } from "../forms/NewYears"
import { useMasterCounter } from "../../contexts/masterCounterContext"

export function Settings({ setTrigger }) {

    const { pb, user, logout, deleteUser } = usePocket()

    const [ edit, setEdit ] = useState()
    const [ toDelete, setToDelete ] = useState()
    const [ deleteConfirm, setDeleteConfirm ] = useState(false)
    const [ newYearOpen, setNewYearOpen ] = useState(false)

    const { clearActiveYears, activeYear, setActiveYear, years } = useActiveYear()

    const { setMasterCounter } = useMasterCounter()

    const updateOrder = useCallback(async tempYears => {
        for (let i = 0; i < tempYears.length; i++) {
            const tempYear = tempYears[i]
            await pb.collection("years").update(tempYear?.id, {
                order: Math.min(i / (tempYears.length === 0 ? 1 : tempYears.length), 0.999) // Never hit 1, so when a new group is added it will appear at the end
            })            
        }
    })


    return (
        <>
        
            <section className={styles.wrapper}>

                <div className={styles.section}>
                    <h2>{user?.email}</h2>
                </div>

                <div className={styles.section}>
                    <div className="flex space-between">
                        <h5>Your groups</h5>
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

                <div className={styles.section}>
                    <h5>Log out of your account</h5>
                    <button onClick={() => {
                        setTrigger(false)
                        logout()
                        clearActiveYears()
                    }}><BiLogOut /> Logout</button>
                </div>

                <div className={styles.section}>
                    <h5>Delete my account</h5>
                    <button className={styles.deleteBtn} onClick={() => setDeleteConfirm(true)}><BiTrash /> Delete</button>
                </div>

                <Popup trigger={deleteConfirm} setTrigger={setDeleteConfirm}>
                    <div className="flex col gap-m">
                        <h5>Are you sure you want to delete your account?</h5>
                        <p>This action is irreversible.</p>

                        <div className="flex gap-s">
                            <button onClick={() => setDeleteConfirm(false)}>Cancel</button>
                            <button onClick={async () => {
                                await deleteUser()
                                await logout()
                                setTrigger(false)
                            }} className={styles.deleteBtn}>Confirm</button>
                        </div>
                    </div>
                </Popup>


                {
                    edit && (
                        <Popup trigger={edit} setTrigger={setEdit} title={"Change Group Name"}>
                            <div className={styles.section}>
                                <h5>Change Group Name</h5>


                                <input type="text" value={edit?.year} onInput={e => setEdit(val => {
                                    return {
                                        ...val,
                                        year: e.target.value
                                    }
                                })} />

                                <div>
                                    <button
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
                </section>

            <Popup title={"New Group"} trigger={newYearOpen} setTrigger={setNewYearOpen}>
                <NewYears setTrigger={setNewYearOpen} />
            </Popup>
        </>
    )
}