import { Tabs } from "../../components/Tabs"
import { CreateAccount } from "../../components/forms/CreateAccount"
import { Login } from "../../components/forms/Login"
import { usePocket } from "../../contexts/pocketContext"
import styles from "./styles.module.css"


export function AuthenticationWrapper() {

    const { pb } = usePocket()

    return(
        <div className={styles.wrapper}>

            <img className={styles.logo} src="/logo-large-no-bg.png" alt="Logo" />

            <p className="text-center text-grey">Track applications to internships, grad schemes and more</p>

            <button
                className={[ "button", styles.signInWithGoogleButton ].join(" ")}
                onClick={async () => {
                    try {
                        const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' })
                        console.log({authData})
                    } catch (error) {
                        console.error("OAUTH ERROR", error)
                    }

                }}
            >
                <img src="/sign-in-with-google-logo.svg" alt="Google logo" />
                <span>Sign in with Google</span>
            </button>

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
                            <h3 className="text-white">Register to use the application tracker</h3>

                            <CreateAccount />
                        </div>
                    )
                }

            ]} />

        </div>
    )
}