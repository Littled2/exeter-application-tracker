import { onPageLoad, onAllPagesLoad } from "/headless-cms-scripts/client-side-router.js";
import { Moving_Points } from "/scripts/moving-points.min.js"


onPageLoad('/', () => {

    new Moving_Points(document.querySelector("#hero-canvas"), 30)
    
    const word = document.getElementById("hero-word")
    let counter = 0
    let options = [ "Grad Schemes", "Jobs", "Placements", "Internships" ]

    setInterval(() => {
        word.innerText = options[counter++ % options.length]
    }, 2000);

})