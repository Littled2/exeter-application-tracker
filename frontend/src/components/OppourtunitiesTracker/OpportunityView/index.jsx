import styles from "./styles.module.css"

import { useEffect, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import { BiX } from "react-icons/bi"
import { Popup } from "../../Popup"
import { LiaEdit } from "react-icons/lia"
import { EditOpportunityForm } from "../../forms/EditOpportunity"

export function OpportunityView({ openOpportunityID, setOpenOpportunityID }) {

    const { pb } = usePocket()

    const [ opp, setOpp ] = useState()
    const [ edit, setEdit ] = useState(false)

    useEffect(() => {

        pb.collection("opportunities").getOne(openOpportunityID)
        .then(res => setOpp(res))
        .catch(err => console.error("Error getting specific opportunity", err))

    }, [ openOpportunityID ])
    
    return (
        <>
            <section className={styles.wrapper}>
                <div className={styles.top}>
                    <button onClick={() => setEdit(true)}><LiaEdit /></button>
                    <button onClick={() => setOpenOpportunityID(null)}><BiX /></button>
                </div>
                <div className={styles.inner}>
                    <h3>{opp?.name}</h3>
                    <hr />
                    <p>{opp?.info}</p>
                </div>
            </section>

            <Popup title={"Edit Opportunity"} setTrigger={setEdit} trigger={edit}>
                <EditOpportunityForm opp={opp} setTrigger={setEdit} />
            </Popup>
        </>
    )
}