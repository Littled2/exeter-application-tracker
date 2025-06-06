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

      window.history.pushState({ data: id }, "", "/?time=" + id)

      setPopups(p => [ ...p, { trigger: setTrigger, id } ])

    }, [ setPopups ])


    const closeTopPopup = useCallback(() => {
            
        if(popups.length === 0) {
            return
        }

        const top = popups[popups.length - 1]
        console.log("Closing top popup", top)
        top.trigger(false)

        // Close using the popup element's id
        const popupEl = document.getElementById(top.id)
        if(popupEl) {
            popupEl.remove()
        }

        // Remove the last element from the array
        setPopups(prev => {
            let temp = prev
            temp.slice(0, -1)
            return temp
        })

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

        console.log("back", {event})

        if(popups.length === 0) {
            return
        }

        closeTopPopup()
        

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


