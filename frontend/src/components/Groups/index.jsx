import { useState } from "react";
import { useActiveYear } from "../../contexts/activeYearContext";
import { NewYears } from "../forms/NewYears";
import { Popup } from "../Popup";
import styles from "./styles.module.css"

import { BiPlus } from "react-icons/bi";

export function Groups() {

    const [ newYearOpen, setNewYearOpen ] = useState(false)

    const { activeYear, setActiveYear, years } = useActiveYear()

    return (
        <>
            <div className={styles.groups}>
                {
                    years.map((g, i) => {
                        return (
                            <button key={g.id} className={g.id === activeYear ? styles.selected : ""} onClick={() => setActiveYear(g.id)}>{g?.year}</button>
                        )
                    })
                }

                <button onClick={() => setNewYearOpen(true)}>
                    <BiPlus />
                </button>
            </div>

            <Popup title={"New Group"} trigger={newYearOpen} setTrigger={setNewYearOpen}>
                <NewYears setTrigger={setNewYearOpen} />
            </Popup>
        </>
    )
}