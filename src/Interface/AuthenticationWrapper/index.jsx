import { Tabs } from "../../components/Tabs"
import { CreateAccount } from "../../components/forms/CreateAccount"
import { Login } from "../../components/forms/Login"
import styles from "./styles.module.css"


export function AuthenticationWrapper() {
    return(
        <div className={styles.wrapper}>

            <img className={styles.logo} src="/logo-no-bg.png" alt="Logo" />

            <Tabs saveActiveTabAs={"auth_tabs"} tabs={[
                {
                    name: "Log in",
                    tab: (
                        <div className={styles.tab}>
                            <h3 className="text-white">Log in to the application tracker</h3>

                            <Login />
                        </div>
                    )
                },
                {
                    name: "Create Account",
                    tab: (
                        <div className={styles.tab}>
                            <h3 className="text-white">Create an account to use the application tracker</h3>

                            <CreateAccount />
                        </div>
                    )
                }

            ]} />
        </div>
    )
}