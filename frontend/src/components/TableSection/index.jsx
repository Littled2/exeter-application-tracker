import { useState } from "react"
import styles from "./styles.module.css"
import { BiDownArrow, BiUpArrow } from "react-icons/bi"

export function TableSection({ name, amount, defaultOpen=true, children }) {

    const [ open, setOpen ] = useState(defaultOpen)

    return (
        <>
            <tr>
                <td className={styles.rowHeading} colSpan={"100%"} onClick={() => setOpen(!open)}>
                    {
                        open ? (
                            <BiDownArrow />
                        ) : (
                            <BiUpArrow />
                        )
                    }
                    <span style={{ whiteSpace:"nowrap" }}> {name} ({amount})</span>
                </td>
            </tr>

            {
                open ? children : <></>
            }

        </>
    )
}