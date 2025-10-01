import styles from "./styles.module.css";
import { useEffect } from "react";
import { usePocket } from "../../contexts/pocketContext";
import { useState } from "react";
import { useActiveYear } from "../../contexts/activeYearContext";
import { MoonLoader } from "react-spinners";
import { FiShare2 } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import { celebrateConfetti } from "../../helpers/particle-effects";

function toOrdinal(n) {
  const s = ["th", "st", "nd", "rd"],
        v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}


export function YourRecap() {

    const [ stats, setStats ] = useState({})
    const { activeYear } = useActiveYear()
    const [ loadingTotals, setLoadingTotals ] = useState(true)
    const [ loadingRanking, setLoadingRanking ] = useState(true)
    const [ ranking, setRanking ] = useState(0)
    const { user } = usePocket()


    useEffect(() => {
        celebrateConfetti()

        pb.collection('stageBreakdown').getFullList({
            filter: `year = '${activeYear}'`
        })
        .then(records => {

            let tempStats = {}
            records.forEach(record => {
                tempStats[record.stage] = record.count
            })
            tempStats.total = records.reduce((c, r) => r.count + c, 0)
            setStats(tempStats)
            
        })
        .finally(() => {
            setLoadingTotals(false)
        })

        pb.collection('applications_per_user').getOne(user?.id)
        .then(record => {
            console.log(ranking)

            setRanking(record?.ranking)
            
        })
        .finally(() => {
            setLoadingRanking(false)
        })

    }, [])

    const { pb } = usePocket()

    return (
        <div className={styles.wrapper}>

            <div className={styles.top}>
                {/* <img src="/logo-large-no-bg.png" alt="Exeter Application Tracker Logo" className={styles.logo} /> */}
                {/* <button
                    data-tooltip-id="share-recap-tooltip"
                    data-tooltip-content="Share recap"
                    data-tooltip-place="bottom"
                    style={{ backgroundColor: "transparent" }}
                    onClick={() => navigator.share({
                        title: "I am the " + toOrdinal(ranking) + " ranked user!",
                        text: "I am the " + toOrdinal(ranking) + " ranked user on the Exeter Application Tracker",
                        url: "https://exetertracker.com", })} 
                >
                    <FiShare2 size={24} color="var(--text-white)"  />
                </button>
                
                <Tooltip id="share-recap-toolkit" /> */}

            </div>

            <div className={styles.content}>
                {
                    (!(loadingTotals || loadingRanking) && ranking && stats) ? (
                        <>
                            {
                                stats?.total >= 3 ? (
                                    <>
                                        {/* <h2 className={styles.subtitle}>Your Stats</h2>
                                        <h1 className={styles.figure}>You submitted {stats?.total} applications</h1>
                                        <h2 className={styles.subtitle}>Applications this year</h2> */}

                                        <img src="/logo-large-no-bg.png" alt="Exeter Application Tracker Logo" className={styles.logo} />

                                        <div className={styles.contentInner}>

                                            <h2 className={styles.subtitle}>Your Application Stats</h2>

                                            <div>
                                                <p className="text-grey"><span className={styles.figure}>{stats?.total}</span> applications tracked</p>

                                                <p className="text-grey"><span className={styles.figure}>{(stats?.applied || 0) + (stats?.accepted || 0) + (stats?.declined || 0)}</span> submitted</p>

                                                <p className="text-grey">Overall, you are the <span className={styles.figure}>{toOrdinal(ranking)}</span> user!</p>
                                            </div>
                                        </div>

                                    </>
                                ) : (
                                    <div className={styles.contentInner}>
                                        You must add at lest 3 applications in this group before you can see your ranking!
                                    </div>
                                )
                            }
                        </>
                    ) : (
                        <MoonLoader color="var(--text-orange)" />
                    )
                }
            </div>

        </div>
    )
}