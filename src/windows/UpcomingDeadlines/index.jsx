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

        // const currentDate = new Date();
        // const tenDaysLater = new Date();
        // tenDaysLater.setDate(currentDate.getDate() + 10);

        const currentDate = new Date();
        const todayISO = currentDate.toISOString().split('T')[0]; // Get only YYYY-MM-DD
        const tenDaysLater = new Date();
        tenDaysLater.setDate(currentDate.getDate() + 10);
        const tenDaysLaterISO = tenDaysLater.toISOString().split('T')[0]; // Get only YYYY-MM-DD

        setLoading(true)

        pb.collection("applications").getFullList({
            // filter: `(stage='idea' || stage='applying') && deadline >= '${currentDate.toISOString()}' && deadline <= '${tenDaysLater.toISOString()}' && year = '${activeYear}'`,
            filter: `(stage='idea' || stage='applying') && deadline >= '${todayISO}' && deadline <= '${tenDaysLaterISO}' && year = '${activeYear}'`,
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
                            <div>
                                <p>{app?.expand?.organisation?.name}</p>
                                <small className="text-grey">{app?.role}</small>
                            </div>

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