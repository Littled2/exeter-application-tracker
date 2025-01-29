import { useEffect } from "react"
import { getDate } from "../../../helpers/dates"
import styles from "./styles.module.css"
import { Deadline } from "../../Deadline"

export function TableRows({ items, openAppID, setOpenAppID, showType=true, showDeadline=false, showDeadlineType=false }) {
    useEffect(() => {
        items.map(item => console.log(item?.deadline))
    }, [])
    return (
        <>
            {
                items.map((item, i) => {

                    const time_difference = new Date().getTime() - new Date(item?.deadline).getTime()

                    return (
                        <tr key={i} className={[ styles.row, "cursor-pointer", item.id === openAppID ? styles.selected : '' ].join(' ')} style={{ 'animationDelay': `${i * 50}ms` }} onClick={() => setOpenAppID(item.id)}>
                            <td className={styles.org}>{item?.expand?.organisation?.name}</td>
                            <td className={styles.role} onClick={() => setOpenAppID(item.id)}>{item?.role}</td>
                            {
                                showType ? (
                                    <td className="t-hide">
                                        {
                                            item?.type ? (
                                                item.type.substring(0, 1).toUpperCase()
                                            ) : (
                                                <>-</>
                                            )
                                        }
                                    </td>
                                ) : (
                                    <></>
                                )
                            }
                            {
                                showDeadline ? (
                                    <td className={["m-hide", styles.dln ].join(" ")}>
                                        {
                                            item?.deadline ? (
                                                item?.stage === 'idea' || item?.stage === 'applying' ? (
                                                    <Deadline deadline={item?.deadline} />
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