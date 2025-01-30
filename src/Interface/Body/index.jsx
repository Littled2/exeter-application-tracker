import { useState } from "react"
import { ApplicationView } from "../../windows/ApplicationView"
import { LocationView } from "../../windows/LocationView"
import { DeadlinesOverView } from "../../windows/DeadlinesOverView"
import { StageBreakdown } from "../../windows/StageBreakdown"
import styles from "./styles.module.css"
import { ApplicationsTabs } from "../../windows/ApplicationsTabs"
import { useActiveYear } from "../../contexts/activeYearContext"

import 'react-day-picker/style.css';
import { usePocket } from "../../contexts/pocketContext"
import { BsPlus } from "react-icons/bs"
import { useNewApplicationPopup } from "../../contexts/newApplicationPopupContext"
import { useMobile } from "../../contexts/mobileContext"
import { UpcomingDeadlines } from "../../windows/UpcomingDeadlines"
import { TasksWrapper } from "../TasksWrapper"


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
                                    ((!isMobile && user?.deadlinesView) || (isMobile && activeMobileTab === 'deadlines')) && (
                                        <>
                                            {
                                                isMobile && (
                                                    <UpcomingDeadlines setOpenAppID={setOpenAppID} />
                                                )
                                            }

                                            <h3 className="m-show-block text-white">Next Deadlines</h3>

                                            <DeadlinesOverView openAppID={openAppID} setOpenAppID={setOpenAppID} />
                                        </>
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
                                    ((!isMobile && user?.locationsView) || (isMobile && activeMobileTab === 'analytics')) && (
                                        <LocationView />
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

                                        <h3 className="text-grey m-hide line-height-1">Your Applications</h3>

                                        <ApplicationsTabs setOpenAppID={setOpenAppID} openAppID={openAppID} />
                                    </div>
                                )
                            }


                            {
                                ((!isMobile && !openAppID) || (isMobile && activeMobileTab === 'tasks')) ? (
                                    <TasksWrapper setOpenAppID={setOpenAppID} />
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