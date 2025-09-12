import { useCallback, useEffect, useRef, useState } from "react";
import { Confirm } from "../../forms/Confirm"
import { CopyText } from "../../CopyText";
import { Tabs } from "../../Tabs";
import { usePocket } from "../../../contexts/pocketContext";

import styles from "./styles.module.css"


export function CalendarManager() {

    const [ regenerateOpen, setRegenerateOpen ] = useState(false)

    const { user, pb } = usePocket()

    useEffect(() => console.log(process.env.REACT_APP_CALENDER_URL), [])

    const linkPrefix = useRef(process.env.REACT_APP_CALENDER_URL + "/cal/")

    const toWebcalUrl = useCallback(url => {
        return url.replace(/^https?:\/\//, "webcal://")
    })

    const regenerateCalToken = useCallback(() => {
        pb.collection("users").update(user?.id, { calendarToken: '' })
    }, [ pb ])

    return (
        <div className={styles.tab}>
            <h4 className="text-white">Add deadlines to personal calendar</h4>

            <ol className="text-grey" style={{ paddingLeft: "1.5rem", lineHeight: "1.6" }}>
                <li>Open your preferred calendar app (Google Calendar, Apple Calendar, Outlook, etc.).</li>
                <li>Look for an option to Add Calendar by URL or Subscribe to Calendar.</li>
                <li>Paste the below link into the field provided and confirm.</li>
                <li>Your calendar will automatically stay updated with any new deadlines we add.</li>
            </ol>


            <Tabs
                tabs={[
                    {
                        name: "🗓️ Apple Calendar",
                        tab: (
                            <div className={styles.tabInner}>
                                <CopyText text={toWebcalUrl(linkPrefix.current) + user?.calendarToken} />
                            </div>
                        )
                    },
                    {
                        name: (
                            <div className="flex align-center gap-s">
                                <img src="/google-calendar-logo.png" alt="Google calendar logo" className="icon" />
                                <span>Google Calendar</span>
                            </div>
                        ),
                        tab: (
                            <div className={styles.tabInner}>
                                <CopyText text={linkPrefix.current + user?.calendarToken} />
                            </div>
                        )
                    }
                ]}
            />

            {/* <small className="text-grey text-center">Once copied, follow the steps above to subscribe using your calendar app.</small> */}

            <p className="text-white text-center">Anyone with this link can view your deadlines calendar. <br /> To re-generate your link <span onClick={() => setRegenerateOpen(true)} className="cursor-pointer underline text-blue">click here</span></p>

            <Confirm
                title={"Regenerate calendar link"}
                trigger={regenerateOpen}
                setTrigger={setRegenerateOpen}
                onConfirm={regenerateCalToken}
                message={"Are you sure you want to re-generate your calendar link? Your old link will no longer work"}
            />

        </div>
    )
}