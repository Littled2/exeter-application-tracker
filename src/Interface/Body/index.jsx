import { useState } from "react"
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


export function Body({ counter, setCounter }) {

    const [ openAppID, setOpenAppID ] = useState(null)
    const { setNewApplicationPopupOpen } = useNewApplicationPopup()

    const { activeYear } = useActiveYear()
    const { user } = usePocket()

    return (
        activeYear ? (
            <main className={[ "flex gap-m", styles.wrapper ].join(' ')}>

                <div className={styles.applicationsTasksWrapper}>

                    <div className={styles.dataVisWrapper}>

                        {
                            user?.locationsView && (
                                <LocationView />
                            )
                        }

                        {
                            user?.stagesView && (
                                !openAppID ? (
                                    <StageBreakdown />
                                ) : (
                                    <></>
                                )
                            )
                        }

                        {
                            user?.deadlinesView && (
                                <DeadlinesOverView openAppID={openAppID} setOpenAppID={setOpenAppID} />
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

                    <div className={styles.tablesWrapper}>
                        <div className={styles.applicationsWrapper} style={{ height: "calc(100vh - 300px)" }}>
                            <div className="m-show-flex align-center space-between">
                                <h3>Your Applications</h3>
                                <button onClick={() => setNewApplicationPopupOpen(true)} className={styles.mobileNewAppBtn}><BsPlus /></button>
                            </div>
                            <ApplicationsTabs setOpenAppID={setOpenAppID} openAppID={openAppID} />
                        </div>

                        {
                            !openAppID ? (
                                <div className={styles.tasksWrapper}>
                                    {/* <b>-</b> */}
                                    <h3 className="m-show-block">Your tasks</h3>
                                    <p className="m-show-block text-grey">Open an application to add a task</p>
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