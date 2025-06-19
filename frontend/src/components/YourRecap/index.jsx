import styles from "./styles.module.css";
import { useEffect } from "react";
import { usePocket } from "../../contexts/pocketContext";
import { useState } from "react";
import { useActiveYear } from "../../contexts/activeYearContext";
import { MoonLoader } from "react-spinners";
import { FiShare2 } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import { celebrateConfetti } from "../../helpers/particle-effects";


export function YourRecap() {

    const [ stats, setStats ] = useState({})
    const { activeYear } = useActiveYear()
    const [ loading, setLoading ] = useState(true)

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
            setLoading(false)
        })
    }, [])

    const { pb } = usePocket()

    return (
        <div className={styles.wrapper}>

            <div className={styles.top}>
                <img src="/logo-large-no-bg.png" alt="Exeter Application Tracker Logo" className={styles.logo} />
                <button
                    data-tooltip-id="share-recap-tooltip"
                    data-tooltip-content="Share recap"
                    data-tooltip-place="bottom"
                    style={{ backgroundColor: "transparent" }}
                >
                    <FiShare2 size={24} color="var(--text-white)"  />
                </button>
                
                <Tooltip id="share-recap-toolkit" />

            </div>

            <div className={styles.content}>
                {
                    !loading ? (
                        <>
                            <h2 className={styles.subtitle}>You sent in</h2>
                            <h1 className={styles.figure}>{stats?.total}</h1>
                            <h2 className={styles.subtitle}>Applications this year</h2>
                        </>
                    ) : (
                        <MoonLoader color="var(--text-orange)" />
                    )
                }
            </div>

        </div>
    )
}