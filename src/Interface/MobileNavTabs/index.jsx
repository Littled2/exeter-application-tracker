import { BiCalendar, BiCheckboxChecked, BiListOl } from "react-icons/bi"
import styles from "./styles.module.css"
import { BsGraphUp } from "react-icons/bs"
import { useMobile } from "../../contexts/mobileContext"
import { useEffect, useState } from "react";
import { usePopupsContext } from "../../contexts/popupsContext";
import { IoBarChartOutline, IoCalendarOutline, IoCheckboxOutline, IoDocumentsOutline } from "react-icons/io5";


function useScrollDirection(buffer = 5) {
    const [scrollDirection, setScrollDirection] = useState('up');
    const [lastScrollY, setLastScrollY] = useState(window.scrollY);
  
    useEffect(() => {
      let timer;
  
      const handleScroll = () => {
        clearTimeout(timer);
  
        timer = setTimeout(() => {
          const currentScrollY = window.scrollY;
  
          if (currentScrollY > lastScrollY + buffer) {
            setScrollDirection('down');
          } else if (currentScrollY < lastScrollY - buffer) {
            setScrollDirection('up');
          }
  
          setLastScrollY(currentScrollY);
        }, 100); // Adjust the debounce time as needed
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timer);
      };
    }, [lastScrollY, buffer]);
  
    return scrollDirection;
}



export function MobileNavTabs() {

    const { isMobile, activeMobileTab, setActiveMobileTab } = useMobile()

    const scrollDirection = useScrollDirection(5); // Buffer of 10px

    const { popups } = usePopupsContext()

    return isMobile && (
        <nav className={[ styles.nav, scrollDirection === 'up' ? styles.show : styles.hide ].join(' ')}>

            <button onClick={() => setActiveMobileTab('applications')} className={[ styles.tabLink, activeMobileTab === 'applications' ? styles.selected : '' ].join(' ')}>
                <div className={styles.icon}>
                    <IoDocumentsOutline />
                </div>
                <p className={styles.label}>Applications</p>
            </button>

            <button onClick={() => setActiveMobileTab('deadlines')} className={[ styles.tabLink, activeMobileTab === 'deadlines' ? styles.selected : '' ].join(' ')}>
                <div className={styles.icon}>
                    <IoCalendarOutline />
                </div>
                <p className={styles.label}>Deadlines</p>
            </button>

            <button onClick={() => setActiveMobileTab('tasks')} className={[ styles.tabLink, activeMobileTab === 'tasks' ? styles.selected : '' ].join(' ')}>
                <div className={styles.icon}>
                    <IoCheckboxOutline />
                </div>
                <p className={styles.label}>Tasks</p>
            </button>

            <button onClick={() => setActiveMobileTab('analytics')} className={[ styles.tabLink, activeMobileTab === 'analytics' ? styles.selected : '' ].join(' ')}>
                <div className={styles.icon}>
                    <IoBarChartOutline />
                </div>
                <p className={styles.label}>Analytics</p>
            </button>

        </nav>
    )
}