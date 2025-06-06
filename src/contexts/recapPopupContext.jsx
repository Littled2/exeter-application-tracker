import {
    createContext,
    useContext,
    useState,
} from "react"

const RecapPopupContext = createContext({})


export const RecapPopupContextProvider = ({ children }) => {

    const [ recapPopupOpen, setRecapPopupOpen ] = useState(false)

    return (
        <RecapPopupContext.Provider
          value={{ recapPopupOpen, setRecapPopupOpen }}
        >
            {children}
        </RecapPopupContext.Provider>
      )
}


export const useRecapPopupContext = () => useContext(RecapPopupContext)
