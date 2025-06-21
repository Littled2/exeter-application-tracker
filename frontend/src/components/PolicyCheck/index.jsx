import styles from "./styles.module.css"
import { usePocket } from "../../contexts/pocketContext"
import { IoLogOutOutline } from "react-icons/io5"
import { Tooltip } from "react-tooltip"


export function PolicyCheck({ children }) {

	const { user, pb, logout } = usePocket()

    return (
        <>
			{
				user?.hasAgreedToAllPolicies ? (
					<>
						{children}
					</>
				) : (
					<div className={styles.wrapper}>

						<button
							className={[ styles.logOut, "simple-btn" ].join(" ")}
							data-tooltip-id="policy-go-back-tooltip"
							data-tooltip-content="Log out"
							data-tooltip-place="bottom"
							onClick={() => {
								logout()
							}}
						>		
							<IoLogOutOutline />
						</button>

						<Tooltip id="policy-go-back-tooltip" />

						<div className={styles.notYetAgreedWrapper}>
		
							<h3 className="text-white">Complete Sign-up</h3>
							<p className="text-grey">
								To finish signing in, you must agree to the <a className="underline text-orange" target="_blank" href={process.env.TERMS_AND_CONDITIONS_URL}>Terms & Conditions</a> and <a className="underline text-orange" target="_blank" href={process.env.PRIVACY_POLICY_URL}>Privacy Policy</a>
							</p>

							<div className="flex">
								<button
									className="m-submit-btn"
									style={{ width: "max-content" }}
									onClick={() => {
										pb.collection("users")
										.update(user?.id, {
											hasAgreedToAllPolicies: true
										})
									}}
								>I agree</button>
							</div>
			
						</div>
					</div>
				)	
			}
        </>
      )
}