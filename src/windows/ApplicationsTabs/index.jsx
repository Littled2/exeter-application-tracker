import { useEffect, useState } from "react";
import { AcceptedDeclined } from "../../components/ApplicationsList/AcceptedDeclined";
import { Applied } from "../../components/ApplicationsList/Applied";
import { IdeasApplying } from "../../components/ApplicationsList/IdeaApplying";
import { Tabs } from "../../components/Tabs";
import { usePocket } from "../../contexts/pocketContext";
import { useActiveYear } from "../../contexts/activeYearContext";
import { useMasterCounter } from "../../contexts/masterCounterContext";

export function ApplicationsTabs({ setOpenAppID, openAppID }) {

    const { pb } = usePocket()

    const { activeYear } = useActiveYear()

    const { masterCounter } = useMasterCounter()

    const [ ideaApplying, setIdeaApplying ] = useState(0)
    const [ applied, setApplied ] = useState(0)
    const [ acceptedDeclined, setAcceptedDeclined ] = useState(0)

    useEffect(() => {
        pb.collection("stageBreakdown").getFullList({ filter: `year = "${activeYear}"` })
        .then(totals => {

            let idea = 0
            
            if(totals.filter(t => t.stage === "idea").length > 0) {
                idea = totals.filter(t => t.stage === "idea")[0].count
            }

            let applying = 0
            if(totals.filter(t => t.stage === "applying").length > 0) {
                applying = totals.filter(t => t.stage === "applying")[0].count
            }

            let applied = 0
            if(totals.filter(t => t.stage === "applied").length > 0) {
                applied = totals.filter(t => t.stage === "applied")[0].count
            }

            let accepted = 0
            if(totals.filter(t => t.stage === "accepted").length > 0) {
                accepted = totals.filter(t => t.stage === "accepted")[0].count
            }

            let declined = 0
            if(totals.filter(t => t.stage === "declined").length > 0) {
                declined = totals.filter(t => t.stage === "declined")[0].count
            }



            setIdeaApplying(idea + applying)
            setApplied(applied)
            setAcceptedDeclined(accepted + declined)
        })
        .catch(err => console.error("Error getting total types by year", err))
    }, [ activeYear, masterCounter ])

    return (
        <Tabs mobileTop={"var(--header-height)"} saveActiveTabAs={'application_tabs'} tabs={[
            {
                name: `Idea / Applying ${ideaApplying ? `(${ideaApplying})` : ""}`,
                tab: <IdeasApplying openAppID={openAppID} setOpenAppID={setOpenAppID} />
            },
            {
                name: `Applied ${applied ? `(${applied})` : ""}`,
                tab: <Applied openAppID={openAppID} setOpenAppID={setOpenAppID} />
            },
            {
                name: `Accepted / Declined ${acceptedDeclined ? `(${acceptedDeclined})` : ""}`,
                tab: <AcceptedDeclined openAppID={openAppID} setOpenAppID={setOpenAppID} />
            }
        ]} />
    )
}