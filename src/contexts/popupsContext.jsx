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


    const openPopup = useCallback((setTrigger, id) => {
      setPopups(p => [ ...p, setTrigger ])
      window.history.pushState(null, '', window.location.pathname + "?id=" + id)
    }, [ setPopups ])

    const closeTopPopup = useCallback(() => {

      console.log("Closing top popup")
            
        if(popups.length === 0) {
            return
        }

        const setTrigger = popups[popups.length - 1]
        setTrigger(false)

        // Remove the last element from the array
        // setPopups(prev => prev.slice(0, -1))

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
    }, [ handleKeyPress ])


    const handleBackNavigation = useCallback((event) => {
      console.log("BACK PRESSED", { popups })
      if (popups.length > 0) {
        event.preventDefault()
        // Trigger your custom function or prevent back navigation
        console.log('Back navigation prevented because popups is not empty!')

        closeTopPopup()
      } else {
        console.log('Back navigation allowed because popups is empty!')
      }
    }, [ popups, closeTopPopup ])

    useEffect(() => {

        window.addEventListener('popstate', handleBackNavigation)
    
        // Cleanup the event listener on component unmount
        return () => {
          window.removeEventListener('popstate', handleBackNavigation)
        }

    }, []);
    

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


