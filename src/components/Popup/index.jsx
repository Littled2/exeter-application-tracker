import { useCallback, useEffect } from "react"
import styles from "./styles.module.css"
import { AiOutlineClose, AiOutlineDelete } from "react-icons/ai"
import { usePopupsContext } from "../../contexts/popupsContext"
import { useMobile } from "../../contexts/mobileContext"
import { BiChevronLeft } from "react-icons/bi"

export function Popup({ title, children, trigger, setTrigger, onDelete }) {
    
    const { setPopups, openPopup } = usePopupsContext()

    // Control the popups context
    useEffect(() => {
        if(trigger) {
            openPopup(setTrigger)
        } else {
            setPopups(prev => prev.filter(item => item !== setTrigger))
        }
    }, [ trigger ])

      const { isMobile } = useMobile()

    return trigger ? (
        <div className={styles.wrapper}>
            <div className={styles.popup}>

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
                        <button className="simple-btn" onClick={() => setTrigger(false)}>
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

                <div className={styles.content}>
                    {children}
                </div>

            </div>
        </div>
    ) : (
        <></>
    )
}