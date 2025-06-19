import { daysToDate, getDate } from "../../../helpers/dates"
import styles from "./styles.module.css"
import { Deadline } from "../../Deadline"

export function TableRows({ items, openAppID, setOpenAppID, showType=true, showDeadline=false, showDeadlineType=false }) {

    return (
        <>
            {
                items.map((item, i) => {

                    const time_difference = new Date().getTime() - new Date(item?.deadline).getTime()

                    return (
                        <tr key={i} className={[ styles.row, "cursor-pointer", item.id === openAppID ? styles.selected : '', item?.deadline ? styles.hasDeadline : '' ].join(' ')} style={{ 'animationDelay': `${i * 50}ms` }} onClick={() => setOpenAppID(item.id)}>
                            <td className={styles.org}>
                                {item?.expand?.organisation?.name}

                                <small className="m-show-block text-grey">{item?.role}</small>
                            </td>
                            <td
                                className={["m-hide", styles.role ].join(" ")}
                                onClick={() => setOpenAppID(item.id)}
                            >{item?.role}</td>
                            {/* {
                                showType ? (
                                    <td className="t-hide">
                                        {
                                            item?.type === "internship" && (
                                                "Intern"
                                            )
                                        }
                                        {
                                            item?.type === "placement" && (
                                                "Plcmt"
                                            )
                                        }
                                        {
                                            item?.type === "grad-scheme" && (
                                                "Grad"
                                            )
                                        }
                                                                                {
                                            item?.type === "Other" && (
                                                "Other"
                                            )
                                        }
                                        {
                                            item?.type !== "internship"
                                            && item?.type !== "placement"
                                            && item?.type !== "masters"
                                            && item?.type !== "grad-scheme"
                                            && item?.type !== "other" && (
                                                item.type.substring(0, 1).toUpperCase()
                                            )
                                        }
                                    </td>
                                ) : (
                                    <></>
                                )
                            } */}
                            {
                                showDeadline ? (
                                    <td className={styles.dln}>
                                        {
                                            item?.deadline ? (
                                                item?.stage === 'idea' || item?.stage === 'applying' ? (
                                                    <div className="flex flex-col text-right">
                                                        <Deadline deadline={item?.deadline} />
                                                        <small className="m-show-block text-grey">{daysToDate(item?.deadline)}</small>
                                                    </div>
                                                ) : (
                                                    <span className={styles.deadline}>
                                                        {
                                                            getDate(item?.deadline)
                                                        }
                                                    </span>
                                                )
                                            ) : (
                                                <></>
                                            )
                                        }
                                    </td>
                                ) : (
                                    <></>
                                )
                            }
                            {/* {
                                showDeadlineType ? (
                                    <td className="m-hide">
                                        {
                                            item?.deadlineType
                                        }
                                    </td>
                                ) : (
                                    <></>
                                )
                            } */}
                        </tr>
                    )
                })   
            }
        </>
    )
}