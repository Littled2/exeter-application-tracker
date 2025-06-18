import { useEffect } from "react"
import { useState } from "react"
import { IoCheckmark } from "react-icons/io5"

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
        <div className="flex form">
            <input value={text} type="text" readOnly={true} />
            <button
                className="m-submit-btn"
                style={{
                    backgroundColor: copied ? 'var(--text-green)' : '',
                    color: copied ? 'white' : ''
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