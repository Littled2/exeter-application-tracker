import { useCallback, useEffect, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import { BiFileBlank, BiTrash, BiUpload } from "react-icons/bi"
import { Popup } from "../../../components/Popup"
import styles from "./styles.module.css"
import { Confirm } from "../../../components/forms/Confirm"
import { useMasterCounter } from "../../../contexts/masterCounterContext"
import { DocumentPreview } from "../../../components/DocumetPreview"

export function DocumentUploadDownload({ application, fileKeyName, displayName }) {

    const { pb } = usePocket()

    const [ fileToken, setFileToken ] = useState()

    const [ uploading, setUploading ] = useState(false)
    const [ error, setError ] = useState()

    const [ confirmDelete, setConfirmDelete ] = useState(false)
    const [ previewDocumentOpen, setPreviewDocumentOpen ] = useState(false)
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
        .catch((err) => {
            console.error("Error uploading file", err)
            setError(err)
        })
        .finally(() => {
            setUploading(false)
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
                                        <div
                                            // href={pb.files.getUrl(application, application[fileKeyName], { token: fileToken })}
                                            className={styles.file}
                                            // download
                                            onClick={() => setPreviewDocumentOpen(true)}
                                        >
                                            <BiFileBlank style={{ fontSize: "1.2rem" }} />
                                            {/* {displayName} */}
                                            <span style={{
                                                maxWidth: "10ch",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}>{application[fileKeyName]}</span>
                                        </div>
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
                                            <input
                                                style={{ display:"none" }}
                                                hidden
                                                type="file"
                                                onChange={e => uploadFile(e.target.files[0])}
                                                accept=".pdf,.doc,.docx,.txt,.odt,.rtf,.xls,.xlsx,.csv,.ppt,.pptx"
                                            />    
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

            <Popup trigger={previewDocumentOpen} setTrigger={setPreviewDocumentOpen} title={displayName}>
                <DocumentPreview application={application} fileKeyName={fileKeyName} fileToken={fileToken} />
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