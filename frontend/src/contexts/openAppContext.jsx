import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"

const OpenAppContext = createContext({})


export const OpenAppContextProvider = ({ children }) => {

    const [ openAppID, setOpenAppID ] = useState(null)

    return (
        <OpenAppContext.Provider
          value={{ openAppID, setOpenAppID }}
        >
            {children}
        </OpenAppContext.Provider>
      )
}


export const useOpenApp = () => useContext(OpenAppContext)
