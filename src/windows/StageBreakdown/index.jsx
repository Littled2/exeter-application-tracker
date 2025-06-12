import styles from "./styles.module.css"

import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { usePocket } from "../../contexts/pocketContext";
import { useActiveYear } from "../../contexts/activeYearContext";
import { useMasterCounter } from "../../contexts/masterCounterContext";
import { BsEye } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import { Confirm } from "../../components/forms/Confirm";
import { useMobile } from "../../contexts/mobileContext";



const barChartOptions = {
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            backgroundColor: 'rgba(35, 35, 35, 0.95)'
        }
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
        x: {
            stacked: true,
            ticks: {
                color: 'grey'
            },
            grid: {
                color: "#121212"
            },
        },
        y: {
            stacked: true,
            ticks: {
                callback: function(value) {
                    if (Number.isInteger(value)) {
                        return value;
                    }
                }
            },
            grid: {
                color: "#121212"
            },
        },
    }
}






export function StageBreakdown() {

    const { masterCounter } = useMasterCounter()
    
    const [ barChartOptionsState, setBarChartOptionsState ] = useState(barChartOptions)

    const [ amounts, setAmounts ] = useState([ 0, 0, 0, 0, 0 ])
    const [ err, setErr ] = useState(false)

    const [ barChartData, setBarChartData ] = useState(null)
    const [ hideConfirmOpen, setHideConfirmOpen ] = useState(false)

    const { user, pb } = usePocket()

    const { activeYear } = useActiveYear()
    const { isMobile } = useMobile()

    
    /**
     * @deprecated
     */
    function ensureBaselineValue(value) {
        if(value === 0) {
            if(!isMobile) {
                return 0.01
            }

            return 0.04
        }

        return value
    }

    useEffect(() => {
        if(isMobile) {
            setBarChartOptionsState(opts => {
                opts.scales.x.grid.color = "#242424"
                opts.scales.y.grid.color = "#242424"
                return opts
            })
        } else {
            setBarChartOptionsState(opts => {
                opts.scales.x.grid.color = "#121212"
                opts.scales.y.grid.color = "#121212"
                return opts
            })
        }
    }, [ isMobile ])
    

    useEffect(() => {
        pb.collection("stageBreakdown").getFullList({ filter: `year = "${activeYear}"` })
        .then(res => {
            
            let freq = {
                idea: 0,
                applying: 0,
                applied: 0,
                accepted: 0,
                declined: 0
            }

            res.forEach(stage => {
                freq[stage.stage] = stage.count
            })

            setAmounts([
                freq.idea,
                freq.applying,
                freq.applied,
            ])


            setBarChartData({
                labels: [ "Idea", "Applying", "Applied", "Accepted", "Declined" ],
                datasets: [
                    {
                        label: 'Idea stage',
                        data: [ freq.idea, 0, 0, 0, 0 ],
                        backgroundColor: 'coral',
                    },
                    {
                        label: 'Applying stage',
                        data: [ 0, freq.applying, 0, 0, 0 ],
                        backgroundColor: '#bcb067',
                    },
                    {
                        label: 'Applied stage',
                        data: [ 0, 0, freq.applied, 0, 0 ],
                        backgroundColor: 'lightblue',
                    },
                    {
                        label: 'Accepted stage',
                        data: [ 0, 0, 0, freq.accepted, 0 ],
                        backgroundColor: '#00a522',
                    },
                    {
                        label: 'Declined stage',
                        data: [ 0, 0, 0, 0, freq.declined ],
                        backgroundColor: '#8b0b20',
                    }
                ]
            })
        })
        .catch(error => {
            console.error("Error getting stages breakdown", error)
            setErr(true)
        })
    }, [ activeYear, masterCounter ])

    function hideComponent() {
        pb.collection("users").update(user.id, {
            stagesView: false
        })
        .then(() => {
            console.log("Hid stages card")
         })
         .catch(err =>{
             console.error("Something west wrong hiding stages card", err)
         })
    }
    
    return (
        <div className={styles.outer}>
            <div className={styles.wrapper}>
                {/* <div className="flex col gap-s text-center m-hide">
                    <b><small>Pre Final Stage Applications</small></b>
                    <div className={styles.chart}>
                        <Pie
                        options={{
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            responsive: true,
                            maintainAspectRatio: true
                        }}
                        data={
                            {
                                labels: ['Idea', 'Applying', 'Applied'],
                                datasets: [
                                    {
                                        label: '# apps at stage',
                                        data: amounts,
                                        backgroundColor: [
                                            'coral',
                                            '#bcb067',
                                            'lightblue'
                                        ],
                                        borderWidth: 2,
                                        borderColor: "transparent"
                                    },
                                ]
                            }
                        } />
                    </div>
                </div> */}
                <div className={styles.barChartWrapper}>
                    <div className="flex space-between align-center m-justify-center">
                        <b className={styles.mobileHeading}><small className="text-grey">Your Applications by Stage</small></b>

                        <span
                            className="cursor-pointer text-grey hover-text-orange m-hide"
                            data-tooltip-id="hide-stages-view-tooltip"
                            data-tooltip-content="Hide stages view"
                            data-tooltip-place="bottom"
                            onClick={() => setHideConfirmOpen(true)}
                        >
                            <BsEye />
                        </span>

                        <Tooltip id="hide-stages-view-tooltip" />

                        <Confirm trigger={hideConfirmOpen} setTrigger={setHideConfirmOpen} onConfirm={hideComponent} message={"Are you sure you want to hide this component? You can always un-hide it in Settings > Dashboard menu"} />

                    </div>
                    {
                        barChartData ? (
                            <div className={styles.chart}>
                                <Bar options={barChartOptionsState} data={barChartData} />
                            </div>
                        ) : (
                            <div className={styles.inner}>
                                {/* <img src={illustration} className={styles.illustration} alt="Little men building a graph illustration" /> */}
                                <small className="text-grey">Loading...</small>
                            </div>
                        )
                    }
                </div>
            </div>
            {/* <div className={styles.labels}>
                <b style={{ padding: "0 4px", backgroundColor: "coral", color: "rgba(0,0,0,0.85)" }}><small>Idea</small></b>
                <b style={{ padding: "0 4px", backgroundColor: "#bcb067", color: "rgba(0,0,0,0.85)" }}><small>Applying</small></b>
                <b style={{ padding: "0 4px", backgroundColor: "lightblue", color: "rgba(0,0,0,0.85)" }}><small>Applied</small></b>
                <b style={{ padding: "0 4px", backgroundColor: "#00a522", color: "rgba(0,0,0,0.85)" }}><small>Accepted</small></b>
                <b style={{ padding: "0 4px", backgroundColor: "#8b0b20", color: "rgba(0,0,0,0.85)" }}><small>Declined</small></b>
            </div> */}
        </div>
    )
}