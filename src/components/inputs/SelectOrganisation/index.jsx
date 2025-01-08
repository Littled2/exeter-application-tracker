import { useEffect, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"

export function SelectOrganisation({ required, selected, setSelected, c }) {

    const [ organisations, setOrganisations ] = useState([])
    const [ loading, setLoading ] = useState(true)

    const { pb } = usePocket()

    useEffect(() => {

        pb.collection("organisations").getFullList({
            sort:"name"
        })
        .then(orgs => {
            setLoading(false)
            setOrganisations(orgs)
        })
        .catch(err => console.error("Error getting organisations", err))

    }, [c])


    return !loading ? (
        <>
            <div className="flex col gap-s">
                <select value={selected} required={required} onInput={e => setSelected(e.target.value)}>
                    <option>Please select an option</option>
                    {
                        organisations.map(org => {
                            return <option value={org.id} key={org.id}>{org?.name}</option>
                        })
                    }
                </select>
            </div>
        </>
    ) : (
        <></>
    )
}