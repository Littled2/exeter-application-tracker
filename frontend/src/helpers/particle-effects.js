import confetti from "canvas-confetti";


function fireConfetti(particleRatio, opts) {

    let count = 200;
    let defaults = {
        origin: { y: 0.7 }
    };

    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
}

function celebrateConfetti() {
    fireConfetti(0.25, {
        spread: 26,
        startVelocity: 55,
    })
    fireConfetti(0.2, {
        spread: 60,
    })
    fireConfetti(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    })
    fireConfetti(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    })
    fireConfetti(0.1, {
        spread: 120,
        startVelocity: 45,
    })
}

export {
    fireConfetti,
    celebrateConfetti
}