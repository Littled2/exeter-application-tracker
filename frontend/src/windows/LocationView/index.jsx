import { useEffect, useRef, useState } from "react"
import styles from "./styles.module.css"
import ukImage from "./UK.png"
import { usePocket } from "../../contexts/pocketContext";
import { useActiveYear } from "../../contexts/activeYearContext";
import { useMasterCounter } from "../../contexts/masterCounterContext";
import { BsEye } from "react-icons/bs";
import { Confirm } from "../../components/forms/Confirm";
import { Tooltip } from 'react-tooltip'


export function LocationView() {

    const { pb, user } = usePocket()

    const { activeYear } = useActiveYear()
    const { masterCounter } = useMasterCounter()

    const [ hover, setHover ] = useState(null)

    const [ appLocations, setAppLocations ] = useState([])

    const [ hideConfirmOpen, setHideConfirmOpen ] = useState(false)

    const table = useRef()

    useEffect(() => {
        
        pb.collection("locationsOfApplications").getFullList({ expand: "locations", filter: `year = "${activeYear}"` })
        .then(items => {

            let map = {}

            items.forEach(item => {

                if(!("expand" in item)) {
                    return
                }

                item.expand?.locations?.forEach(loc => {
                    if(loc.id in map) {
                        map[loc.id].freq += 1
                    } else {
                        map[loc.id] = {
                            ...loc,
                            freq: 1
                        }
                    }
                })
            })

            setAppLocations(map)
        })
        .catch(error => console.error("Error getting locations", error))

    }, [ activeYear, masterCounter ])


    function mouseOver(locID) {
        setHover(locID)
    }

    function mouseAway() {
        setHover(null)
    }

    function hideComponent() {
        pb.collection("users").update(user.id, {
            locationsView: false
        })
        .then(() => {
           console.log("Hid locations card")
        })
        .catch(err =>{
            console.error("Something west wrong hiding location card", err)
        })
    }

    const topLocations = Object.keys(appLocations)
        .sort((a, b) => appLocations[b].freq - appLocations[a].freq)
        .slice(0, 5)

    const otherFreq = Object.keys(appLocations)
        .filter(locID => !topLocations.includes(locID))
        .reduce((sum, locID) => sum + appLocations[locID].freq, 0)



    return (
        <div className={styles.wrapper}>
            <div className="flex space-between align-center m-justify-center">
                <b><small className="text-grey">Where You Are Applying</small></b>
                <span
                    className="cursor-pointer text-grey hover-text-orange m-hide"
                    data-tooltip-id="hide-location-view-tooltip"
                    data-tooltip-content="Hide location view"
                    data-tooltip-place="bottom"
                    onClick={() => setHideConfirmOpen(true)}
                >
                    <BsEye />
                </span>

                <Tooltip id="hide-location-view-tooltip" />

                <Confirm trigger={hideConfirmOpen} setTrigger={setHideConfirmOpen} onConfirm={hideComponent} message={"Are you sure you want to hide this component? You can always un-hide it in Settings > Appearance"} />
            </div>
            <div className={styles.innerWrapper}>
                <div className={styles.inner}>
                    <div className={styles.list}>
                        <table style={{ fontSize: "0.8rem" }} ref={table}>
                            <tbody>
                                {
                                    topLocations.length === 5 && otherFreq.length !== 0 && (
                                        <tr>
                                            <td style={{ paddingBottom: "5px" }} colSpan={2} className="text-white">Top 5 locations</td>
                                        </tr>
                                    )
                                }
                                {
                                    topLocations
                                    .map((locID, i) => {
                                        return (
                                            <tr onMouseEnter={() => mouseOver(locID)} onMouseLeave={() => mouseAway()} key={locID + i}>
                                                <td style={{ paddingRight: "5px" }} className='text-orange text-right'>{appLocations[locID].freq}</td>
                                                <td className={hover !== null ? ((hover === locID) ? 'text-white' : 'text-grey') : 'text-grey'}>{appLocations[locID].name}</td>
                                            </tr>
                                        )
                                    })
                                }
                                {
                                    otherFreq > 0 && (
                                        <tr>
                                            <td style={{ paddingRight: "5px" }} className='text-orange text-right'>{otherFreq}</td>
                                            <td className='text-grey'>Other</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={styles.imageWrapper}>
                    <div className={styles.dotsWrapper}>
                        {
                            Object.keys(appLocations).map((locID, i) => {

                                const loc = appLocations[locID]

                                if(hover !== null && hover !== locID) return
                                
                                // Calculate the size. Cap at 20px
                                let sizePX = Math.min((loc.freq * 2) + 2, 20)

                                return (
                                    <div
                                        key={i}
                                        className={styles.dot}
                                        style={{
                                            width: `${sizePX}px`,
                                            height: `${sizePX}px`,
                                            // left: `${(8.930208 - Math.abs(loc.long)) * 8.515}%`, // - long - If there are coordinates, use them first!!!
                                            // top: `${(59.055 - loc.lat) * 11.37}%`, // - lat
                                            left: `${loc.distX}%`, // - long - If there are coordinates, use them first!!!
                                            top: `${loc.distY}%`, // - lat
                                            transform: `translateY(calc(-${sizePX}px / 2)) translateX(calc(-${sizePX}px / 2))`
                                        }}
                                        // onMouseEnter={() => mouseOver(loc.id)}
                                        // onMouseLeave={() => mouseAway()}
                                        data-tooltip-id={`location-${locID}-tooltip`}
                                        data-tooltip-content={`${loc?.name} (${appLocations[locID].freq})`}
                                        data-tooltip-place="bottom"
                                    >
                                        <Tooltip id={`location-${locID}-tooltip`} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <img className={styles.image} src={ukImage} />
                </div>
            </div>
        </div>
    )
}