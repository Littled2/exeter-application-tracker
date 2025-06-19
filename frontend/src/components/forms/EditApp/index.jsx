import { useEffect, useState } from "react";
import { SelectOrganisation } from "../../inputs/SelectOrganisation";
import { usePocket } from "../../../contexts/pocketContext";
import { LocationsSelect } from "../../inputs/LocationsSelect";
import { BiPlus } from "react-icons/bi";
import { Popup } from "../../Popup";
import { DateInput } from "../../inputs/DateInput";
import { useMasterCounter } from "../../../contexts/masterCounterContext";
import { NewLocation } from "../NewLocation";
import { AnimatedButton } from "../../AnimatedButton";

export function EditApp({ app, setTrigger }) {

    const [ orgID, setOrgID ] = useState(app?.organisation ? app?.organisation : '')

    const [ role, setRole ] = useState(app?.role ? app?.role : '')
    const [ link, setLink ] = useState(app?.link ? app?.link : '')
    const [ info, setInfo ] = useState(app?.info ? app?.info : '')
    const [ deadlineType, setDeadlineType ] = useState(app?.deadlineType ? app?.deadlineType : '')
    const [ deadline, setDeadline ] = useState(app?.deadline ? new Date(app?.deadline) : '')
    const [ locations, setLocations ] = useState(app?.locations)
    const [ type, setType ] = useState(app?.type ? app?.type : '')
    const [ stage, setStage ] = useState(app?.stage ? app?.stage : '')

    const [ newOrgOpen, setNewOrgOpen ] = useState(false)
    const [ newLocOpen, setNewLocOpen ] = useState(false)

    const [ error, setError ] = useState(null)
    const [ processing, setProcessing ] = useState(false)

    const [ c, sc ] = useState(0)

    const { pb } = usePocket()

    const { setMasterCounter } = useMasterCounter()

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
            "deadlineType": deadlineType
        }
        
        pb.collection('applications').update(app.id, data)
        .then(() => {

            setError(null)
            setMasterCounter(c => c + 1)
            setTrigger(false)

        })
        .catch(err => {
            console.error("Error updating application", err)
            setError(err)
        })
        .finally(() => {
            setProcessing(false)
        })
    }

    function handleStageChange(e) {
        setStage(e.target.value)
    }

    useEffect(() => {
        console.log({orgID})
    }, [orgID])

    return (
        <>
            <form className="form flex col gap-m" onSubmit={submit}>
                <div className="flex col">
                    <div>
                        <div>
                            <label>Name<span className="text-red"> *</span></label>
                        </div>
                        <input type="text" required value={role} onInput={e => setRole(e.target.value)}/>
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
                        <SelectOrganisation required selected={orgID} setSelected={setOrgID} c={c} />
                    </div>
                    {
                        error?.response?.data?.organisation && (
                            <p className="text-red">Please select an option</p>
                        )
                    }
                </div>
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
                <div className="flex col gap-s">
                    <div>
                        <label className="text-orange">What stage is this application at?<span className="text-red"> *</span></label>
                    </div>
                    <div className="flex col gap-s" style={{ alignItems: "start" }}>
                        <label className="flex align-center gap-s text-grey">
                            <input onChange={handleStageChange} defaultChecked={app?.stage === 'idea'} type="radio" name="Idea" value="idea" style={{ width: "16px", height: "16px" }}/>
                            <div className="flex flex-col">
                                <span className="text-white">Idea</span>
                                <small>Something you might apply to</small>
                            </div>
                        </label>
                        <label className="flex align-center gap-s text-grey">
                            <input onChange={handleStageChange} defaultChecked={app?.stage === 'applying'} type="radio" name="Idea" value="applying" style={{ width: "16px", height: "16px" }}/>
                            <div className="flex flex-col">
                                <span className="text-white">Applying</span>
                                <small>In the process of applying</small>
                            </div>
                        </label>
                        <label className="flex align-center gap-s text-grey">
                            <input onChange={handleStageChange} defaultChecked={app?.stage === 'applied'} type="radio" name="Idea" value="applied" style={{ width: "16px", height: "16px" }}/>
                            <div className="flex flex-col">
                                <span className="text-white">Applied</span>
                                <small>Application has been submitted</small>
                            </div>
                        </label>
                        <label className="flex align-center gap-s text-grey">
                            <input onChange={handleStageChange} defaultChecked={app?.stage === 'accepted'} type="radio" name="Idea" value="accepted" style={{ width: "16px", height: "16px" }}/>
                            <div className="flex flex-col">
                                <span className="text-green">Accepted</span>
                                <small>Successful application</small>
                            </div>
                        </label>
                        <label className="flex align-center gap-s text-grey">
                            <input onChange={handleStageChange} defaultChecked={app?.stage === 'declined'} type="radio" name="Idea" value="declined" style={{ width: "16px", height: "16px" }}/>
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
                                <label>Deadline Type</label>
                            </div>
                            <select value={deadlineType} onInput={e => setDeadlineType(e.target.value)}>
                                <option value="rolling">Rolling</option>
                                <option value="fixed">Fixed</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                        <div>
                            {
                                deadlineType === "fixed" ? (
                                    <>
                                        <div>
                                            <label>Deadline</label>
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
                            <label>Location(s)</label>
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
            
                <AnimatedButton
                    submitting={processing}
                    className="m-submit-btn popup-btm"
                    type="submit"
                >
                    Save
                </AnimatedButton>
            </form>

            {/* <Popup title={"Create Organisation"} trigger={newOrgOpen} setTrigger={setNewOrgOpen}>
                <NewOrganisation setSelectedOrgID={setOrgID} setTrigger={setNewOrgOpen} sc={sc} />
            </Popup> */}

            <Popup title={"Create Location"} trigger={newLocOpen} setTrigger={setNewLocOpen}>
                <NewLocation setLocations={setLocations} setTrigger={setNewLocOpen} sc={sc} />
            </Popup>
        </>
    )
}