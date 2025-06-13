import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"

const MasterCounterContext = createContext({})


export const MasterCounterContextProvider = ({ children }) => {

    const [ masterCounter, setMasterCounter ] = useState(0)

    useEffect(() => {
        console.log("The master counter context has changed", masterCounter)
    }, [ masterCounter ])

    return (
        <MasterCounterContext.Provider
          value={{ masterCounter, setMasterCounter }}
        >
          {children}
        </MasterCounterContext.Provider>
      )
}


export const useMasterCounter = () => useContext(MasterCounterContext)
