import { useEffect, useRef, useState } from "react"
import styles from "./styles.module.css"
import { AiOutlineClose, AiOutlineDelete } from "react-icons/ai"
import { usePopupsContext } from "../../contexts/popupsContext"
import { useMobile } from "../../contexts/mobileContext"
import { BiChevronLeft } from "react-icons/bi"

export function Popup({ title, children, trigger, setTrigger, onDelete, size="normal", padding=true }) {
    
    const { setPopups, openPopup, closeTopPopup } = usePopupsContext()
    const [ disableClickOut, setDisableClickOut ] = useState(false)
    const [ mouseOver, setMouseOver ] = useState(false)

    const { isMobile } = useMobile()
    const wrapperRef = useRef()
    const popupID = useRef(new Date().getTime())

    // Control the popups context
    useEffect(() => {
        if(trigger) {
            openPopup(setTrigger, popupID.current, title)
        } else {
            // setPopups(prev => prev.filter(item => item !== setTrigger))
            
        }
    }, [ trigger ])


    return trigger ? (
        <div
            id={popupID.current}
            className={[ styles.wrapper, size === "large" ? styles.large : '' ].join(" ")}
            ref={wrapperRef}
            onMouseUp={e => {
                // console.log(e.target === wrapperRef.current, !disableClickOut)
                if(e.target === wrapperRef.current && !disableClickOut) {
                    closeTopPopup()
                }
            }}
        >
            <div
                className={styles.popup}
                onMouseDown={() => {
                    if(mouseOver) {
                        setDisableClickOut(true)
                    }
                }}
                onMouseUp={() => {
                    setDisableClickOut(false)
                }}
                onMouseEnter={() => setMouseOver(true)}
                onMouseLeave={() => setMouseOver(false)}
            >

                <div className={styles.top}>
                    <p>{title}</p>

                    <div className="flex gap-s">
                        {
                            onDelete && (
                                <button className="simple-btn" onClick={onDelete}>
                                    <AiOutlineDelete />
                                </button>
                            )
                        }
                        <button className="simple-btn" onClick={() => {
                            closeTopPopup()
                        }}>
                            {
                                !isMobile ? (
                                    <AiOutlineClose />
                                ) : (
                                    <BiChevronLeft />
                                )
                            }
                        </button>
                    </div>
                </div>

                <div
                    style={padding === false ? { padding: "0" } : {}}
                    className={styles.content}
                >
                    {children}
                </div>

            </div>
        </div>
    ) : (
        <></>
    )
}