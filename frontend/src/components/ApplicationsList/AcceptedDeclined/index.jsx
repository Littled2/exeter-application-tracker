import styles from "./styles.module.css"
import { useCallback, useState } from "react"
import { TableRows } from "../TableRows"
import { useEffect } from "react"
import { TableSection } from "../../TableSection"
import { useActiveYear } from "../../../contexts/activeYearContext"
import { usePocket } from "../../../contexts/pocketContext"
import { useNewApplicationPopup } from "../../../contexts/newApplicationPopupContext"
import { useMasterCounter } from "../../../contexts/masterCounterContext"
import illustration from "../illustration.svg"
import useOnlineStatus from "../../../hooks/useOnlineStatus"


export function AcceptedDeclined({ openAppID, setOpenAppID }) {

    const { setNewApplicationPopupOpen } = useNewApplicationPopup()


    const [ accepted, setAccepted ] = useState([])
    const [ declined, setDeclined ] = useState([])

    const [ loading, setLoading ] = useState(true)

    const { activeYear } = useActiveYear()
    const { masterCounter } = useMasterCounter()
    const isOnline = useOnlineStatus()

    const { pb } = usePocket()

    const [ err, setErr ] = useState(false)

    useEffect(() => {

        if(isOnline) {

            getApps()
            pb.collection('applications').subscribe('*', getApps)

            return () => pb.collection('applications').unsubscribe()

        } else {

            // If offline, fetch from database

        }

            getApps()

            pb.collection('applications').subscribe('*', getApps)
    
            return () => pb.collection('applications').unsubscribe()
    
    }, [ masterCounter, activeYear])

    const getApps = async () => {

        setLoading(true)

        try {

            const apps = await pb.collection("applications").getFullList({
                filter: `year = "${activeYear}" && (stage = "accepted" || stage = "declined")`,
                expand: "locations, organisation",
                sort: "deadline"
            })

            apps.sort((a, b) => {
                if (!a.deadline) return 1
                if (!b.deadline) return -1
                return new Date(b.deadline) - new Date(a.deadline)
            })

            setAccepted(apps.filter(app => app.stage === "accepted"))
            setDeclined(apps.filter(app => app.stage === "declined"))

        } catch (error) {
            console.error("Error getting applications", error)
            setErr(true)
        }

        setLoading(false)

    }

    const handleKeyPress = useCallback(e => {

        if(!openAppID) return
        
        if(e.key !== "ArrowUp" && e.key !== "ArrowDown") {
            return
        }

        const activeElement = document.activeElement;

        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            return
        }

        let apps = [ ...accepted, ...declined ]
        let index = apps.findIndex(el => el.id === openAppID)

        if(index === -1) return

        if(e.key === "ArrowUp") {
            e.preventDefault()
            e.stopPropagation()
            
            index = Math.max(index - 1, 0)
        } else if(e.key === "ArrowDown") {
            e.preventDefault()
            e.stopPropagation()

            index = Math.min(index + 1, apps.length - 1)
        }

        setOpenAppID(apps[index].id)
    }, [ openAppID, setOpenAppID ])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress)
        return () => document.removeEventListener('keydown', handleKeyPress)
    }, [handleKeyPress])


    return !err ? (
        <>
            <table className={styles.wrapper}>
                <thead className="m-hide">
                    <tr>
                        <th width="22%">Organisation</th>
                        <th>Role</th>
                        {/* <th className="t-hide" width="6%">Type</th> */}
                        <th className="m-hide" width="10%">Deadline</th>
                        {/* <th className="m-hide" width="20%">Deadline Type</th> */}
                    </tr>
                </thead>
                <tbody>

                    <TableSection name="Accepted" amount={accepted.length}>
                        <TableRows setOpenAppID={setOpenAppID} openAppID={openAppID} items={accepted} showType={true} showDeadline={true} showDeadlineType={true}/>
                    </TableSection>

                    <TableSection name="Declined" amount={declined.length}>
                        <TableRows setOpenAppID={setOpenAppID} openAppID={openAppID} items={declined} showType={true} showDeadline={true} showDeadlineType={true}/>
                    </TableSection>

                </tbody>
            </table>

            {
                accepted.length === 0 && declined.length === 0 && !loading && (
                    <div className={styles.statusInfo}>
                        <img src={illustration} className={styles.illustration} />
                        <small className="text-center text-grey">No applications at this stage</small>
                        <button onClick={() => setNewApplicationPopupOpen(true)}>+ Add Application</button>
                    </div>
                )
            }


            {
                loading && (
                    <div className={styles.statusInfo}>
                        <p>Loading...</p>
                    </div>
                )
            }
        </>
    ) : (
        <p className="text-red">Something went wrong</p>
    )
}