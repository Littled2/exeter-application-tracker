import { useCallback, useEffect, useState } from "react"
import styles from "./styles.module.css"
import { Popup } from "../../components/Popup"
import { EditApp } from "../../components/forms/EditApp"
import { AiOutlineClose, AiOutlineDelete } from "react-icons/ai"
import { usePocket } from "../../contexts/pocketContext"
import { DocumentUploadDownload } from "./DocumentUploadDownload"
import { useActiveYear } from "../../contexts/activeYearContext"
import { Confirm } from "../../components/forms/Confirm"
import { BiChevronLeft, BiPencil } from "react-icons/bi"
import { usePopupsContext } from "../../contexts/popupsContext"
import { useMasterCounter } from "../../contexts/masterCounterContext"
import { Deadline } from "../../components/Deadline"
import { useMobile } from "../../contexts/mobileContext"
import { EditAppInfo } from "../../components/forms/EditAppInfo"
import { FiEdit } from "react-icons/fi"
import { InputInformation } from "../../components/InputInformation"
import { IoLocationOutline } from "react-icons/io5"
import { indexDB } from "../../components/db"
import useOnlineStatus from "../../hooks/useOnlineStatus"
import { MdSignalWifiConnectedNoInternet0 } from "react-icons/md"
import { celebrateConfetti } from "../../helpers/particle-effects"
import { Tooltip } from "react-tooltip"





export function ApplicationView({ openAppID, setOpenAppID, counter, setCounter }) {

    const { setPopups, openPopup } = usePopupsContext()

    useEffect(() => {
        if(openAppID) {
            openPopup(setOpenAppID, new Date().getTime().toString())
        } else {
            // setPopups(prev => prev.filter(item => item !== setOpenAppID))
        }
    }, [ openAppID ])

    const [ application, setApplication ] = useState({})
    const [ err, setErr ] = useState(false)
    const [ loading, setLoading ] = useState(true)

    const [ editAppOpen, setEditAppOpen ] = useState()
    const [ confirmOpen, setConfirmOpen ] = useState(false)
    const [ editInfoOpen, setEditInfoOpen ] = useState(false)

    const [ closing, setClosing ] = useState(false)
    const [ opening, setOpening ] = useState(true)

    const { activeYear } = useActiveYear()
    const isOnline = useOnlineStatus()

    const { pb } = usePocket()

    const { setMasterCounter, masterCounter } = useMasterCounter()

    const { isMobile } = useMobile()

    const [ uploadCVReminder, setUploadCVReminder ] = useState(false)

    useEffect(() => {
        if(!isMobile) {
            setTimeout(() => {
                setOpening(false)
            }, 300);
        } else {
            setOpening(true)
        }
    }, [])

    useEffect(() => {

        if(!openAppID) return

        setLoading(true)

        // Fetch the application
        if(isOnline) {

            // Fetch the record
            pb.collection("applications").getOne(openAppID, { expand:"locations, organisation" })
            .then(app => {
    
                // If the year has changed, close the tab
                if(activeYear !== app.year) {
                    setOpenAppID(null)
                }
    
                setApplication(app)
                setCounter(c => c + 1)
            })
            .catch(err => {
                console.error("Error getting application", err)
                setErr(true)
            })
            .finally(() => {
                setLoading(false)
            })
    
            // Subscribe to changes
            pb.collection("applications").subscribe("*", e => {
                setApplication(e.record)
            }, { expand:"locations, organisation" })

        } else {

            // If offline, fetch the application from indexDB
            indexDB.applications.get(openAppID)
            .then(setApplication)
            .catch(err => {
                console.error("Error getting application from indexDB", err)
                setErr(true)
            })
            .finally(() => setLoading(false))

        }

        return () => {
            pb.collection('applications').unsubscribe()
        }
        
    }, [ openAppID, activeYear, masterCounter ])


    const getHostname = (link) => {
        try {
            return (new URL(link)).hostname
        } catch (error) {
            return "Invalid link"
        }
    }



    const deleteApplication = useCallback(() => {
        pb.collection('applications').delete(openAppID)
        .then(() => {
            setOpenAppID(null)
            setMasterCounter(c => c + 1)
        })
        .catch(err => {
            console.error("Error deleting application", err)
            alert("Error deleting application. See console devtools for more information.")
        })
    }, [ pb, openAppID ])

    // const handleKeyPress = useCallback(e => {
    //     if(e.key === "Delete") {
    //         e.preventDefault()
    //         e.stopPropagation()
    //         setConfirmOpen(true)
    //     }
    // }, [ setConfirmOpen ])

    // useEffect(() => {
    //     // attach the event listener
    //     document.addEventListener('keydown', handleKeyPress)

    //     // remove the event listener
    //     return () => {
    //         document.removeEventListener('keydown', handleKeyPress)
    //     }
    // }, [handleKeyPress])

    function handleStageChange(e) {

        // Show upload CV reminder when finished applying
        if((application.stage === 'idea' || application.stage === 'applying') && e.target.value === 'applied') {

            const lastReminder = localStorage.getItem("lastRemindedAboutFileUpload")

            // If user was reminded within the last 5 minutes, do not remind again
            if(!lastReminder || (new Date().getTime() - lastReminder) > (1000 * 60 * 5)) {
                setUploadCVReminder(true)
            }

            localStorage.setItem("lastRemindedAboutFileUpload", new Date().getTime())
        }

        // Show confetti when a user gets accepted
        if((application.stage === 'idea' || application.stage === 'applying' || application.stage === 'applied') && e.target.value === 'accepted') {
            celebrateConfetti()
        }

        // Update the record
        pb.collection("applications").update(application.id, { stage: e.target.value })
        .then(() => {
            setMasterCounter(c => c + 1)
        })
        .catch(err => {
            console.error("Something went wrong whilst setting application stage", err)
        })
    }

    return (
        <section className={[ styles.window, opening ? styles.enter : '', closing ? styles.exit : '' ].join(' ')}>
            <div className={styles.topBar}>

                {
                    isOnline ? (
                        <div className="flex gap-s">
                            <button
                                className={styles.close}
                                data-tooltip-id="delete-application-tooltip"
                                data-tooltip-content="Delete application"
                                data-tooltip-place="bottom"
                                onClick={() => setConfirmOpen(true)}
                            >
                                <AiOutlineDelete />
                            </button>
                            <Tooltip id="delete-application-tooltip" />
                            <button
                                className={styles.close}
                                data-tooltip-id="edit-application-tooltip"
                                data-tooltip-content="Edit application"
                                data-tooltip-place="bottom"
                                onClick={() => setEditAppOpen(true)}
                            >
                                <FiEdit />
                            </button>
                            <Tooltip id="edit-application-tooltip" />
                        </div>
                    ) : (
                        <div className="flex align-center gap-s">
                            <MdSignalWifiConnectedNoInternet0 />
                            <small>You are offline</small>
                        </div>
                    )
                }

                <button
                    className={styles.close}
                    onClick={() => {
                        setClosing(true)
                        if(!isMobile) {
                            setTimeout(() => {
                                setOpenAppID(null)
                            }, 300)
                        } else {
                            setOpenAppID(null)
                        }
                    }}
                >
                    {
                        !isMobile ? (
                            <AiOutlineClose />
                        ) : (
                            <BiChevronLeft />
                        )
                    }
                </button>
            </div>

            <div className={styles.inner}>
                {
                    !err ? (
                        !loading ? (
                            <div className="flex col gap-m">

                                <div>
                                    <div className="text-white flex align-center space-between gap-s">
                                        <div className={styles.top}>
                                            <h4>{application?.expand?.organisation?.name}</h4>
                                            <p className="text-grey">{application?.role}</p>
                                        </div>
                                        {/* <h4 className="cursor-pointer hover-text-orange text-white" onClick={() => setEditAppOpen(true)}><FiEdit /></h4> */}
                                    </div>
                                    <hr className={styles.hr}/>
                                </div>

                                <Popup title={"Edit Application"} trigger={editAppOpen} setTrigger={setEditAppOpen}>
                                    <EditApp setTrigger={setEditAppOpen} app={application}/>
                                </Popup>

                                <div className="flex gap-m m-flex-col m-gap-0">
                                    <table>
                                        <tbody>
                                            {/* <tr>
                                                <td className="text-white">Company</td>
                                                <td className={styles.mobileTextRight}>{application?.expand?.organisation?.name}</td>
                                            </tr> */}
                                            <tr>
                                                {
                                                    application?.deadlineType === "fixed" ? (
                                                        <>
                                                            <td className="text-white" style={{ alignContent: "baseline" }}>Deadline</td>
                                                            <td className="text-right" style={{ alignContent: "baseline" }}>{application?.deadline ? <Deadline highlight={application?.stage === "idea" || application?.stage === "applying"} deadline={application?.deadline} /> : "-"}</td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td className="text-white" style={{ alignContent: "baseline" }}>Deadline</td>
                                                            <td className="text-right text-grey" style={{ alignContent: "baseline" }}>{application?.deadlineType}</td>
                                                        </>
                                                    )
                                                }
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table>
                                        <tbody>
                                            {/* <tr>
                                                <td className="text-white">Deadline Type</td>
                                                <td className={styles.mobileTextRight}>{application?.deadlineType ? application?.deadlineType : "-"}</td>
                                            </tr> */}

                                            <tr>
                                                <td className="text-white" style={{ verticalAlign: "top" }}>Location(s)</td>
                                                <td className="text-right">
                                                    {
                                                        application?.expand?.locations?.map((loc, i) => <span key={"____" + loc?.id}>{loc?.name}{i < application?.expand?.locations.length - 1 ? ", " : ""}</span>)
                                                    }
                                                    {
                                                        !application?.expand?.locations?.length && (
                                                            <small onClick={() => setEditAppOpen(true)} style={{ gap: "5px" }} className="justify-right text-blue flex align-center cursor-pointer">
                                                                <IoLocationOutline />
                                                                <span>Add location</span>
                                                            </small>
                                                        )
                                                    }
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex gap-m m-flex-col">
                                    <table>
                                        <tbody>
                                            <tr className={styles.documentRow}>
                                                <td className="text-white">CV</td>
                                                <td>
                                                    <DocumentUploadDownload displayName={"CV"} application={application} fileKeyName={"cv"} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table>
                                        <tbody>
                                            <tr className={styles.documentRow}>
                                                <td className="text-white">Cover Letter</td>
                                                <td>
                                                    <DocumentUploadDownload displayName={"Cover Letter"} application={application} fileKeyName={"coverLetter"} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex gap-s align-center">
                                        <p className="text-white">Application Stage</p>
                                        <InputInformation id={"quickAppStage"} place="bottom" text={"Indicates the current stage of your application process"} />
                                    </div>
                                    <div className={styles.stages}>
                                        {
                                            isOnline ? (
                                                <select value={application?.stage} onChange={handleStageChange} className={styles.stageSelect}>
                                                    <option value="idea">Idea</option>
                                                    <option value="applying">Applying</option>
                                                    <option value="applied">Applied</option>
                                                    <option style={{ color: "var(--text-green)" }} value="accepted">Accepted</option>
                                                    <option style={{ color: "var(--text-red)" }} value="declined">Declined</option>
                                                </select>
                                            ) : (
                                                <div className="flex gap-s align-center">
                                                <p className="text-orange">{application?.stage}</p>
                                                    <InputInformation id={"stageApplicationProcess"} place="bottom" text={"Cannot make changes. Device is offline."} />
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>

                                {
                                    application?.link && (
                                        <div>
                                            <p className="text-white">Link</p>
                                            <a className={styles.link} rel="noreferrer" target="_blank" href={application?.link}>
                                                {getHostname(application?.link)}
                                            </a>
                                        </div>
                                    )
                                }

                                <div>
                                    <div className="flex gap-s align-center">
                                        <p className="text-white">Notes</p>
                                        <>
                                            <span
                                                style={{ fontSize: "0.9rem" }}
                                                className="cursor-pointer text-grey simple-btn"
                                                data-tooltip-id="edit-notes-tooltip-1"
                                                data-tooltip-content="Edit notes"
                                                data-tooltip-place="bottom"
                                                onClick={() => setEditInfoOpen(true)}
                                            >
                                                <BiPencil />
                                            </span>

                                            <Tooltip id="edit-notes-tooltip-1" />
                                        </>
                                    </div>
                                    <pre
                                        className={styles.info}
                                        style={{fontFamily:"inherit", whiteSpace:"pre-wrap", wordWrap:"break-word", margin:"0" }}
                                        data-tooltip-id="edit-notes-tooltip-2"
                                        data-tooltip-content="Edit notes"
                                        data-tooltip-place="bottom"
                                        onClick={() => setEditInfoOpen(true)}
                                    >{application?.info}</pre>

                                    <Tooltip id="edit-notes-tooltip-2" />
                                </div>

                                {/* <div>
                                    <div>
                                        <h4 className="text-grey">Tasks</h4>
                                    </div>

                                    <AppTasksList counter={counter} setCounter={setCounter} application={application} />

                                </div> */}

                            </div>
                        ) : (
                            <div className={styles.loadingWrapper}>Loading...</div>
                        )    
                    ) : (
                        <p className="text-red">Error</p>
                    )
                    
                }

            </div>

            <Popup title={"Edit notes"} trigger={editInfoOpen} setTrigger={setEditInfoOpen}>
                <EditAppInfo app={application} appID={openAppID} setTrigger={setEditInfoOpen} />
            </Popup>

            <Popup trigger={uploadCVReminder} setTrigger={setUploadCVReminder}>
                <div className="flex flex-col gap-m">
                    <h3 className="text-white">Have you uploaded your CV?</h3>
                    <p className="text-grey">Save the version of your CV and/or cover letter that you sent to {application?.expand?.organisation?.name}.</p>

                    <div className="flex gap-l m-flex-col">
                        <table>
                            <tbody>
                                <tr className={styles.documentRow}>
                                    <td className="text-white">CV</td>
                                    <td>
                                        <DocumentUploadDownload displayName={"CV"} application={application} fileKeyName={"cv"} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table>
                            <tbody>
                                <tr className={styles.documentRow}>
                                    <td className="text-white">Cover Letter</td>
                                    <td>
                                        <DocumentUploadDownload displayName={"Cover Letter"} application={application} fileKeyName={"coverLetter"} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <button className="m-submit-btn" onClick={() => setUploadCVReminder(false)}>OK</button>
                </div>
            </Popup>

            <Confirm message={"Are you sure you want to delete this application?"} trigger={confirmOpen} setTrigger={setConfirmOpen} onConfirm={deleteApplication} />

        </section>
    )
}