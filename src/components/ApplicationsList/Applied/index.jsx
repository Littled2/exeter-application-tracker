import styles from "./styles.module.css"
import { useCallback, useState } from "react"
import { TableRows } from "../TableRows"
import { useEffect } from "react"
import { TableSection } from "../../TableSection"
import { useActiveYear } from "../../../contexts/activeYearContext"
import { usePocket } from "../../../contexts/pocketContext"
import { useNewApplicationPopup } from "../../../contexts/newApplicationPopupContext"
import { useMasterCounter } from "../../../contexts/masterCounterContext"


export function Applied({ openAppID, setOpenAppID }) {

    const { setNewApplicationPopupOpen } = useNewApplicationPopup()

    const [ loading, setLoading ] = useState(true)

    const [ applied, setApplied ] = useState([])

    const [ err, setErr ] = useState(false)

    const { activeYear } = useActiveYear()
    const { masterCounter } = useMasterCounter()

    const { pb } = usePocket()

    useEffect(() => {
        
        getApps()

        pb.collection('applications').subscribe('*', getApps)

        return () => pb.collection('applications').unsubscribe()

    }, [ masterCounter, activeYear])

    const getApps = () => {
        setLoading(true)
        pb.collection("applications").getFullList({ filter: `year = "${activeYear}" && stage = "applied"`, expand: "locations, organisation", sort: "deadline" })
        .then(apps => {
            setApplied(apps)
            setLoading(false)
        })
        .catch(error => {
            console.error("Error getting applications", error)
            setErr(true)
            setLoading(false)
        })
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

        let apps = applied
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
                        <th width="12%">Company</th>
                        <th>Name</th>
                        <th className="t-hide" width="6%">Type</th>
                        <th className="m-hide" width="10%">Deadline</th>
                        <th className="m-hide" width="20%">Deadline Type</th>
                    </tr>
                </thead>
                <tbody>

                    <TableSection name="Applied" amount={applied.length}>
                        <TableRows setOpenAppID={setOpenAppID} openAppID={openAppID} items={applied} showType={true} showDeadline={true} showDeadlineType={true}/>
                    </TableSection>

                </tbody>
            </table>

            {
                applied.length === 0 && !loading && (
                    <div className={styles.statusInfo}>
                        <p>There are no applications at this stage yet</p>
                        <button onClick={() => setNewApplicationPopupOpen(true)}>+ New Application</button>
                    </div>
                )
            }

            {
                loading && (
                    <div className={styles.statusInfo}>
                        <p>Loading....</p>
                    </div> 
                )
            }
        </>
    ) : (
        <p className="text-red">Error</p>
    )
}