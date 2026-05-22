import { BiDownload } from "react-icons/bi"
import { usePocket } from "../../contexts/pocketContext"
import styles from "./styles.module.css"
import { PDFViewer } from "../PDFViewer"
import { useRef } from "react"

export function DocumentPreview({ url, application, fileKeyName, fileToken, displayName }) {

    const { pb } = usePocket()

    const strippedURL = useRef((new URL(url)).origin + (new URL(url)).pathname).current
    

    return (
        <div className={styles.wrapper}>

            {
                (strippedURL && strippedURL.toLowerCase().endsWith('.pdf')) ? (
                    <div className={styles.pdf}>
                        <PDFViewer url={url} />
                    </div>
                ) : (
                    <p className="text-center">{displayName}<br /></p>
                )
            }

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