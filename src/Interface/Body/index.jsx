import { useEffect, useState } from "react"
import { ApplicationView } from "../../windows/ApplicationView"
import { LocationView } from "../../windows/LocationView"
import { DeadlinesOverView } from "../../windows/DeadlinesOverView"
import { StageBreakdown } from "../../windows/StageBreakdown"
import styles from "./styles.module.css"
import { TodoTasks } from "../../components/TasksList/TodoTasks"
import { DeadlinesBreakdown } from "../../windows/DeadlinesBreakdown"
import { ApplicationsTabs } from "../../windows/ApplicationsTabs"
import { useActiveYear } from "../../contexts/activeYearContext"

import 'react-day-picker/style.css';
import { usePocket } from "../../contexts/pocketContext"
import { BsPlus } from "react-icons/bs"
import { useNewApplicationPopup } from "../../contexts/newApplicationPopupContext"
import { useMobile } from "../../contexts/mobileContext"
import { usePopupsContext } from "../../contexts/popupsContext"
import { UpcomingDeadlines } from "../../windows/UpcomingDeadlines"


export function Body({ counter, setCounter }) {

    const [ openAppID, setOpenAppID ] = useState(null)
    const { setNewApplicationPopupOpen } = useNewApplicationPopup()

    const { activeYear } = useActiveYear()
    const { user } = usePocket()
    const { isMobile, activeMobileTab } = useMobile()
    

    return (
        activeYear ? (
            <main className={styles.wrapper}>

                <div className={styles.applicationsTasksWrapper}>

                    {
                        !(isMobile && activeMobileTab !== 'analytics' && activeMobileTab !== 'deadlines') && (

                            <div className={styles.dataVisWrapper}>

                                


                                {
                                    ((!isMobile && user?.locationsView) || (isMobile && activeMobileTab === 'analytics')) && (
                                        <LocationView />
                                    )
                                }
        
                                {
                                    ((!isMobile && user?.stagesView) || (isMobile && activeMobileTab === 'analytics')) && (
                                        !openAppID ? (
                                            <StageBreakdown />
                                        ) : (
                                            <></>
                                        )
                                    )
                                }
                                
                                {
                                    ((!isMobile && user?.deadlinesView) || (isMobile && activeMobileTab === 'deadlines')) && (
                                        <>
                                            {
                                                isMobile && (
                                                    <UpcomingDeadlines setOpenAppID={setOpenAppID} />
                                                )
                                            }

                                            <h3 className="m-show-block text-grey">Next Deadlines</h3>

                                            <DeadlinesOverView openAppID={openAppID} setOpenAppID={setOpenAppID} />
                                        </>
                                    )
                                }
        
        
        
                                {/* {
                                    openAppID === null ? (
                                        <DeadlinesBreakdown />
                                    ) : (
                                        <></>
                                    )
                                } */}
        
                            </div>
                        )
                    }

                        <div className={styles.tablesWrapper}>

                            {
                                (!isMobile || (isMobile && activeMobileTab === 'applications')) && (
                                    <div className={styles.applicationsWrapper} style={{ height: "calc(100vh - 300px)" }}>

                                        {
                                            isMobile && (
                                                <button onClick={() => setNewApplicationPopupOpen(true)} className={styles.mobileNewAppBtn}><BsPlus /></button>
                                            )
                                        }

                                        <h3 className="text-grey m-hide">Your applications</h3>

                                        <ApplicationsTabs setOpenAppID={setOpenAppID} openAppID={openAppID} />
                                    </div>
                                )
                            }


                            {
                                ((!isMobile && !openAppID) || (isMobile && activeMobileTab === 'tasks')) ? (
                                    <div className={styles.tasksWrapper}>
                                        {/* <b>-</b> */}
                                        {/* <h3 className="m-show-block">Tasks</h3> */}
                                        <p className="m-show-block text-grey">Open an application to add a task</p>
                                        <h3 className="text-grey m-hide">Tasks</h3>
                                        {/* <b className="m-hide">Track tasks for each application</b> */}
                                        <TodoTasks setOpenAppID={setOpenAppID} />
                                    </div>
                                ) : (
                                    <></>
                                )
                            }
                        </div>

                    {/* <div>
                        <div className={styles.opportunityWrapper}>

                        </div>
                        <h5>Opportunities Tracker</h5>
                        <div className={styles.applicationsWrapper} style={{ height: "calc(100vh - 300px)" }}>
                            <OpportunitiesTracker />
                        </div>
                    </div> */}

                </div>

                {
                    openAppID ? (
                        <div className={styles.asidePage}>
                            <ApplicationView counter={counter} setCounter={setCounter} openAppID={openAppID} setOpenAppID={setOpenAppID} />
                        </div>
                    ) : (
                        <></>
                    )
                }

            </main>
        ) : (
            <p style={{ textAlign: "center", marginTop: "12%" }}>Please select an application group at the top of the screen.</p>
        )
    )
}