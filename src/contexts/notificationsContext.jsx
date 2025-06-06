import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"

const NotificationsContext = createContext({})


export const NotificationsContextProvider = ({ children }) => {

    const [ notifications, setNotifications ] = useState([
      {
        textContent: "Your year-end wrap up is here! 🎉",
        important: true,
        showRecapButton: true
      },
      // {
      // 	textContent: "Please change your password 🔐",
      // 	important: true
      // }
    ])

    return (
        <NotificationsContext.Provider
          value={{ notifications, setNotifications }}
        >
        	{children}
        </NotificationsContext.Provider>
      )
}


export const useNotifications = () => useContext(NotificationsContext)
