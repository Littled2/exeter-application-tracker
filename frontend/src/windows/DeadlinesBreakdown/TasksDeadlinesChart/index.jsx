import { useState } from "react"
import { Bar } from "react-chartjs-2"

export function TasksDeadlinesChart() {

    const [ chartData, setChartData ] = useState(null)

    // useEffect(() => {

    //     let a = new Date()
    //     const days = []
        
    //     for (let i = 0; i < 14; i++) {
    //         let b = new Date()
    //         b.setDate(a.getDate() + i)
    //         days.push(b.toISOString().slice(0, 10))
    //     }
    
    //     let days_map = {}

    //     days.forEach(day => {
    //         days_map[day] = [0, 0]
    //     })

    //     fetch(DOMAIN + "/get-tasks")
    //     .then(res => res.json())
    //     .then(tasksData => {
    //         tasksData.forEach(task => {

    //             if(!(task.deadline in days_map)) return

    //             // Has the task been completed?
    //             if(task.complete) {
    //                 days_map[task.deadline][0] += 1
    //             } else {
    //                 days_map[task.deadline][1] += 1
    //             }
    //         })


    //         setChartData({
    //             labels: days.map(d => d.substr(d.length-2, 2)),
    //             datasets: [
    //                 {
    //                     label: 'Complete',
    //                     data: days.map(day => days_map[day][0]),
    //                     backgroundColor: '#187da8'
    //                 },
    //                 {
    //                     label: 'Incomplete',
    //                     data: days.map(day => days_map[day][1]),
    //                     backgroundColor: '#8b0b20'
    //                 }
    //             ]
    //         })
    //     })
    // }, [])


    const options = {
        plugins: {
            legend: {
                display: false
            }
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
                ticks: { display: false }
            },
            y: {
                stacked: true,
            },
        }
    }

    return chartData !== null ? (
        <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
            <b style={{height: "1.2rem"}}><small>Task Deadlines (Nxt 14d)</small></b>
            <div style={{height:"calc(100% - 1.2rem)"}}>
                <Bar options={options} data={chartData} />
            </div>
        </div>
    ) : (
        <></>
    )
}