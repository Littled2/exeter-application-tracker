import { useCallback } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import styles from "./styles.module.css"
import { useTheme } from "../../../contexts/themeContext"

export function DashboardManager() {

    const { pb, user } = usePocket()

    const { theme, updateTheme } = useTheme()

    const setDashboardView = useCallback(async (key, value) => {
        pb.collection("users").update(user.id, {
            [key]: value
        })
    }, [ pb, user ])

    return (
        <div className={styles.tab}>

            <div className="flex space-between align-center">
                <h5 className="text-white">Customise</h5>
            </div>
            
            <div className="form">
                <label className="flex gap-s align-center">
                    <p className="text-grey">Select your theme</p>
                    <select
                        onChange={e => {
                            updateTheme(e.target.value)
                        }}
                        value={theme}
                    >
                        <option value="dark_theme">Dark</option>
                        <option value="light_theme">Light</option>
                    </select>

                </label>
            </div>

            <div className="flex col gap-m text-grey">
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