import { IoInformationCircleOutline } from "react-icons/io5";
import { Tooltip } from "react-tooltip";
import styles from "./styles.module.css"

export function InputInformation({ text, id, place="bottom", ...props }) {
    return (
        <>
            <div
                className={styles.infoCircle}
                data-tooltip-id={"input_tooltip_id_" + id}
                data-tooltip-content={text}
                data-tooltip-place={place}
            >
                <IoInformationCircleOutline/>
            </div>


            <Tooltip {...props} style={{ fontSize: "1rem" }} id={"input_tooltip_id_" + id} />
        </>
    )
}