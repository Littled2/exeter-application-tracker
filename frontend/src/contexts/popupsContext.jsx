import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"
import { useMobile } from "./mobileContext"

const PopupContext = createContext({})


export const PopupContextProvider = ({ children }) => {


    const [ popups, setPopups ] = useState([])

    const { activeMobileTab } = useMobile()

    const isManualNavigation = useRef(false)



    const openPopup = useCallback((setTrigger, id, popupName="") => {

      window.history.pushState({ data: id }, "", "")

      setPopups(p => [ ...p, { trigger: setTrigger, id, popupName } ])

    }, [ setPopups ])


    const closeTopPopup = useCallback((backNavigation = false) => {

        if(popups.length === 0) {
            return
        }

        const top = popups[popups.length - 1]
        top?.trigger(false)

        if(!backNavigation) {
            isManualNavigation.current = true
            window.history.back()
        }

        // Remove the last element from the array
        setPopups(prev => {
            let temp = prev
            temp.pop()
            return temp
        })
    }, [popups, setPopups])


    const handleKeyPress = useCallback(e => {
        if(e.key === "Escape") {
            closeTopPopup()
        }
    }, [ closeTopPopup ])


    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress)

        // remove the event listener
        return () => document.removeEventListener('keydown', handleKeyPress)
    }, [ handleKeyPress ])


    const handleBackNavigation = useCallback(() => {

        if (isManualNavigation.current) {
            isManualNavigation.current = false
            return // Skip handling this popstate
        }

        closeTopPopup(true)
        
    }, [ closeTopPopup ])

    useEffect(() => {

        window.addEventListener('popstate', handleBackNavigation)
    
        // Cleanup the event listener on component unmount
        return () => {
          window.removeEventListener('popstate', handleBackNavigation)
        }

    }, [handleBackNavigation]);
    

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


