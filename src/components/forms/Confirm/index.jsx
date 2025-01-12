import { useEffect } from "react";
import { Popup } from "../../Popup";
import styles from "./styles.module.css"
import { usePopupsContext } from "../../../contexts/popupsContext";

export function Confirm({ message, trigger, setTrigger, onConfirm }) {

    const { setPopups } = usePopupsContext()

    const confirm = () => {
        if(onConfirm) {
            onConfirm()
        }

        setTrigger(false)
    }

    // Control the popups context
    useEffect(() => {
        if(trigger) {
            setPopups(p => [ ...p, setTrigger ])
        } else {
            setPopups(prev => prev.filter(item => item !== setTrigger))
        }
    }, [ trigger ])


    return (
        <Popup trigger={trigger} setTrigger={setTrigger} title={"Confirm"}>
            <p className={styles.message} style={{ textAlign: "left" }}>{message}</p>
            <div className={styles.buttons}>
                <button className="m-submit-btn m-submit-btn-grey" style={{ backgroundColor: "var(--light-grey)", color: "white" }} onClick={() => setTrigger(false)}>Cancel</button>
                <button className="m-submit-btn" onClick={confirm}>Confirm</button>
            </div>
        </Popup>
    )
}