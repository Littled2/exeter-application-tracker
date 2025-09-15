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

            <div className="flex flex-col gap-s">
                <small className="text-grey">Logged in as</small>
                <h2 className="text-white">{user?.email}</h2>
            </div>
            
            <div className="flex m-flex-col gap-s space-between align-center">
                <p className="text-grey">Log out of my account</p>
                <div>
                    <button className={styles.logOutBtn} onClick={() => {
                        setTrigger(false)
                        logout()
                        clearActiveYears()
                    }}><BiLogOut /> Logout</button>
                </div>
            </div>

            <div className="flex m-flex-col gap-s space-between align-center">
                <p className="text-grey">Delete my account</p>
                <div>
                    <button className={styles.deleteBtn} onClick={() => setDeleteConfirm(true)}><BiTrash /> Delete</button>
                </div>
            </div>

            <div>
                <p className="text-grey">View the <a className="text-orange underline" href={process.env.REACT_APP_TERMS_AND_CONDITIONS_URL}>Terms of Service</a> and <a className="text-orange underline" href={process.env.REACT_APP_PRIVACY_POLICY_URL}>Privacy Policy</a>.</p>
            </div>

            <Popup trigger={deleteConfirm} setTrigger={setDeleteConfirm}>
                <div className="flex col gap-m">
                    <h5 className="text-red">Are you sure you want to delete your account?</h5>
                    <p className="text-grey">This action is irreversible.</p>

                    <div className="flex gap-s">
                        <button className="m-submit-btn m-submit-btn-grey" onClick={() => setDeleteConfirm(false)}>Cancel</button>
                        <button onClick={async () => {
                            await deleteUser()
                            await logout()
                            setTrigger(false)
                        }} className="m-submit-btn m-submit-btn-red">Confirm</button>
                    </div>
                </div>
            </Popup>

        </div>
    )
}