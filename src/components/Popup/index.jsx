import { useCallback, useEffect } from "react"
import styles from "./styles.module.css"
import { AiOutlineClose, AiOutlineDelete } from "react-icons/ai"
import { usePopupsContext } from "../../contexts/popupsContext"
import { useMobile } from "../../contexts/mobileContext"
import { BiChevronLeft } from "react-icons/bi"

export function Popup({ title, children, trigger, setTrigger, onDelete }) {
    
    const { setPopups } = usePopupsContext()

    // Control the popups context
    useEffect(() => {
        if(trigger) {
            setPopups(p => [ ...p, setTrigger ])
            window.history.pushState({ custom: true }, '', window.location.href)
        } else {
            setPopups(prev => prev.filter(item => item !== setTrigger))
        }
    }, [ trigger ])

    useEffect(() => {
        const handlePopState = () => {
          setTrigger(false)
          window.history.pushState(null, document.title, window.location.href)
        };
    
        // Add event listener for back navigation
        window.addEventListener("popstate", handlePopState);
    
        // Cleanup event listener on component unmount
        return () => {
          window.removeEventListener("popstate", handlePopState);
        }
      }, [])

      const { isMobile } = useMobile()

    return trigger ? (
        <div className={styles.wrapper}>
            <div className={styles.popup}>

                <div className={styles.top}>
                    <p>{title}</p>

                    <div className="flex gap-s">
                        {
                            onDelete && (
                                <button onClick={onDelete}>
                                    <AiOutlineDelete />
                                </button>
                            )
                        }
                        <button onClick={() => setTrigger(false)}>
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