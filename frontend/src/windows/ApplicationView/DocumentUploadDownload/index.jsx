import { useCallback, useEffect, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import { BiFile, BiFileBlank, BiTrash, BiUpload } from "react-icons/bi"
import { Popup } from "../../../components/Popup"
import styles from "./styles.module.css"
import { Confirm } from "../../../components/forms/Confirm"
import { useMasterCounter } from "../../../contexts/masterCounterContext"

export function DocumentUploadDownload({ application, fileKeyName, displayName }) {

    const { pb } = usePocket()

    const [ fileToken, setFileToken ] = useState()

    const [ uploading, setUploading ] = useState(false)
    const [ error, setError ] = useState()

    const [ confirmDelete, setConfirmDelete ] = useState(false)
    const { setMasterCounter } = useMasterCounter()


    useEffect(() => {
        (async () => {
            const token = await pb.files.getToken()
            setFileToken(token)
        })()
    }, [])

    const uploadFile = useCallback((file) => {

        if(!file) return

        setUploading(true)
        setError(null)

        // Upload the file

        const fd = new FormData()
        fd.append(fileKeyName, file)

        pb.collection("applications").update(application.id, fd)
        .then(() => setUploading(false))
        .catch((err) => {
            console.error("Error uploading file", err)
            setUploading(false)
            setError(err)
        })

    }, [ pb, application ])

    const deleteFile = useCallback(() => {

        setError(null)

        pb.collection("applications").update(application.id, {
            [fileKeyName]: ''
        })
        .then(() => {
            console.log("File deleted OK")
            setMasterCounter(c => c + 1)
        })
        .catch((err) => {
            console.error("Error deleting file", err)
            setError(err)
        })

    }, [ pb, application ])

    return (
        <>
            <small className="flex gap-s justify-end">
                {
                    fileToken ? (
                        <>
                            {
                                application[fileKeyName] ? (
                                    <>
                                        <a href={pb.files.getUrl(application, application[fileKeyName], { token: fileToken })} className={styles.file} download>
                                            <BiFileBlank style={{ fontSize: "1.2rem" }} />
                                            {/* {application[fileKeyName].split('_').slice(0, -1).join('_')} */}
                                            {displayName}
                                        </a>
                                        <span className="text-white"> | </span>
                                    </>
                                ) : (
                                    <></>
                                )
                            }

                            {
                                !application[fileKeyName] ? (
                                    !uploading ? (
                                        <label className="underline cursor-pointer flex align-center text-blue" style={{ gap: "5px" }}>
                                            <BiUpload />
                                            Upload
                                            <input style={{ display:"none" }} hidden type="file"  onChange={e => uploadFile(e.target.files[0])} accept=".doc,.docx,.pdf,.txt,.rtf,.odt,.ods,.odp,.wps,.wpd,.html,.htm,.xml,.xps,.tex,.md,.csv,.tsv,.xls,.xlsx,.ppt,.pptx,.pub,.one,.pages,.numbers,.key,.epub,.mobi,.djvu,.json,.yaml,.yml,.ini,.log,.cfg,.conf"/>    
                                        </label>
                                    ) : (
                                        <small className="text-grey">Uploading...</small>
                                    )
                                ) : (
                                    <span style={{ fontSize: "1.2rem" }} className={styles.bin} onClick={() => setConfirmDelete(true)}><BiTrash/></span>
                                )
                            }

                            {/* <a href={pb.files.getUrl(application, application[fileKeyName], { token: fileToken })} className="underline cursor-pointer" download>Upload</a> */}
                        </>
                    ) : (
                        <></>
                    )
                }
            </small>

            <Popup trigger={error} setTrigger={setError}>
                <span style={{ color:"red" }}>{error?.response?.data[fileKeyName].message}</span>
            </Popup>

            <Confirm
                trigger={confirmDelete}
                setTrigger={setConfirmDelete}
                message={"Are you sure you want to delete this file?"}
                onConfirm={deleteFile}
            ></Confirm>
        </>
    )
}