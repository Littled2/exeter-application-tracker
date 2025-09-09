import {
  createContext,
  useCallback,
  useContext, useEffect, useRef, useState
} from "react"
import { Popup } from "../components/Popup"
import { usePocket } from "./pocketContext"
import { useOpenApp } from "./openAppContext"
import { useActiveYear } from "./activeYearContext"
import { SearchApplications } from "../components/SearchApplications"

const SearchContext = createContext({})


export const SearchContextProvider = ({ children }) => {

    const [ searchOpen, setSearchOpen ] = useState(null)

    return (
        <SearchContext.Provider
          value={{ searchOpen, setSearchOpen }}
        >
            {children}

            <Popup trigger={searchOpen} setTrigger={setSearchOpen} title={"Search all applications"}>
                <SearchApplications searchOpen={searchOpen} setSearchOpen={setSearchOpen}></SearchApplications>
            </Popup>
        </SearchContext.Provider>
      )
}


export const useSearchContext = () => useContext(SearchContext)