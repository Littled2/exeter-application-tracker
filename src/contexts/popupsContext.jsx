import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react"
import { useMobile } from "./mobileContext"

const PopupContext = createContext({})


export const PopupContextProvider = ({ children }) => {


    const [ popups, setPopups ] = useState([])

    const { activeMobileTab } = useMobile()


    const openPopup = useCallback((setTrigger) => {
		setPopups(p => [ ...p, setTrigger ])
		window.history.pushState({ popup: true }, '', window.location.href)
    }, [ setPopups ])

    const closeTopPopup = useCallback(() => {
            
        if(popups.length === 0) {
            return
        }

        const setTrigger = popups[popups.length - 1]
        setTrigger(false)

        // Remove the last element from the array
        setPopups(prev => prev.slice(0, -1))

		    window.history.back()

    }, [ popups, setPopups ])


    const handleKeyPress = useCallback(e => {
        if(e.key === "Escape") {
            closeTopPopup()
        }
    }, [ closeTopPopup ])


    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress)

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress])

	useEffect(() => {
        const handlePopState = () => {
            console.log("State popped")
        	//   window.history.pushState(null, document.title, window.location.href)
        };
    
        // Add event listener for back navigation
        window.addEventListener("popstate", handlePopState);
    
        // Cleanup event listener on component unmount
        return () => {
          window.removeEventListener("popstate", handlePopState);
        }
      }, [])


    useEffect(() => {
        const handleBackNavigation = (event) => {
          if (popups.length > 0) {
            event.preventDefault()
            // Trigger your custom function or prevent back navigation
            console.log('Back navigation prevented because popups is not empty!')
            window.history.pushState(null, '', window.location.href)

            closeTopPopup()
          } else {
            console.log('Back navigation allowed because popups is empty!')
          }
        };
    
        const onPopState = (event) => {
          handleBackNavigation(event)
        };
    
        window.addEventListener('popstate', onPopState)
    
        // Cleanup the event listener on component unmount
        return () => {
          window.removeEventListener('popstate', onPopState)
        }

    }, [ popups ]);
    

    useEffect(() => {
        console.log("popups list has changed", {popups})
    }, [ popups ])
    

    useEffect(() => {
      closeTopPopup()
    }, [ activeMobileTab ])


    return (
        <PopupContext.Provider
          	value={{ popups, setPopups, openPopup, closeTopPopup }}
        >
          	{children}
        </PopupContext.Provider>
    )
}


export const usePopupsContext = () => useContext(PopupContext)


