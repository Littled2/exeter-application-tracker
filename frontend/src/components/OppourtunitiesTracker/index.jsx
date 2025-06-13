import styles from "./styles.module.css"
import { Tabs } from "../Tabs";
import { OpportunitiesCompleteList } from "./OpportunitiesCompleteList";
import { OpportunitiesIdeasList } from "./OpportunitiesIdeasList";
import { OpportunityView } from "./OpportunityView";
import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { Popup } from "../Popup";
import { NewOpportunityForm } from "../forms/NewOpportunity";

export function OpportunitiesTracker() {

    const [ newOpen, setNewOpen ] = useState(false)

    const [ openID, setOpenID ] = useState()

    return (
        <>
            <div className={styles.opportunityWrapper}>
                <div>
                    <div className={styles.table}>
                        <Tabs tabs={[
                            {
                                name: "Potential Ideas",
                                tab: <OpportunitiesIdeasList setOpenID={setOpenID} />
                            },
                            {
                                name: "Complete",
                                tab: <OpportunitiesCompleteList setOpenID={setOpenID} />
                            }
                        ]} />
                    </div>

                    <br />

                    <button className={styles.btn} onClick={() => setNewOpen(true)}>New Opportunity <BiPlus /></button>
                </div>

                <div className={styles.openOpportunity}>
                    {
                        openID ? (
                            <OpportunityView openOpportunityID={openID} setOpenOpportunityID={setOpenID} />
                        ) : (
                            <></>
                        )
                    }
                </div>
            </div>

            <Popup title={"New Opportunity"} setTrigger={setNewOpen} trigger={newOpen}>
                <NewOpportunityForm setTrigger={setNewOpen} />
            </Popup>
        </>
    )
}