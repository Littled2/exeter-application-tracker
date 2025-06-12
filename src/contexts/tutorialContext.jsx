import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import { usePocket } from "./pocketContext"
import Joyride, { STATUS } from "react-joyride"



const joyrideTheme = {
	options: {
		arrowColor: '#444',
		backgroundColor: '#222',
		overlayColor: 'rgba(0,0,0,0.85)',
		primaryColor: 'var(--text-blue)',
		textColor: 'var(--text-white)',
		zIndex: 10000,
	},
	beacon: {
		inner: 'var(--text-blue)',
		outer: 'var(--text-blue)',
	},
	buttonNext: {
		backgroundColor: 'var(--text-orange)',
		color: 'var(--bg-colour)',
		fontWeight: '500',
		fontSize: "1rem",
		padding: "8px 16px",
		border: "none"
	},
	skip: {
		color: 'var(--text-orange)',
	},
}


const TutorialContext = createContext({})



export const TutorialContextProvider = ({ children }) => {

    const [ runTutorial, setRunTutorial ] = useState(false)
	const [ disableBeaconOnFirstStep, setDisableBeaconOnFirstStep ] = useState(false)

	const { pb, user } = usePocket()


	const steps = [
		{
			target: '#tutorial-step-1',
			content: 'View information about your applications to internships, jobs etc.',
			placement: 'top',
			disableBeacon: disableBeaconOnFirstStep
		},
		{
			target: '#tutorial-step-2',
			content: 'Tasks you need to complete for your applications',
			placement: 'top'
		},
		{
			target: '#tutorial-step-3',
			content: 'When you want to apply somewhere, click here',
			placement: 'bottom'
		}
	]


	// If the user hasn't completed the tutorial, run the tutorial
	useEffect(() => {

		if(!user) return

		if(!user.tutorialComplete) {
			setRunTutorial(true)
		}

	}, [ user ])


	const handleJoyrideCallback = data => {

		const { status } = data

		if ([ STATUS.FINISHED, STATUS.SKIPPED ].includes(status)) {
            // You need to set our running state to false, so we can restart if we click start again.
            setRunTutorial(false)
			setDisableBeaconOnFirstStep(false)

			// Tutorial has been completed
			pb.collection("users").update(user?.id, { tutorialComplete: true })
		}
    }

	const startTutorial = () => {
		setRunTutorial(true)
		setDisableBeaconOnFirstStep(true)
	}

    return (
        <TutorialContext.Provider
          value={{ startTutorial }}
        >
            {children}
            {
        		<Joyride steps={steps} run={runTutorial} callback={handleJoyrideCallback} continuous showProgress styles={joyrideTheme} />
            }
        </TutorialContext.Provider>
      )
}


export const useTutorial = () => useContext(TutorialContext)
