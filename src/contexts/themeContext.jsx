import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react"

const ThemeContext = createContext({})


export const ThemeContextProvider = ({ children }) => {

    const [ theme, setTheme ] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark_theme") // Can be 'light_theme' or 'dark_theme'

    useEffect(() => {

        if(theme === "light_theme") {
            document.querySelector("html").classList.add("light-theme")
        } else {
            // Then dark theme
            document.querySelector("html").classList.remove("light-theme")
        }

    }, [ theme ])

    const updateTheme = useCallback(newTheme => {
        if(newTheme !== theme) {
            localStorage.setItem("theme", newTheme)
        }
        setTheme(newTheme)
    }, [ theme ])

    return (
        <ThemeContext.Provider
          value={{ theme, updateTheme }}
        >
            {children}
        </ThemeContext.Provider>
      )
}


export const useTheme = () => useContext(ThemeContext)
