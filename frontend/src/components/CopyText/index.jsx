import { useEffect } from "react"
import { useState } from "react"
import { IoCheckmark } from "react-icons/io5"
import styles from "./styles.module.css"

export function CopyText({ text }) {

    const [ copied, setCopied ] = useState(false)

    useEffect(() => {
        if(copied) {
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        }
    }, [ copied ])
    

    return (
        <div className="flex form align-center">
            <input value={text} type="text" className={styles.input} readOnly={true} />
            <button
                className={[ "m-submit-btn", styles.button ].join(" ")}
                style={{
                    backgroundColor: copied ? 'var(--text-green)' : '',
                    color: copied ? 'white' : '',
                }}
                onClick={() =>{
                    navigator.clipboard.writeText(text)
                    .then(() => {
                        setCopied(true)
                    })
                }}
            >
                {
                    !copied ? (
                        "Copy"
                    ) : (
                        <IoCheckmark />
                    )
                }
            </button>
        </div>
    )
}