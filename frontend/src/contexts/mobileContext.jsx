import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"

const MobileContext = createContext({})


export const MobileContextProvider = ({ children }) => {

    const [ activeMobileTab, setActiveMobileTab ] = useState('applications')

    const [ isMobile, setIsMobile ] = useState(window.innerWidth < 800)


    useEffect(() => {
      const mediaQuery = window.matchMedia('(max-width: 800px)')
  
      const handleMediaChange = (e) => {
        setIsMobile(e.matches)
      };
  
      mediaQuery.addEventListener('change', handleMediaChange)
  
      // Initial check in case the screen size changes before the event listener is set
      handleMediaChange(mediaQuery)
  
      return () => {
        mediaQuery.removeEventListener('change', handleMediaChange)
      }
    }, [])



    useEffect(() => {
        console.log("The mobile tab has changed", activeMobileTab)
    }, [ activeMobileTab ])

    return (
        <MobileContext.Provider
          value={{ activeMobileTab, setActiveMobileTab, isMobile }}
        >
          {children}
        </MobileContext.Provider>
      )
}


export const useMobile = () => useContext(MobileContext)
