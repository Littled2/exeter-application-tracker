import { useCallback, useEffect, useState } from "react"
import styles from "./styles.module.css"
import { TableRows } from "../TableRows"
import { TableSection } from "../../TableSection"
import { usePocket } from "../../../contexts/pocketContext"
import { useActiveYear } from "../../../contexts/activeYearContext"
import { useNewApplicationPopup } from "../../../contexts/newApplicationPopupContext"
import { useMasterCounter } from "../../../contexts/masterCounterContext"
import illustration from "../illustration.svg"

export function IdeasApplying({ openAppID, setOpenAppID }) {

    const { setNewApplicationPopupOpen } = useNewApplicationPopup()

    const [ loading, setLoading ] = useState(true)

    const [ ideas, setIdeas ] = useState([])
    const [ applying, setApplying ] = useState([])

    const { activeYear } = useActiveYear()
    const { masterCounter } = useMasterCounter()

    const { pb } = usePocket()

    const [ err, setErr ] = useState(false)

    useEffect(() => {

        getApps()

        pb.collection('applications').subscribe('*', getApps)

        return () => pb.collection('applications').unsubscribe()

    }, [ masterCounter, activeYear ])

    const getApps = () => {
        setLoading(true)
        pb.collection("applications").getFullList({ filter: `year = "${activeYear}" && (stage = "idea" || stage = "applying")`, expand: "locations, organisation", sort: "deadline" })
        .then(apps => {
            setIdeas(apps.filter(app => app.stage === "idea"))
            setApplying(apps.filter(app => app.stage === "applying"))
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
                        <th width="12%">Organisation</th>
                        <th>Role</th>
                        <th className="t-hide" width="6%">Type</th>
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
                        <span className={styles.dueToday}>Due today</span>
                        <span className={styles.almostDue}>Next 3 days</span>
                        <span className={styles.passed}>Passed</span>
                    </div>
                )
            }

            {
                ideas.length === 0 && applying.length === 0 && !loading && (
                    <div className={styles.statusInfo}>
                        <img src={illustration} className={styles.illustration} />
                        <small className="text-center text-grey">No applications at this stage</small>
                        <button className="m-hide" onClick={() => setNewApplicationPopupOpen(true)}>+ New Application</button>
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