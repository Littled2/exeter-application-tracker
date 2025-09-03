import { BiDownload } from "react-icons/bi"
import { usePocket } from "../../contexts/pocketContext"
import styles from "./styles.module.css"

export function DocumentPreview({ application, fileKeyName, fileToken }) {

    const { pb } = usePocket()
    

    return (
        <div className="text-center">

            <br />

            <p className="text-white">{application[fileKeyName]}</p>

            <br />

            <p>
                <a
                    href={pb.files.getUrl(application, application[fileKeyName], { token: fileToken })}
                    className={styles.download}
                    download
                >
                    <BiDownload />
                    Click to download
                </a>
            </p>

            <br />

        </div>
    )
}