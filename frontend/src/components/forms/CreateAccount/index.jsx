import { useCallback, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import styles from "./styles.module.css"
import { AnimatedButton } from "../../AnimatedButton"


export function CreateAccount() {

    const { register, pb } = usePocket()

    const [ processing, setProcessing ] = useState(false)

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ passwordConfirm, setPasswordConfirm ] = useState('')
    const [ name, setName ] = useState('')
    const [ hasAgreedToAllPolicies, setHasAgreedToAllPolicies ] = useState(false)

    const [ err, setErr ] = useState()


    const submit = useCallback((e) => {
        e.preventDefault()

        setErr(null)
        setProcessing(true)

        if(password !== passwordConfirm) {
            setErr("Passwords do not match")
            setProcessing(false)
            return
        }

        register(email, password, hasAgreedToAllPolicies)
        .then(res => {
            console.log(res)
            setProcessing(false)
        })
        .catch(err => {
            console.error("Error creating account in", {err})
            setErr(err)
            setProcessing(false)
        })
    }, [email, password, passwordConfirm, name, err])

    return (
        <div className="flex flex-col gap-m">

            <form className={`form ${styles.form}`} onSubmit={submit}>

                <div>
                    <div>
                        <label>Email</label>
                    </div>
                    <input name="create-account-email" id="create-account-email" style={{ width: "100%" }} value={email} onChange={e => setEmail(e.target.value)} type="email" required />
                </div>

                <div>
                    <div>
                        <label>Password</label>
                    </div>
                    <input name="create-account-password" id="create-account-password" style={{ width: "100%" }} value={password} onChange={e => setPassword(e.target.value)} type="password" minLength={6} required />
                </div>

                <div>
                    <div>
                        <label>Confirm password</label>
                    </div>
                    <input name="create-account-password-confirm" id="create-account-password-confirm" style={{ width: "100%" }} value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} type="password" minLength={6} required />
                </div>

                <div>
                    <label className="flex gap-s">
                        <input type="checkbox" checked={hasAgreedToAllPolicies} onChange={e => setHasAgreedToAllPolicies(e.target.checked)} required />
                        <span>I agree to the <a className="text-orange underline" href={process.env.TERMS_AND_CONDITIONS_URL}>Terms & Conditions</a> and <a className="text-orange underline" href={process.env.PRIVACY_POLICY_URL}>Privacy Policy</a></span>
                    </label>
                </div>

                {
                    err ? (
                        <p className="text-red">{err?.response?.message}</p>
                    ) : (
                        <></>
                    )
                }

                {
                    err?.response?.data?.email?.message ? (
                        <p className="text-red">{err?.response?.data?.email?.message}</p>
                    ) : (
                        <></>
                    )
                }

                {
                    err?.response?.data?.password?.message ? (
                        <p className="text-red">{err?.response?.data?.password?.message}</p>
                    ) : (
                        <></>
                    )
                }

                {
                    err?.response?.data?.passwordConfirm?.message ? (
                        <p className="text-red">{err?.response?.data?.passwordConfirm?.message}</p>
                    ) : (
                        <></>
                    )
                }

                <div>

                    <AnimatedButton submitting={processing} type="submit" className="m-submit-btn">
                        Create Account
                    </AnimatedButton>

                </div>

            </form>

        </div>
    )
}
