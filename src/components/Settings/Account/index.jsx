import { BiLogOut, BiTrash } from "react-icons/bi"
import { useActiveYear } from "../../../contexts/activeYearContext"
import { usePocket } from "../../../contexts/pocketContext"
import styles from "./styles.module.css"
import { Popup } from "../../Popup"
import { useState } from "react"

export function Account({ setTrigger }) {

    const [ deleteConfirm, setDeleteConfirm ] = useState(false)

    const { user, logout, deleteUser } = usePocket()
    const { clearActiveYears } = useActiveYear()

    
    return (
        <div className={styles.tab}>

            <h2>{user?.email}</h2>
            
            <div className={styles.section}>
                    <h5 className="text-grey">Log out of my account</h5>
                    <button onClick={() => {
                        setTrigger(false)
                        logout()
                        clearActiveYears()
                    }}><BiLogOut /> Logout</button>
                </div>

                <div className={styles.section}>
                    <h5 className="text-grey">Delete my account</h5>
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


        </div>
    )
}