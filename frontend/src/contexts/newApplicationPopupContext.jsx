import {
    createContext,
    useContext,
    useState,
} from "react"
import { Popup } from "../components/Popup"
import { NewApp } from "../components/forms/NewApp"

const NewApplicationPopupContext = createContext({})


export const NewApplicationPopupContextProvider = ({ children }) => {

    const [ newApplicationPopupOpen, setNewApplicationPopupOpen ] = useState(false)

    return (
        <NewApplicationPopupContext.Provider
          value={{ newApplicationPopupOpen, setNewApplicationPopupOpen }}
        >
          <Popup title={"New Application"} trigger={newApplicationPopupOpen} setTrigger={setNewApplicationPopupOpen}>
            <NewApp setTrigger={setNewApplicationPopupOpen} />
          </Popup>

          {children}
        </NewApplicationPopupContext.Provider>
      )
}


export const useNewApplicationPopup = () => useContext(NewApplicationPopupContext)


