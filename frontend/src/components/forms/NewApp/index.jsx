import { useEffect, useRef, useState } from "react";
import { SelectOrganisation } from "../../inputs/SelectOrganisation";
import { usePocket } from "../../../contexts/pocketContext";
import { useActiveYear } from "../../../contexts/activeYearContext";
import { BiPlus } from "react-icons/bi";
import { DateInput } from "../../inputs/DateInput";
import { LocationsSelect } from "../../inputs/LocationsSelect";
import { NewOrganisation } from "../NewOrganisation";
import { Popup } from "../../Popup";
import { NewLocation } from "../NewLocation";
import { useMasterCounter } from "../../../contexts/masterCounterContext";
import { AnimatedButton } from "../../AnimatedButton";
import { InputInformation } from "../../InputInformation";
import { useMobile } from "../../../contexts/mobileContext";
import { IoAddOutline, IoCloseOutline } from "react-icons/io5";
import { useOpenApp } from "../../../contexts/openAppContext";

export function NewApp({ setTrigger }) {

    const { setMasterCounter } = useMasterCounter()

    const [ linkOpen, setLinkOpen ] = useState(false)

    const [ orgID, setOrgID ] = useState('')
    const [ role, setRole ] = useState('')
    const [ link, setLink ] = useState('')
    const [ info, setInfo ] = useState('')
    const [ deadlineType, setDeadlineType ] = useState('none')
    const [ deadline, setDeadline ] = useState(new Date())
    const [ locations, setLocations ] = useState([])
    const [ type, setType ] = useState('internship')

    const [ stage, setStage ] = useState(() => {
        let tabs = [ "idea", "applied", "accepted" ]
        let tab = localStorage.getItem("application_tabs")
        if(!tab) return "idea"
        tab = Number(tab)
        return tabs[tab] || 'idea'   
    })

    const [ newOrgOpen, setNewOrgOpen ] = useState(false)
    const [ newLocOpen, setNewLocOpen ] = useState(false)

    const [ error, setError ] = useState(null)
    const [ processing, setProcessing ] = useState(false)

    const { activeYear } = useActiveYear()

    const [ c, sc ] = useState(0)

    const { pb, user } = usePocket()

    const { isMobile } = useMobile()

    const { setOpenAppID } = useOpenApp()


    function submit(e) {
        e.preventDefault()

        setProcessing(true)

        const data = {
            "role": role,
            "info": info,
            "stage": stage,
            "organisation": orgID,
            "type": type,
            "link": link,
            "locations": locations,
            "deadline": deadlineType === 'fixed' ? deadline : '',
            "deadlineType": deadlineType,
            "user": user?.id,
            "year": activeYear
        }

        pb.collection('applications').create(data)
        .then(response => {
            setError(null)
            setTrigger(false)
            setProcessing(false)
            setMasterCounter(prev => prev + 1)
            setOpenAppID(response?.id)
        })
        .catch(err => {
            console.error("Error updating application", err)
            setError(err)
            setProcessing(false)
        })
    }

    function handleStageChange(e) {
        setStage(e.target.value)
    }

    const nameInput = useRef()

    useEffect(() => {

        switch (stage) {
            case "idea":
                ideaRef.current.checked = true
                break;
            case "applied":
                appliedRef.current.checked = true
                break;
            case "accepted":
                acceptedRef.current.checked = true
                break;
            default:
                break;
        }

        if(!isMobile) {
            nameInput.current.focus()
        }
    }, [])

    const ideaRef = useRef()
    const appliedRef = useRef()
    const acceptedRef = useRef()

    return (
        <>
            <form className="form flex col gap-m m-gap-l" onSubmit={submit}>

                <small className="text-grey">Fields marked with <span className="text-red">*</span> are required</small>

                <div className="flex col">
                    <div>
                        <div className="flex gap-s align-center">
                            <label>Role title<span className="text-red"> *</span></label>
                            <InputInformation id={"roleName"} text={"The job title of the role you are applying to. Eg. Summer Intern"} />
                        </div>
                        <input ref={nameInput} type="text" required value={role} onInput={e => setRole(e.target.value)} placeholder="Eg. Summer Intern" />
                    </div>
                    {
                        error?.response?.data?.role && (
                            <p className="text-red">{error?.response?.data?.role?.message}</p>
                        )
                    }
                </div>
                <div className="flex col">
                    <div>
                        <div style={{ display:"flex", justifyContent:"space-between" }}>
                            <label>Organisation<span className="text-red"> *</span></label>
                            {/* <small className="underline cursor-pointer" onClick={() => setNewOrgOpen(true)}>
                                <BiPlus />
                                <span>Add Organisation</span>
                            </small> */}
                        </div>
                        <SelectOrganisation selected={orgID} setSelected={setOrgID} c={c} sc={sc} />
                    </div>
                    {
                        error?.response?.data?.organisation && (
                            <p className="text-red">Please select an option</p>
                        )
                    }
                </div>
                {
                    !linkOpen ? (
                        <div
                            onClick={() => {
                                setLinkOpen(true)
                            }}
                            className="no-select"
                        >
                            <p className="text-blue cursor-pointer flex gap-s align-center">
                                <IoAddOutline />
                                <span>Include link to webpage</span>
                            </p>
                        </div>
                    ) : (
                        <div
                            onClick={() => {
                                setLinkOpen(false)
                            }}
                            className="flex align-center gap-s text-blue cursor-pointer no-select"
                        >
                            <IoCloseOutline />
                            <p>Remove link</p>
                        </div>
                    )
                }
                {
                    linkOpen && (
                        <div className="flex col">
                            <div>
                                <div>
                                    <label>Link</label>
                                </div>
                                <input placeholder="https://" style={{ width:"100%" }} value={link} onInput={e => setLink(e.target.value)}></input>
                            </div>
                            {
                                error?.response?.data?.link && (
                                    <p className="text-red">{error?.response?.data?.link?.message}</p>
                                )
                            }
                        </div>
                    )
                }
                {
                    !isMobile && (
                        <div className="flex col">
                            <div>
                                <div>
                                    <label>Notes</label>
                                </div>
                                <textarea value={info} onInput={e => setInfo(e.target.value)}></textarea>
                            </div>
                            {
                                error?.response?.data?.info && (
                                    <p className="text-red">{error?.response?.data?.info?.message}</p>
                                )
                            }
                        </div>
                    )
                }
                <div className="flex col gap-s">
                    <div>
                        <label className="text-orange">What stage is this application at?<span className="text-red"> *</span></label>
                    </div>
                    <div className="flex col gap-s" style={{ alignItems: "start" }}>
                        <label className="flex align-center gap-s text-grey">
                            <input onChange={handleStageChange} ref={ideaRef} defaultChecked={false} type="radio" name="Idea" value="idea" style={{ width: "16px", height: "16px" }}/>
                            <div className="flex flex-col">
                                <span className="text-white">Idea</span>
                                <small>Something you might apply to</small>
                            </div>
                        </label>
                        <label className="flex align-center gap-s text-grey">
                            <input onChange={handleStageChange} defaultChecked={false} type="radio" name="Idea" value="applying" style={{ width: "16px", height: "16px" }}/>
                            <div className="flex flex-col">
                                <span className="text-white">Applying</span>
                                <small>In the process of applying</small>
                            </div>
                        </label>
                        <label className="flex align-center gap-s text-grey">
                            <input onChange={handleStageChange} ref={appliedRef} defaultChecked={false} type="radio" name="Idea" value="applied" style={{ width: "16px", height: "16px" }}/>
                            <div className="flex flex-col">
                                <span className="text-white">Applied</span>
                                <small>Application has been submitted</small>
                            </div>
                        </label>
                        <label className="flex align-center gap-s text-grey">
                            <input onChange={handleStageChange} ref={acceptedRef} defaultChecked={false} type="radio" name="Idea" value="accepted" style={{ width: "16px", height: "16px" }}/>
                            <div className="flex flex-col">
                                <span className="text-green">Accepted</span>
                                <small>Successful application</small>
                            </div>
                        </label>
                        <label className="flex align-center gap-s text-grey">
                            <input onChange={handleStageChange} defaultChecked={false} type="radio" name="Idea" value="declined" style={{ width: "16px", height: "16px" }}/>
                            <div className="flex flex-col">
                                <span className="text-red">Declined</span>
                                <small>Unsuccessful application</small>
                            </div>
                        </label>
                    </div>
                    {
                        error?.response?.data?.stage && (
                            <p className="text-red">{error?.response?.data?.stage?.message}</p>
                        )
                    }
                </div>
                <div className="flex col">
                    <div className="flex gap-s">
                        <div>
                            <div>
                                <label>Deadline</label>
                            </div>
                            <select value={deadlineType} onInput={e => setDeadlineType(e.target.value)}>
                                <option value="rolling">Rolling</option>
                                <option value="fixed">Fixed</option>
                                <option value="none">None</option>
                            </select>
                             {/* <select value={deadlineType} onInput={e => setDeadlineType(e.target.value)}>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select> */}
                        </div>
                        <div>
                            {
                                deadlineType === "fixed" ? (
                                    <>
                                        <div>
                                            <label>Date</label>
                                        </div>
                                        <DateInput date={deadline} setDate={setDeadline} />
                                    </>
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                    </div>
                    {
                        (error?.response?.data?.deadline || error?.response?.data?.deadlineType) && (
                            <p className="text-red">{error?.response?.data?.deadline?.message} {error?.response?.data?.deadlineType?.message}</p>
                        )
                    }
                </div>
                <div className="flex col">
                    <div>
                        <div className="flex space-between">
                            <div className="flex gap-s align-center">
                                <label>Location(s)</label>
                                <InputInformation id={"location"} text={"Select location(s) you are applying to"} />
                            </div>
                            <small className="underline cursor-pointer text-blue" onClick={() => setNewLocOpen(true)}>
                                <BiPlus />
                                <span>New Location</span>
                            </small>
                        </div>
                        <LocationsSelect locations={locations} setLocations={setLocations} setNewLocationOpen={setNewLocOpen} c={c} />
                    </div>
                    {
                        error?.response?.data?.locations && (
                            <p className="text-red">{error?.response?.data?.locations?.message}</p>
                        )
                    }
                </div>

                {/* <div className="flex col">
                    <div>
                        <div>
                            <label>Application Type</label>
                        </div>
                        <select required value={type} onInput={e => setType(e.target.value)}>
                            <option disabled>Please Select</option>
                            <option value="internship">Internship</option>
                            <option value="placement">Placement</option>
                            <option value="grad-scheme">Placement</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {
                        error?.response?.data?.type && (
                            <p className="text-red">{error?.response?.data?.type?.message}</p>
                        )
                    }
                </div> */}

                <AnimatedButton submitting={processing} className="m-submit-btn" type="submit">
                    Submit
                </AnimatedButton>                

            </form>

            <Popup title={"Create Organisation"} trigger={newOrgOpen} setTrigger={setNewOrgOpen}>
                <NewOrganisation setSelectedOrgID={setOrgID} setTrigger={setNewOrgOpen} sc={sc} />
            </Popup>

            <Popup title={"Create Location"} trigger={newLocOpen} setTrigger={setNewLocOpen}>
                <NewLocation setLocations={setLocations} setTrigger={setNewLocOpen} sc={sc} />
            </Popup>
        </>
    )
}