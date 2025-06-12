import { useEffect, useRef, useState } from "react"
import styles from "./styles.module.css"
import { useActiveYear } from "../../../contexts/activeYearContext.jsx"
import { usePocket } from "../../../contexts/pocketContext.jsx"
import { useMasterCounter } from "../../../contexts/masterCounterContext.jsx"
import { DayPicker } from "react-day-picker"
import { areSameDate } from "../../../helpers/dates.js"

import 'react-day-picker/style.css';
import { Tooltip } from "react-tooltip"
import { Confirm } from "../../../components/forms/Confirm/index.jsx"
import { BsEye } from "react-icons/bs"
import { useMobile } from "../../../contexts/mobileContext.jsx"
import { IoCalendar, IoCheckmark } from "react-icons/io5"
import { Popup } from "../../../components/Popup/index.jsx"


export function DeadlinesOverView({ openAppID, setOpenAppID }) {

    const { user, pb } = usePocket()
    const { masterCounter } = useMasterCounter()
    const { activeYear } = useActiveYear()
    const { isMobile } = useMobile()
    const [ err, setErr ] = useState(null)
    const [ modifiers, setModifiers ] = useState()
    const [ upcomingDeadlines, setUpcomingDeadlines ] = useState([])
    const [ hideConfirmOpen, setHideConfirmOpen ] = useState(false)
    const [ addToCalOpen, setAddToCalOpen ] = useState(false)

    const [ copied, setCopied ] = useState(false)
    const calLink= useRef(process.env.REACT_APP_BACKEND_URL + "/cal/" + user?.id)

    useEffect(() => {
        if(copied) {
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        }
    }, [ copied ])


    useEffect(() => {

        pb.collection("upcomingDeadlines").getFullList({
            filter: `year = '${activeYear}'`
        })
        .then(res => {
            setErr(null)
            setUpcomingDeadlines(res)
            const today = new Date()
            today.setHours(0, 0, 0, 0);
            setModifiers({
                missedDeadlines: res.filter(doc => new Date(doc?.deadline) < today && (doc.stage === "idea" || doc.stage === "applying")).map(day => new Date(day.deadline)),
                pastDeadlines: res.filter(doc => new Date(doc?.deadline) < today && (doc.stage === "applied" || doc.stage === "accepted" || doc.stage === "declined") ).map(day => new Date(day.deadline)),
                futureDeadlines: res.filter(doc => new Date(doc?.deadline) >= today).map(doc => new Date(doc.deadline))
                // dueMoreThanThreeDays: res.filter(doc => (new Date(doc?.deadline) - today) > 3 * 24 * 60 * 60 * 1000).map(day => new Date(day.deadline)),
                // dueThreeDays: res.filter(doc => (new Date(doc?.deadline) - today) <= 3 * 24 * 60 * 60 * 1000 && (new Date(doc?.deadline) - today) > 24 * 60 * 60 * 1000).map(day => new Date(day.deadline)),
                // dueToday: res.filter(doc => areSameDate(new Date(), new Date(doc?.deadline))).map(day => new Date(day.deadline))
            })
        })
        .catch(err => {
            console.error("Error fetching deadlines", err)
            setErr(err)
        })
    }, [ masterCounter, activeYear ])
    

    const handleDayClick = (day, modifiers) => {
        if (modifiers.missedDeadlines || modifiers.pastDeadlines || modifiers.futureDeadlines) {

            let applications = upcomingDeadlines.filter(doc => areSameDate(new Date(doc.deadline), day))

            if(applications.length === 0) return

            setOpenAppID(applications[0].id)

        }
    }

    function hideComponent() {
        pb.collection("users").update(user.id, {
            deadlinesView: false
        })
        .then(() => {
            console.log("Hid deadlines card")
         })
         .catch(err =>{
             console.error("Something west wrong hiding deadlines card", err)
         })
    }
    
    return !err ? (
        <div className={[ styles.wrapper, openAppID ? styles.hide : '' ].join(' ')}>
            <div className="flex space-between align-center m-hide">
                <b><small className="text-grey">Upcoming Deadlines</small></b>

                <span
                    className="cursor-pointer text-grey hover-text-orange"
                    data-tooltip-id="hide-deadlines-view-tooltip"
                    data-tooltip-content="Hide deadlines view"
                    data-tooltip-place="bottom"
                    onClick={() => setHideConfirmOpen(true)}
                >
                    <BsEye />
                </span>

                <Tooltip id="hide-deadlines-view-tooltip" />

                <Confirm trigger={hideConfirmOpen} setTrigger={setHideConfirmOpen} onConfirm={hideComponent} message={"Are you sure you want to hide this component? You can always un-hide it in Settings > Dashboard menu"} />

            </div>

            <div className={styles.inner}>
                <DayPicker
                    style={{ maxWidth: "100%" }}
                    modifiers={modifiers}
                    // captionLayout="dropdown-months"
                    modifiersStyles={{
                        missedDeadlines: { backgroundColor: "var(--missed-deadline-bg)" },
                        pastDeadlines: { backgroundColor: "var(--passed-deadline-bg)" },
                        futureDeadlines: { backgroundColor: "var(--upcoming-deadline-bg)" }
                    }}
                    classNames={{
                        today: "text-orange",
                        chevron: "cal-chevron"
                    }}
                    styles={{
                        root: { color: 'var(--text-grey)' }
                    }}
                    onDayClick={handleDayClick}
                    captionLayout={isMobile ? "dropdown" : "label"}
                />
            </div>

            <div className="flex gap-s justify-center">
                <span className={styles.past}>Past</span>
                <span className={styles.missed}>Missed</span>
                <span className={styles.upcoming}>Upcoming</span>
            </div>
            
            <small onClick={() => setAddToCalOpen(true)} className="flex align-center gap-s text-blue cursor-pointer">
                <IoCalendar />
                <span>Sync with calendar</span>
            </small>

            <Popup title={"Sync with personal calendar"} trigger={addToCalOpen} setTrigger={setAddToCalOpen}>
                <div className="flex flex-col gap-m form">
                    <h4 className="text-white">Add deadlines to personal calendar</h4>

                    <ol className="text-grey" style={{ paddingLeft: "1.5rem", lineHeight: "1.6" }}>
                        <li>Open your preferred calendar app (Google Calendar, Apple Calendar, Outlook, etc.).</li>
                        <li>Look for an option to Add Calendar by URL or Subscribe to Calendar.</li>
                        <li>Paste the copied link into the field provided and confirm.</li>
                        <li>Your calendar will automatically stay updated with any new deadlines we add.</li>
                    </ol>

                    <div className="flex">
                        <input value={calLink.current} type="text" readOnly={true} />
                        <button
                            className="m-submit-btn"
                            style={{
                                backgroundColor: copied ? 'var(--text-green)' : '',
                                color: copied ? 'white' : ''
                            }}
                            onClick={() =>{
                                navigator.clipboard.writeText(calLink.current)
                                .then(() => {
                                    setCopied(true)
                                })
                            }}
                        >
                            {
                                !copied ? (
                                    "Copy"
                                ) : (
                                    <IoCheckmark />
                                )
                            }
                        </button>
                    </div>

                    <p className="text-grey">Once copied, follow the steps above to subscribe using your calendar app.</p>
                </div>
            </Popup>

        </div>
    ) : (
        <p style={{color:"red"}}>Error</p>
    )
}