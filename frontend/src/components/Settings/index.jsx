import { useState } from "react"
import { Tabs } from "../Tabs"
import { Account } from "./Account"
import { DashboardManager } from "./DashboardManager"
import { GroupsManager } from "./GroupsManager"
import { LocationsManager } from "./LocationsManager"
import { OrganisationsManager } from "./OrganisationsManager"

import styles from "./styles.module.css"
import { useMobile } from "../../contexts/mobileContext"
import { useRecapPopupContext } from "../../contexts/recapPopupContext"
import { useTutorial } from "../../contexts/tutorialContext"
import { CalendarManager } from "./CalendarManager"


export function Settings({ setTrigger }) {

    const [ tab, setTab ] = useState(0)

    const { isMobile } = useMobile()

    const { setRecapPopupOpen } = useRecapPopupContext()

    const { startTutorial } = useTutorial()

    return !isMobile ? (
        <>
        
            <section className={styles.wrapper}>

                <div className={styles.nav}>
                    <button className={tab === 0 && styles.selected} onClick={() => setTab(0)}>Groups</button>
                    <button className={tab === 1 && styles.selected} onClick={() => setTab(1)}>Locations</button>
                    <button className={tab === 2 && styles.selected} onClick={() => setTab(2)}>Organisations</button>
                    <button className={tab === 3 && styles.selected} onClick={() => setTab(3)}>Appearance</button>
                    <button className={tab === 4 && styles.selected} onClick={() => setTab(4)}>Account</button>
                    <button className={tab === 5 && styles.selected} onClick={() => setTab(5)}>Calendar</button>
                    <button onClick={() => { setTrigger(false); startTutorial() }}>Tutorial</button>
                    <button onClick={() => setRecapPopupOpen(true)}>Your Stats 🥳</button>
                </div>
                
                <div className="flex-1">
                    {
                        tab === 0 && (
                            <div className="flex flex-col gap-m">
                                <GroupsManager />
                            </div>
                        )
                    }
                    {
                        tab === 1 && (
                            <div className="flex flex-col gap-m">
                                <LocationsManager />
                            </div>
                        )
                    }
                                        {
                        tab === 2 && (
                            <div className="flex flex-col gap-m">
                                <OrganisationsManager />
                            </div>
                        )
                    }
                    {
                        tab === 3 && (
                            <div className="flex flex-col gap-m">
                                <DashboardManager />
                            </div>    
                        )
                    }
                    {
                        tab === 4 && (
                            <div className="flex flex-col gap-m">
                                <Account setTrigger={setTrigger} />
                            </div>
                        )
                    }
                    {
                        tab === 5 && (
                            <div className="flex flex-col gap-m">
                                <CalendarManager />
                            </div>
                        )
                    }
                </div>

            </section>
        </>
    ) : (
        <Tabs
            saveActiveTabAs={"_mobileSettingsTabs"}
            mobilePadding={true}
            tabs={[
                {
                    name: "Groups",
                    tab: <GroupsManager />,
                },
                {
                    name: "Locations",
                    tab: <LocationsManager />
                },
                {
                    name: "Organisations",
                    tab: <OrganisationsManager />
                },
                {
                    name: "Dashboard",
                    tab: <DashboardManager />,
                    hideOnMobile: true
                },
                {
                    name: "Account",
                    tab: <Account setTrigger={setTrigger} />
                }
            ]}
        />
    )
}