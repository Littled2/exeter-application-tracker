import { useCallback, useEffect, useState } from "react";
import { Popup } from "../../components/Popup";
import { NewApp } from "../../components/forms/NewApp";
import { IoHeadsetOutline, IoHelpOutline, IoSearchOutline, IoTicketOutline } from "react-icons/io5"
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
import { Tooltip } from "react-tooltip";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import { MdSignalWifiConnectedNoInternet0 } from "react-icons/md";


export function Header() {

    const { pb, user } = usePocket()

    const { newApplicationPopupOpen, setNewApplicationPopupOpen} = useNewApplicationPopup()

    const [ newTicketOpen, setNewTicketOpen ] = useState(false)
    const [ settingsOpen, setSettingsOpen ] = useState(false)

    const { years, setActiveYear, activeYear } = useActiveYear()

    const { isMobile, activeMobileTab } = useMobile()
    const isOnline = useOnlineStatus()

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
                                    <div className={styles.buttons}>

                                        {/* <div className="m-hide">
                                            <Groups groups={years} />
                                        </div> */}

                                        <div className="flex gap-s">

                                            <img className={styles.logo} src="/logo-large-no-bg.png" alt="Exeter Application Tracker Logo" />


                                            {/* <button
                                                className="simple-btn"
                                                onClick={() => setSettingsOpen(true)}
                                                data-tooltip-id="open-settings-tooltip"
                                                data-tooltip-content="Settings"
                                                data-tooltip-place="bottom"
                                            >
                                                <BsGear />
                                            </button>

                                            <Tooltip id="open-settings-tooltip" />

                                            <button
                                                className="m-hide simple-btn"
                                                onClick={() => setNewTicketOpen(true)}
                                                data-tooltip-id="contact-support-tooltip"
                                                data-tooltip-content="Contact support / Suggest feature"
                                                data-tooltip-place="bottom"
                                            >
                                                <IoHelpOutline />
                                            </button>

                                            <Tooltip id="contact-support-tooltip" /> */}

                                        </div>  
                                    </div>     

                                    <div className="flex gap-s align-center">

                                        <span className="text-grey m-hide">Group:</span>

                                        <div className={styles.groupSelectWrapper}>
                                            <div className={styles.groupSelect}>
                                                <select onInput={e => setActiveYear(e.target.value)} value={activeYear}>
                                                    {
                                                        years.map(year => {
                                                            return <option key={'_dd_' + year.id} value={year.id}>{year.year}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>

                                        <button
                                            className="simple-btn"
                                            onClick={() => setSettingsOpen(true)}
                                            data-tooltip-id="open-settings-tooltip"
                                            data-tooltip-content="Settings"
                                            data-tooltip-place="bottom"
                                        >
                                            <BsGear />
                                        </button>

                                        <Tooltip id="open-settings-tooltip" />

                                        <button
                                            className="m-hide simple-btn"
                                            onClick={() => setNewTicketOpen(true)}
                                            data-tooltip-id="contact-support-tooltip"
                                            data-tooltip-content="Contact support / Suggest feature"
                                            data-tooltip-place="bottom"
                                        >
                                            {/* <IoTicketOutline/> */}
                                            <IoHelpOutline />
                                        </button>

                                        <Tooltip id="contact-support-tooltip" />

                                    </div>
                                    

                                    {
                                        isMobile && (
                                            <div className="flex-1 flex flex-col align-start justify-center">
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

                                                <div className={styles.mobileGroupSelectWrapper}>
                                                    <div className={styles.groupSelect}>
                                                        <select onInput={e => setActiveYear(e.target.value)} value={activeYear}>
                                                            {
                                                                years.map(year => {
                                                                    return <option key={'_dd_' + year.id} value={year.id}>{year.year}</option>
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                    {
                                        activeYear ? (
                                            <>
                                                {
                                                    isOnline ? (
                                                        <div className={styles.newAppButtonWrapper}>
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
                                                        <div className="flex-1 justify-right flex align-center gap-s">
                                                            <MdSignalWifiConnectedNoInternet0 />
                                                            <p>You are offline</p>
                                                        </div>
                                                    )
                                                }
                                            </>
                                        ) : (
                                            <span></span>
                                        )
                                    }
                                </>
                            ) : (
                                <>
                                    <br />
                                    <button className="simple-btn" onClick={() => setSettingsOpen(true)}>
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

            <Popup title={"Settings"} trigger={settingsOpen} setTrigger={setSettingsOpen} size="large" padding={false}>
                <Settings setTrigger={setSettingsOpen} />
            </Popup>

        </>
    )
}