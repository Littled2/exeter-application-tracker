import { useEffect, useState } from "react";
import { Body } from "../Body/index.jsx";
import { Header } from "../Header/index.jsx";
import { PocketProvider } from "../../contexts/pocketContext.jsx"

import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ActiveYearProvider } from "../../contexts/activeYearContext.jsx";
import { NewApplicationPopupContextProvider } from "../../contexts/newApplicationPopupContext.jsx";
import { PopupContextProvider } from "../../contexts/popupsContext.jsx";
import { MasterCounterContextProvider } from "../../contexts/masterCounterContext.jsx";
import { MobileNavTabs } from "../MobileNavTabs/index.jsx";
import { MobileContextProvider } from "../../contexts/mobileContext.jsx";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function AppWrapper() {

    const [ counter, setCounter ] = useState(0)


    // Show / Hide all platform specific features
    useEffect(() => {
        
        if (navigator.userAgent.includes("Windows")) {
            document.querySelectorAll('.windows-only').forEach(el => {
              el.classList.add('is-windows'); // Add a class for Windows users
            });
          } else {
            document.querySelectorAll('.windows-only').forEach(el => {
              el.classList.remove('is-windows'); // Ensure the class is removed for non-Windows users
            });
          }
          
    }, [])

    return (
      <MobileContextProvider>
        <MasterCounterContextProvider>
          <PocketProvider>
            <PopupContextProvider>
              <ActiveYearProvider>
                <NewApplicationPopupContextProvider>
                    <Header />

                    <Body counter={counter} setCounter={setCounter} />

                    <MobileNavTabs />
                </NewApplicationPopupContextProvider>
              </ActiveYearProvider>
            </PopupContextProvider>
          </PocketProvider>
        </MasterCounterContextProvider>
      </MobileContextProvider>
    )
}