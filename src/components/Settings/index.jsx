import { Tabs } from "../Tabs"
import { Account } from "./Account"
import { DashboardManager } from "./DashboardManager"
import { GroupsManager } from "./GroupsManager"
import { LocationsManager } from "./LocationsManager"
import { OrganisationsManager } from "./OrganisationsManager"

import styles from "./styles.module.css"


export function Settings({ setTrigger }) {

    return (
        <>
        
            <section className={styles.wrapper}>

                <Tabs
                    saveActiveTabAs={"settings_tabs"}
                    tabs={[
                        {
                            name: "Groups",
                            tab: <GroupsManager />
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

            </section>
        </>
    )
}