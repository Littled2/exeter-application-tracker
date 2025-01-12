import { useEffect, useState } from "react"
import styles from "./styles.module.css"

export function Tabs({ activeTab, tabs, saveActiveTabAs=null }) {

    const [ selected, setSelected ] = useState(
        saveActiveTabAs ? (
            localStorage.getItem(saveActiveTabAs) ? (
                localStorage.getItem(saveActiveTabAs)
            ) : (
                0
            )
        ) : (
            0
        )
    )

    useEffect(() => {
        localStorage.setItem(saveActiveTabAs, selected)
    }, [ selected ])


    return (
        <div>
            <div className={styles.tabs}>
                {
                    tabs.map((tab, i) => {
                        return (
                            <button key={i} className={[ styles.tab, selected === i ? styles.selected : ''].join(' ')} onClick={() => setSelected(i)}>
                                {
                                    tab.name
                                }
                            </button>
                        )
                    })
                }
            </div>
            <div>
                {
                    tabs[selected].tab
                }
            </div>
        </div>
    )
}