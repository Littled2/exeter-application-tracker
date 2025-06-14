import { useCallback, useEffect, useState } from "react"
import styles from "./styles.module.css"
import { TableRows } from "../TableRows"
import { TableSection } from "../../TableSection"
import { usePocket } from "../../../contexts/pocketContext"
import { useActiveYear } from "../../../contexts/activeYearContext"
import { useNewApplicationPopup } from "../../../contexts/newApplicationPopupContext"
import { useMasterCounter } from "../../../contexts/masterCounterContext"
import illustration from "../illustration.svg"
import { indexDB } from "../../db"
import useOnlineStatus from "../../../hooks/useOnlineStatus"

export function IdeasApplying({ openAppID, setOpenAppID }) {

    const { setNewApplicationPopupOpen } = useNewApplicationPopup()

    const [ loading, setLoading ] = useState(true)

    const [ ideas, setIdeas ] = useState([])
    const [ applying, setApplying ] = useState([])

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
            indexDB.applications.where('stage').equals('idea').toArray().then(setIdeas)
            indexDB.applications.where('stage').equals('applying').toArray().then(setApplying)
        }

    }, [ masterCounter, activeYear ])

    const getApps = async () => {

        setLoading(true)

        try {

            const apps = await pb.collection("applications").getFullList({
                filter: `year = "${activeYear}" && (stage = "idea" || stage = "applying")`,
                expand: "locations, organisation",
                sort: "deadline"
            })

            apps.sort((a, b) => {
                if (!a.deadline) return 1
                if (!b.deadline) return -1
                return new Date(b.deadline) - new Date(a.deadline)
            })
    
            setIdeas(apps.filter(app => app.stage === "idea"))
            setApplying(apps.filter(app => app.stage === "applying"))
    
            try {
                // Remove all idea and applying applications from indexDB
                await indexDB.applications.where('stage').equals('applying').delete()
                await indexDB.applications.where('stage').equals('idea').delete()
    
                for (let i = 0; i < apps.length; i++) {
                    await indexDB.applications.add(apps[i])                    
                }
    
                // Add all fetched applications to indexDB
                // indexDB.applications.bulkAdd(apps)
            } catch (err) {
                console.error("Error adding applications to indexDB", err)
            }

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

        let apps = [ ...ideas, ...applying ]
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
        <div className={styles.wrapper}>
            <table>
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

                    <TableSection name="Ideas" amount={ideas.length}>
                        <TableRows setOpenAppID={setOpenAppID} openAppID={openAppID} items={ideas} showType={true} showDeadline={true} showDeadlineType={true}/>
                    </TableSection>

                    <TableSection name="Applying" amount={applying.length}>
                        <TableRows setOpenAppID={setOpenAppID} openAppID={openAppID} items={applying} showType={true} showDeadline={true} showDeadlineType={true}/>
                    </TableSection>

                </tbody>
            </table>

            {
                (ideas.length > 0 || applying.length > 0) && !loading && (
                    <div className={[ styles.key, 'm-hide' ].join(" ")}>
                        <span className={styles.missed}>Missed</span>
                        <span className={styles.upcoming}>Upcoming</span>
                    </div>
                )
            }

            {
                ideas.length === 0 && applying.length === 0 && !loading && (
                    <div className={styles.statusInfo}>
                        <img src={illustration} className={styles.illustration} />
                        <small className="text-center text-grey">Track your applications to internships, jobs, and placements</small>
                        <small className="text-center text-grey">No applications at this stage</small>
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
        </div>
    ) : (
        <p style={{ color: "red" }}>Something went wrong</p>
    )
}