import { useEffect, useState } from "react"
import { usePocket } from "../../contexts/pocketContext"
import { useMasterCounter } from "../../contexts/masterCounterContext"
import { Deadline } from "../../components/Deadline"
import { useActiveYear } from "../../contexts/activeYearContext"
import { daysToDate } from "../../helpers/dates"
import { useMobile } from "../../contexts/mobileContext"

export function UpcomingDeadlines({ setOpenAppID }) {

    const [ upcoming, setUpcoming ] = useState([])
    const { pb } = usePocket()
    const { masterCounter } = useMasterCounter()
    const { activeYear } = useActiveYear()
    const { setActiveMobileTab } = useMobile()
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {

        const currentDate = new Date();
        const tenDaysLater = new Date();
        tenDaysLater.setDate(currentDate.getDate() + 10);

        setLoading(true)

        pb.collection("applications").getFullList({
            filter: `(stage='idea' || stage='applying') && deadline >= '${currentDate.toISOString()}' && deadline <= '${tenDaysLater.toISOString()}'`,
            sort: 'deadline',
            expand: "organisation"
        })
        .then(res => {
            setUpcoming(res)
            setLoading(false)
        })
        .catch(err => {
            console.error("Error getting upcoming deadlines", err)
            setLoading(false)
        })
    }, [ masterCounter, activeYear ])

    return !loading ? (
        <div className="flex flex-col gap-s">
            {
                upcoming.map(app => {
                    return (
                        <div key={"___" + app?.id} className="flex space-between" onClick={() => {
                            // setActiveMobileTab("applications")
                            setOpenAppID(app?.id)
                        }}>
                            <p>{app?.expand?.organisation?.name}</p>
                            <div className="flex flex-col">
                                <p><Deadline deadline={app?.deadline} /></p>
                                <small className="text-grey">{daysToDate(app?.deadline)}</small>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    ) : (
        <p className="text-center text-grey">Loading...</p>
    )
}