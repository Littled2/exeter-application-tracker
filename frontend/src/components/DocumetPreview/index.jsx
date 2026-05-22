import { BiDownload } from "react-icons/bi"
import { usePocket } from "../../contexts/pocketContext"
import styles from "./styles.module.css"
import { PDFViewer } from "../PDFViewer"

export function DocumentPreview({ url, application, fileKeyName, fileToken }) {

    const { pb } = usePocket()
    

    return (
        <div className={styles.wrapper}>

            <div className={styles.pdf}>
                <PDFViewer url={url} />
            </div>

            <div className={styles.buttons}>
                
                <a
                    href={url}
                    className={styles.download}
                    target="_blank"
                    download
                >
                    <BiDownload />
                    Click to download
                </a>
            </div>

        </div>
    )
}