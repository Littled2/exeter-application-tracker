import { useCallback } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import styles from "./styles.module.css"

export function DashboardManager() {

    const { pb, user } = usePocket()

    const setDashboardView = useCallback(async (key, value) => {
        pb.collection("users").update(user.id, {
            [key]: value
        })
    }, [ pb, user ])

    return (
        <div className={styles.tab}>

            <div className="flex space-between align-center">
                <h5 className="text-grey">Customise my dashboard</h5>
            </div>

            <div className="flex col gap-m">
                <label className="flex gap-s align-center">
                    <input onInput={e => setDashboardView("locationsView", e.target.checked)} defaultChecked={user?.locationsView} type="checkbox" />
                    <span>Show locations card</span>
                </label>

                <label className="flex gap-s align-center">
                    <input onInput={e => setDashboardView("stagesView", e.target.checked)} defaultChecked={user?.stagesView} type="checkbox" />
                    <span>Show stages breakdown card</span>
                </label>

                <label className="flex gap-s align-center">
                    <input onInput={e => setDashboardView("deadlinesView", e.target.checked)} defaultChecked={user?.deadlinesView} type="checkbox" />
                    <span>Show deadlines card</span>
                </label>
            </div>
        </div>
    )
}