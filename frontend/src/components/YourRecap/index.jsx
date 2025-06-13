import confetti from "canvas-confetti";
import styles from "./styles.module.css";
import { useEffect } from "react";
import { usePocket } from "../../contexts/pocketContext";
import { useState } from "react";
import { useActiveYear } from "../../contexts/activeYearContext";
import { MoonLoader } from "react-spinners";
import { IoShare } from "react-icons/io5";
import { FiShare2 } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

function fire(particleRatio, opts) {

    let count = 200;
    let defaults = {
        origin: { y: 0.7 },
        zIndex: 1000
    };

    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
}

function celebrate() {
    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    })
    fire(0.2, {
        spread: 60,
    })
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    })
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    })
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    })
}

export function YourRecap() {

    const [ stats, setStats ] = useState({})
    const { activeYear } = useActiveYear()
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        celebrate()

        pb.collection('stageBreakdown').getFullList({
            filter: `year = '${activeYear}'`
        })
        .then(records => {
            console.log(records)
            let tempStats = {}
            records.forEach(record => {
                tempStats[record.stage] = record.count
            })
            tempStats.total = records.reduce((c, r) => r.count + c, 0)
            setStats(tempStats)
            setLoading(false)
        })
        .catch(err => {
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