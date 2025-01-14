import { useEffect, useRef, useState } from "react"
import styles from "./styles.module.css"
import ukImage from "./UK.png"
import { usePocket } from "../../contexts/pocketContext";
import { useActiveYear } from "../../contexts/activeYearContext";
import { useMasterCounter } from "../../contexts/masterCounterContext";
import { BsEye } from "react-icons/bs";
import { Confirm } from "../../components/forms/Confirm";
import { Tooltip } from 'react-tooltip'




function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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

                item.expand.locations.forEach(loc => {
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


    return (
        <div className={styles.wrapper}>
            <div className="flex space-between align-center">
                <b><small className="text-grey">Application Locations</small></b>
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

                <Confirm trigger={hideConfirmOpen} setTrigger={setHideConfirmOpen} onConfirm={hideComponent} message={"Are you sure you want to hide this component? You can always un-hide it in Settings > Dashboard menu"} />
            </div>
            <div className={styles.innerWrapper}>
                <div className={styles.inner}>
                    <div className={styles.list}>
                        <table style={{ fontSize: "0.8rem" }} ref={table}>
                            <tbody>
                                {
                                    Object.keys(appLocations).map((locID, i) => {
                                        return (
                                            <tr onMouseEnter={() => mouseOver(locID)} onMouseLeave={() => mouseAway()} key={locID + i}>
                                                <th className='text-white m-hide'>{appLocations[locID].freq}</th>
                                                <td className={hover !== null ? ((hover === locID) ? 'text-white' : 'text-orange') : 'text-orange'}>{appLocations[locID].name}</td>
                                            </tr>
                                        )
                                    })
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
                                
                                let sizePX = (loc.freq * 2) + 2

                                return (
                                    <div key={i} className={styles.dot} style={{
                                        width: `${sizePX}px`,
                                        height: `${sizePX}px`,
                                        left: `${loc.distX}%`,
                                        top: `${loc.distY}%`,
                                        transform: `translateY(calc(-${sizePX}px / 2)) translateX(calc(-${sizePX}px / 2))`
                                    }}
                                    onMouseEnter={() => mouseOver(loc.id)}
                                    onMouseLeave={() => mouseAway()}
                                    ></div>
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