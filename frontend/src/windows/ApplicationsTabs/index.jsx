import { useEffect, useState } from "react";
import { AcceptedDeclined } from "../../components/ApplicationsList/AcceptedDeclined";
import { Applied } from "../../components/ApplicationsList/Applied";
import { IdeasApplying } from "../../components/ApplicationsList/IdeaApplying";
import { Tabs } from "../../components/Tabs";
import { usePocket } from "../../contexts/pocketContext";
import { useActiveYear } from "../../contexts/activeYearContext";
import { useMasterCounter } from "../../contexts/masterCounterContext";

function getCountAtStage(totals, stage) {
    return totals.find(t => t.stage === stage)?.count || 0
}

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

            // Calculate totals for each stage
            let idea = getCountAtStage(totals, "idea")

            let applying = getCountAtStage(totals, "applying")

            let applied = getCountAtStage(totals, "applied")

            let accepted = getCountAtStage(totals, "accepted")

            let declined = getCountAtStage(totals, "declined")


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