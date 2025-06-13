import { useCallback, useEffect, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"


export function OpportunitiesIdeasList({ setOpenID }) {

    const [ opportunities, setOpportunities ] = useState([])

    const { pb } = usePocket()

    const getOpps = useCallback(() => {
        pb.collection("opportunities").getFullList({ sort: "created", filter: "complete = false" })
        .then(opps => {
            setOpportunities(opps)
        })
        .catch(err => {
            console.error("Error getting incomplete opportunities", err)
        })
    }, [ pb, opportunities ])

    useEffect(() => {

        pb.collection("opportunities").subscribe("*", e => {
            getOpps()
        })

        getOpps()

    }, [])

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    {/* <th>Info</th> */}
                </tr>
            </thead>
            <tbody>
                {
                    opportunities.map(opp => {
                        return (
                            <tr onClick={() => setOpenID(opp.id)}>
                                <td>{opp?.name}</td>
                                {/* <td>{opp?.info}</td> */}
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}