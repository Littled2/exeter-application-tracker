import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import { usePocket } from "./pocketContext"

const NotificationsContext = createContext({})


export const NotificationsContextProvider = ({ children }) => {

    const [ notifications, setNotifications ] = useState([])

	const { pb } = usePocket()


	useEffect(() => {

		// Subscribe to notifications:
		pb.collection('sent_notifications').subscribe('*', e => {

			console.log(e)

			// Cancel unless new record was added
			if(e.action !== "create") {
				return
			}

			setNotifications(ns => [ ...ns, e.record ])

		}, { expand: "notification" });

		// Fetch any unread notifications
		pb.collection("sent_notifications").getList(1, 5, { filter: "read = false", expand: "notification", sort: "created" })
		.then(res => {
			setNotifications(res.items)
		})
		.catch(err => {
			console.error("Error fetching notifications", err)
		})

	}, [])

    // {
    //   textContent: "Your year-end wrap up is here! 🎉",
    //   important: true,
    //   showRecapButton: true
    // }

    return (
        <NotificationsContext.Provider
          value={{ notifications, setNotifications }}
        >
        	{children}
        </NotificationsContext.Provider>
    )
}


export const useNotifications = () => useContext(NotificationsContext)
