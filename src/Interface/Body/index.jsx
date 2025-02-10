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
import { InputInformation } from "../../components/InputInformation"


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
                        // If mobile device and user is viewing the applications or analytics page
                        !(isMobile && activeMobileTab !== 'applications' && activeMobileTab !== 'analytics' && activeMobileTab !== "deadlines") && (

                            <div className={[ styles.dataVisWrapper, (isMobile && activeMobileTab === "deadlines") ? styles.mobileDeadlinesViewActive : '' ].join(" ")}>

                                {
                                    ((!isMobile && user?.deadlinesView) || (isMobile && activeMobileTab === 'deadlines')) && (
                                        <>
                                            {
                                                isMobile && (
                                                    <div className="m-show-flex flex-col gap-s">
                                                        <h4 className="text-white">Next 10 days</h4>

                                                        <UpcomingDeadlines setOpenAppID={setOpenAppID} />
                                                    </div>
                                                )
                                            }

                                            <DeadlinesOverView openAppID={openAppID} setOpenAppID={setOpenAppID} />
                                        </>
                                    )
                                }
        
                                {
                                    ((!isMobile && user?.stagesView) || (isMobile && (activeMobileTab === 'applications' || activeMobileTab === 'analytics'))) && (
                                        !openAppID ? (
                                            <StageBreakdown />
                                        ) : (
                                            <></>
                                        )
                                    )
                                }

                                {
                                    ((!isMobile && user?.locationsView) || (isMobile && (activeMobileTab === 'applications' || activeMobileTab === 'analytics'))) && (
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

                                        <h3 className="text-grey line-height-1 flex gap-s align-center m-justify-center">
                                            {
                                                !isMobile && (
                                                    <InputInformation id={"YourApplications"} text={"Track applications to internships, jobs, and placements"} />       
                                                )
                                            }
                                            <span>Your Applications</span>
                                            <button onClick={() => setNewApplicationPopupOpen(true)} style={{ padding: "0" }} className={[ "text-orange simple-btn", styles.newAppBtn ].join(" ")}>+</button>
                                        </h3>

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