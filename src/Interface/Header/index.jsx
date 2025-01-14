import { useCallback, useEffect, useState } from "react";
import { Popup } from "../../components/Popup";
import { NewApp } from "../../components/forms/NewApp";
import { IoTicketOutline } from "react-icons/io5"
import { NewTicket } from "../../components/forms/NewTicket";
import { FiMoon } from "react-icons/fi"
import { BsGear, BsPerson, BsSun } from "react-icons/bs"
import { Settings } from "../../components/Settings";
import styles from "./styles.module.css"
import { usePocket } from "../../contexts/pocketContext";
import { NewYears } from "../../components/forms/NewYears";
import { useActiveYear } from "../../contexts/activeYearContext";
import { useNewApplicationPopup } from "../../contexts/newApplicationPopupContext";
import { Groups } from "../../components/Groups";
import { BiPlus } from "react-icons/bi";
import { useMobile } from "../../contexts/mobileContext";

export function Header() {

    const { pb, user } = usePocket()

    const { newApplicationPopupOpen, setNewApplicationPopupOpen} = useNewApplicationPopup()

    const [ newTicketOpen, setNewTicketOpen ] = useState(false)
    const [ settingsOpen, setSettingsOpen ] = useState(false)

    const { years, setActiveYear, activeYear } = useActiveYear()

    const { isMobile, activeMobileTab } = useMobile()

    const handleKeyPress = useCallback(e => {
        if(e.ctrlKey && e.key === "b") {
            e.preventDefault()
            e.stopPropagation()
            
            setNewApplicationPopupOpen(true)
        }
    }, [])

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress)

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress])


    return (
        <>
            <div className={styles.header}>
                <header>
                    {
                        user ? (
                            years.length > 0 ? (
                                <>

                                    {
                                        activeYear ? (
                                            <div>
                                                <button className={styles.newAppButton} onClick={() => setNewApplicationPopupOpen(true)}>
                                                    <span>+<span className="m-hide"> New Application</span></span>
                                                    <span className={[ styles.keyIndicators, 'windows-only' ].join(' ')}>
                                                        <span>ctrl</span>
                                                        +
                                                        <span>b</span>    
                                                    </span>
                                                </button>
                                            </div>
                                        ) : (
                                            <span></span>
                                        )
                                    }

                                    <div className={styles.groupSelectWrapper}>
                                        <div className={[  styles.mobileGroupsSelect ].join(" ")}>
                                            <select onInput={e => setActiveYear(e.target.value)} value={activeYear}>
                                                {
                                                    years.map(year => {
                                                        return <option key={'_dd_' + year.id} value={year.id}>{year.year}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    {
                                        isMobile && (
                                            <>
                                                {
                                                    activeMobileTab === 'deadlines' && (
                                                        <h1 className={styles.mobilePageTitle}>Upcoming Deadlines</h1>
                                                    )
                                                }
                                                {
                                                  activeMobileTab === 'analytics' && (
                                                        <h1 className={styles.mobilePageTitle}>Analytics</h1>
                                                    )
                                                }
                                                {
                                                    activeMobileTab === 'applications' && (
                                                        <h1 className={styles.mobilePageTitle}>Your Applications</h1>
                                                    )
                                                }
                                                {
                                                    activeMobileTab === 'tasks' && (
                                                        <h1 className={styles.mobilePageTitle}>Tasks</h1>
                                                    )
                                                }
                                            </>
                                        )
                                    }

                                    <div className="flex gap-m align-center">

                                        {/* <div className="m-hide">
                                            <Groups groups={years} />
                                        </div> */}

                                        <div className="flex">
                                            <button className="m-hide" onClick={() => setNewTicketOpen(true)}>
                                                <IoTicketOutline/>
                                                <span>Contact support</span>
                                            </button>
                                            {/* <button onClick={() => setLightTheme(!lightTheme)}>
                                                {
                                                    !lightTheme ? (
                                                        <FiMoon />
                                                    ) : (
                                                        <BsSun />
                                                    )
                                                }
                                            </button> */}
                                            <button className={styles.settingsBtn} onClick={() => setSettingsOpen(true)}>
                                                <BsGear />
                                            </button>
                                        </div>  
                                    </div>     
                                </>
                            ) : (
                                <>
                                    <br />
                                    <button onClick={() => setSettingsOpen(true)}>
                                        <BsGear />
                                    </button>
                                </>
                            )
                        ) : (
                            <></>
                        )
                    }
                </header>
            </div>

            <Popup title={"Contact Support"} trigger={newTicketOpen} setTrigger={setNewTicketOpen}>
                <NewTicket setTrigger={setNewTicketOpen} />
            </Popup>

            <Popup title={"Settings"} trigger={settingsOpen} setTrigger={setSettingsOpen}>
                <Settings setTrigger={setSettingsOpen} />
            </Popup>

        </>
    )
}