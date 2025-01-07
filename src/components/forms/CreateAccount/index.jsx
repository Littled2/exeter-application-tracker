import { useCallback, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import styles from "./styles.module.css"


export function CreateAccount() {

    const { register } = usePocket()

    const [ processing, setProcessing ] = useState(false)

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ passwordConfirm, setPasswordConfirm ] = useState('')
    const [ name, setName ] = useState('')

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

        register(email, password, passwordConfirm)
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
                <label className="flex gap-s align-center">
                    <input type="checkbox" required />
                    <span>I agree to the <a className="text-orange underline" href="#">Terms & Conditions</a> and <a className="text-orange underline" href="#">Privacy Policy</a></span>
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
                <button type="submit">
                {
                    !processing ? (
                        "Create Account"
                    ) : (
                        "Processing..."
                    )
                }    
                </button>
            </div>

        </form>
    )
}
