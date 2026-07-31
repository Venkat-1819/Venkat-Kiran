document.addEventListener('DOMContentLoaded', () => {
    // 1. Generate 300 Twinkling Stars
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
        const starCount = 300;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';

            // Random positions
            const x = Math.random() * 100;
            const y = Math.random() * 100;

            // Random star size (1px to 3.5px)
            const size = Math.random() * 2.5 + 1;

            // Random twinkle duration & delay
            const duration = Math.random() * 3 + 1.5;
            const delay = Math.random() * 4;

            star.style.left = `${x}vw`;
            star.style.top = `${y}vh`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDuration = `${duration}s`;
            star.style.animationDelay = `${delay}s`;

            fragment.appendChild(star);
        }

        starsContainer.appendChild(fragment);
    }

    // 2. Generate Fireflies
    const firefliesContainer = document.getElementById('fireflies-container');
    if (firefliesContainer) {
        const fireflyCount = 20;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < fireflyCount; i++) {
            const firefly = document.createElement('div');
            firefly.className = 'firefly';

            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 6 + 4;
            const delay = Math.random() * 5;

            firefly.style.left = `${x}vw`;
            firefly.style.top = `${y}vh`;
            firefly.style.animationDuration = `${duration}s`;
            firefly.style.animationDelay = `${delay}s`;

            fragment.appendChild(firefly);
        }

        firefliesContainer.appendChild(fragment);
    }

    // 3. Modal & Confetti & Music
    let isMusicPlaying = false;
    let audioCtx = null;

    const prettyLittleBabyNotes = [
        // "Pretty Little Baby" / "Hush Little Baby" Melody
        { note: 659.25, dur: 0.45 }, // E5
        { note: 587.33, dur: 0.45 }, // D5
        { note: 523.25, dur: 0.45 }, // C5
        { note: 659.25, dur: 0.45 }, // E5
        { note: 587.33, dur: 0.45 }, // D5
        { note: 523.25, dur: 0.45 }, // C5
        { note: 493.88, dur: 0.45 }, // B4
        { note: 440.00, dur: 0.45 }, // A4
        { note: 392.00, dur: 0.90 }, // G4

        { note: 392.00, dur: 0.45 }, // G4
        { note: 440.00, dur: 0.45 }, // A4
        { note: 493.88, dur: 0.45 }, // B4
        { note: 523.25, dur: 0.45 }, // C5
        { note: 587.33, dur: 0.45 }, // D5
        { note: 659.25, dur: 0.45 }, // E5
        { note: 587.33, dur: 0.45 }, // D5
        { note: 523.25, dur: 0.45 }, // C5
        { note: 493.88, dur: 0.45 }, // B4
        { note: 523.25, dur: 1.10 }, // C5

        { note: 783.99, dur: 0.45 }, // G5
        { note: 659.25, dur: 0.45 }, // E5
        { note: 523.25, dur: 0.45 }, // C5
        { note: 587.33, dur: 0.45 }, // D5
        { note: 659.25, dur: 0.45 }, // E5
        { note: 523.25, dur: 0.45 }, // C5
        { note: 440.00, dur: 0.45 }, // A4
        { note: 392.00, dur: 0.90 }, // G4

        { note: 392.00, dur: 0.45 }, // G4
        { note: 440.00, dur: 0.45 }, // A4
        { note: 523.25, dur: 0.45 }, // C5
        { note: 587.33, dur: 0.45 }, // D5
        { note: 659.25, dur: 0.45 }, // E5
        { note: 587.33, dur: 0.45 }, // D5
        { note: 523.25, dur: 0.45 }, // C5
        { note: 493.88, dur: 0.45 }, // B4
        { note: 523.25, dur: 1.20 }  // C5
    ];

    function playPrettyLittleBabyLoop() {
        if (!isMusicPlaying) return;
        try {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;
                audioCtx = new AudioContext();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            let currentTime = audioCtx.currentTime + 0.1;

            prettyLittleBabyNotes.forEach((n) => {
                const osc = audioCtx.createOscillator();
                const osc2 = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine';
                osc2.type = 'triangle';

                osc.frequency.setValueAtTime(n.note, currentTime);
                osc2.frequency.setValueAtTime(n.note * 2, currentTime);

                gain.gain.setValueAtTime(0.20, currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, currentTime + n.dur + 0.25);

                osc.connect(gain);
                osc2.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(currentTime);
                osc2.start(currentTime);
                osc.stop(currentTime + n.dur + 0.3);
                osc2.stop(currentTime + n.dur + 0.3);

                currentTime += n.dur;
            });

            const totalDuration = prettyLittleBabyNotes.reduce((acc, val) => acc + val.dur, 0);
            setTimeout(() => {
                if (isMusicPlaying) playPrettyLittleBabyLoop();
            }, totalDuration * 1000);
        } catch(e) {
            console.log('Audio loop error:', e);
        }
    }

    function createPrettyLittleBabyWavBlob() {
        const sampleRate = 22050;
        const totalSecs = prettyLittleBabyNotes.reduce((a, b) => a + b.dur, 0);
        const numSamples = Math.floor(sampleRate * totalSecs);
        const buffer = new Float32Array(numSamples);

        let sampleIndex = 0;
        prettyLittleBabyNotes.forEach(n => {
            const noteSamples = Math.floor(sampleRate * n.dur);
            const freq = n.note;
            for (let i = 0; i < noteSamples && sampleIndex < numSamples; i++) {
                const t = i / sampleRate;
                const env = Math.sin(Math.PI * (i / noteSamples));
                const wave1 = Math.sin(2 * Math.PI * freq * t);
                const wave2 = Math.sin(2 * Math.PI * freq * 2 * t) * 0.3;
                buffer[sampleIndex++] = (wave1 + wave2) * env * 0.25;
            }
        });

        const wavBuffer = new ArrayBuffer(44 + numSamples * 2);
        const view = new DataView(wavBuffer);

        function writeString(offset, string) {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        }

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + numSamples * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, numSamples * 2, true);

        let offset = 44;
        for (let i = 0; i < numSamples; i++) {
            const s = Math.max(-1, Math.min(1, buffer[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            offset += 2;
        }

        return new Blob([wavBuffer], { type: 'audio/wav' });
    }

    const music = {
        play: () => {
            if (isMusicPlaying) return;
            isMusicPlaying = true;

            const bgAudio = document.getElementById("bgMusic");
            if (bgAudio) {
                try {
                    if (!bgAudio.src) {
                        const blob = createPrettyLittleBabyWavBlob();
                        bgAudio.src = URL.createObjectURL(blob);
                    }
                    bgAudio.play().then(() => {
                        console.log("Pretty Little Baby background audio started.");
                    }).catch(err => {
                        console.log("Audio tag play deferred, starting WebAudio fallback:", err);
                        playPrettyLittleBabyLoop();
                    });
                } catch(e) {
                    console.log("Audio element error:", e);
                    playPrettyLittleBabyLoop();
                }
            } else {
                playPrettyLittleBabyLoop();
            }
        }
    };

    const btn = document.getElementById("startBtn") || document.getElementById("openBtn");

    if (btn) {
        btn.addEventListener("click", (e) => {
            // Flash Effect ⚡
            const flash = document.createElement("div");
            flash.style.position = "fixed";
            flash.style.top = "0";
            flash.style.left = "0";
            flash.style.width = "100vw";
            flash.style.height = "100vh";
            flash.style.background = "white";
            flash.style.zIndex = "9999";
            flash.style.pointerEvents = "none";
            flash.style.transition = "opacity 0.6s ease";
            document.body.appendChild(flash);
            setTimeout(() => {
                flash.style.opacity = "0";
                setTimeout(() => flash.remove(), 600);
            }, 50);

            // Music 🎵
            music.play();

            // Confetti 🎉
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 300,
                    spread: 120,
                    origin: { y: .6 }
                });
                setTimeout(() => {
                    confetti({
                        particleCount: 150,
                        angle: 60,
                        spread: 80,
                        origin: { x: 0 }
                    });
                    confetti({
                        particleCount: 150,
                        angle: 120,
                        spread: 80,
                        origin: { x: 1 }
                    });
                }, 300);
            }

            // Characters Celebrate ❤️
            ["puppyScene", "teddyScene", "pandaScene", "catScene", "bunnyScene"].forEach(id => {
                const el = document.getElementById(id);
                if (el && typeof gsap !== 'undefined') {
                    gsap.to(el, { y: -25, yoyo: true, repeat: 5, duration: 0.3 });
                }
            });

            // Glass Card Appears 💎 & Photo Zooms 📸
            if (typeof gsap !== 'undefined') {
                gsap.to("#birthdayCard", {
                    display: "block",
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "back.out(1.2)"
                });
                gsap.from(".profile", {
                    scale: 0.5,
                    duration: 1.2,
                    ease: "elastic.out(1, 0.5)"
                });
            } else {
                const card = document.getElementById("birthdayCard");
                if (card) {
                    card.style.display = "block";
                    card.style.opacity = "1";
                }
            }

            // Typing Starts ⌨️
            if (typeof Typed !== 'undefined') {
                const typedTextEl = document.getElementById("typedText");
                if (typedTextEl) typedTextEl.innerHTML = "";
                new Typed("#typedText", {
                    strings: [
                        "Advance Happiest Birthday Potatooooo❤️",
                        "You deserve endless happiness ✨",
                        "May every dream come true 💖",
                        "Stay happy forever 😊"
                    ],
                    typeSpeed: 60,
                    backSpeed: 30,
                    loop: true
                });
            }

            // Start Celebration Effects 💖🌸✨🎈
            if (typeof createHeart === 'function') setInterval(createHeart, 250);
            if (typeof createPetal === 'function') setInterval(createPetal, 450);
            if (typeof createSpark === 'function') setInterval(createSpark, 120);
            if (typeof createBalloon === 'function') setInterval(createBalloon, 1500);

            // Trigger Love Letter 💌
            setTimeout(() => {
                if (typeof showLetter === 'function') showLetter();
            }, 3500);
        });
    }

    // 4. Interactive Animals
    const animals = document.querySelectorAll('.animal');
    const heartEmojis = ['💖', '💕', '💗', '💓', '✨', '🌸', '🐾', '🧸', '⭐'];

    animals.forEach(animal => {
        animal.addEventListener('click', (e) => {
            animal.classList.remove('bounce');
            void animal.offsetWidth; // trigger reflow
            animal.classList.add('bounce');

            const randomEmoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            createFloatingHeart(e.clientX, e.clientY, randomEmoji);

            if (animal.id === 'a1' && typeof showTeddy === 'function') showTeddy();
            if (animal.id === 'a2' && typeof showPuppy === 'function') showPuppy();
            if (animal.id === 'a3' && typeof showPanda === 'function') showPanda();
        });
    });

    // Floating heart creator
    function createFloatingHeart(x, y, char = '❤️') {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = char;
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 1200);
    }
});

// 5. Birthday Countdown Timer (August 19)
const birthday = new Date("2026-08-19T00:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = birthday - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (distance < 0) {
        if (daysEl) daysEl.innerHTML = "00";
        if (hoursEl) hoursEl.innerHTML = "00";
        if (minutesEl) minutesEl.innerHTML = "00";
        if (secondsEl) secondsEl.innerHTML = "00";

        const countdownTitle = document.querySelector(".countdown-title");
        if (countdownTitle) countdownTitle.innerHTML = "🎉 Happy Birthday Ladduuuu ❤️";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerHTML = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerHTML = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.innerHTML = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.innerHTML = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Hide loading screen after 2.5 seconds
setTimeout(() => {
    if (typeof gsap !== 'undefined') {
        gsap.to("#loadingScreen", {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
                const ls = document.getElementById("loadingScreen");
                if (ls) ls.style.display = "none";
            }
        });
    } else {
        const ls = document.getElementById("loadingScreen");
        if (ls) {
            ls.style.transition = "opacity 0.8s ease";
            ls.style.opacity = "0";
            setTimeout(() => { ls.style.display = "none"; }, 800);
        }
    }
}, 2500);

// Puppy Intro (3s)
setTimeout(() => {
    showPuppy();
}, 3000);

// Teddy Intro (4.2s)
setTimeout(() => {
    showTeddy();
}, 4200);

// Panda Intro (5.4s)
setTimeout(() => {
    showPanda();
}, 5400);

// Cat Intro (6.6s)
setTimeout(() => {
    showCat();
}, 6600);

// Bunny Intro (7.8s)
setTimeout(() => {
    showBunny();
}, 7800);

function showPuppy() {
    const isMobile = window.innerWidth <= 600;
    const targetLeft = isMobile ? 10 : 30;
    if (typeof gsap !== 'undefined') {
        gsap.to("#puppyScene", { left: targetLeft, duration: 1.5, ease: "back.out(1.2)" });
        setTimeout(() => {
            gsap.to("#speech", { opacity: 1, duration: 0.8 });
        }, 1000);
    } else {
        const puppyScene = document.getElementById("puppyScene");
        const speech = document.getElementById("speech");
        if (puppyScene) {
            puppyScene.style.transition = "left 1.5s ease-out";
            puppyScene.style.left = targetLeft + "px";
        }
        setTimeout(() => {
            if (speech) {
                speech.style.transition = "opacity 0.8s ease";
                speech.style.opacity = "1";
            }
        }, 1000);
    }
}

function showTeddy() {
    const isMobile = window.innerWidth <= 600;
    const targetRight = isMobile ? 10 : 30;
    if (typeof gsap !== 'undefined') {
        gsap.to("#teddyScene", { right: targetRight, duration: 1.5, ease: "back.out(1.2)" });
        setTimeout(() => {
            gsap.to("#teddySpeech", { opacity: 1, duration: 0.8 });
        }, 1000);
    } else {
        const teddyScene = document.getElementById("teddyScene");
        const teddySpeech = document.getElementById("teddySpeech");
        if (teddyScene) {
            teddyScene.style.transition = "right 1.5s ease-out";
            teddyScene.style.right = targetRight + "px";
        }
        setTimeout(() => {
            if (teddySpeech) {
                teddySpeech.style.transition = "opacity 0.8s ease";
                teddySpeech.style.opacity = "1";
            }
        }, 1000);
    }
}

function showPanda() {
    const isMobile = window.innerWidth <= 600;
    const targetRight = isMobile ? 10 : 30;
    if (typeof gsap !== 'undefined') {
        gsap.to("#pandaScene", { right: targetRight, duration: 1.5, ease: "back.out(1.2)" });
        setTimeout(() => {
            gsap.to("#pandaSpeech", { opacity: 1, duration: 0.8 });
        }, 1000);
    } else {
        const pandaScene = document.getElementById("pandaScene");
        const pandaSpeech = document.getElementById("pandaSpeech");
        if (pandaScene) {
            pandaScene.style.transition = "right 1.5s ease-out";
            pandaScene.style.right = targetRight + "px";
        }
        setTimeout(() => {
            if (pandaSpeech) {
                pandaSpeech.style.transition = "opacity 0.8s ease";
                pandaSpeech.style.opacity = "1";
            }
        }, 1000);
    }
}

function showCat() {
    const isMobile = window.innerWidth <= 600;
    const targetLeft = isMobile ? 10 : 30;
    if (typeof gsap !== 'undefined') {
        gsap.to("#catScene", { left: targetLeft, duration: 1.5, ease: "back.out(1.2)" });
    } else {
        const catScene = document.getElementById("catScene");
        if (catScene) {
            catScene.style.transition = "left 1.5s ease-out";
            catScene.style.left = targetLeft + "px";
        }
    }
}

function showBunny() {
    const isMobile = window.innerWidth <= 600;
    const targetRight = isMobile ? 10 : 30;
    if (typeof gsap !== 'undefined') {
        gsap.to("#bunnyScene", { right: targetRight, duration: 1.5, ease: "back.out(1.2)" });
        setTimeout(() => {
            gsap.to("#bunnySpeech", { opacity: 1, duration: 0.8 });
        }, 1000);
    } else {
        const bunnyScene = document.getElementById("bunnyScene");
        const bunnySpeech = document.getElementById("bunnySpeech");
        if (bunnyScene) {
            bunnyScene.style.transition = "right 1.5s ease-out";
            bunnyScene.style.right = targetRight + "px";
        }
        setTimeout(() => {
            if (bunnySpeech) {
                bunnySpeech.style.transition = "opacity 0.8s ease";
                bunnySpeech.style.opacity = "1";
            }
        }, 1000);
    }
}

// ================= HEARTS =================
function createHeart() {
    const hearts = document.getElementById("hearts");
    if (!hearts) return;
    const heart = document.createElement("div");
    heart.className = "heartFloat";
    heart.innerHTML = "❤️";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (18 + Math.random() * 25) + "px";
    heart.style.animationDuration = (5 + Math.random() * 3) + "s";
    hearts.appendChild(heart);
    setTimeout(() => heart.remove(), 9000);
}

// ================= PETALS =================
function createPetal() {
    const petals = document.getElementById("petals");
    if (!petals) return;
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.innerHTML = "🌸";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = (6 + Math.random() * 4) + "s";
    petals.appendChild(petal);
    setTimeout(() => petal.remove(), 10000);
}

// ================= SPARKLES =================
function createSpark() {
    const sparkles = document.getElementById("sparkles");
    if (!sparkles) return;
    const s = document.createElement("div");
    s.className = "spark";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 100 + "vh";
    sparkles.appendChild(s);
    setTimeout(() => s.remove(), 2000);
}

// ================= BALLOONS =================
function createBalloon() {
    const balloons = document.getElementById("balloons");
    if (!balloons) return;
    const b = document.createElement("div");
    b.className = "balloon";
    b.innerHTML = "🎈";
    b.style.left = Math.random() * 100 + "vw";
    b.style.animationDuration = (10 + Math.random() * 5) + "s";
    balloons.appendChild(b);
    setTimeout(() => b.remove(), 15000);
}

// ================= LETTER =================
function showLetter() {
    const letterScene = document.getElementById("letterScene");
    if (letterScene) letterScene.style.display = "block";
    if (typeof Typed !== 'undefined') {
        const letterTextEl = document.getElementById("letterText");
        if (letterTextEl) letterTextEl.innerHTML = "";
        new Typed("#letterText", {
            strings: [
                `Advance Happiest Birthday Potatooo❤️<br><br>May your smile always stay beautiful 😊<br><br>May all your dreams come true ✨<br><br>May happiness follow you every single day 💖<br><br>I will be always there by ur side 🤗<br><br>i am here to irritate uuu 😜<br><br>Stay happy... Stay blessed...<br><br>Once again... Advance Happiest Birthday ❤️🎂<br><br>From ur stupid 🤪`
            ],
            typeSpeed: 35,
            showCursor: false,
            onComplete: () => {
                setTimeout(() => {
                    showFinalScene();
                }, 10000);
            }
        });
    } else {
        setTimeout(() => {
            showFinalScene();
        }, 15000);
    }
}

// ================= FINAL =================
function showFinalScene() {
    const letterScene = document.getElementById("letterScene");
    const finalScene = document.getElementById("finalScene");
    if (letterScene) letterScene.style.display = "none";
    if (finalScene) finalScene.style.display = "block";

    // Big Confetti Burst
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 500,
            spread: 180,
            origin: { y: 0.6 }
        });

        // Fireworks Effect
        const fireworks = setInterval(() => {
            confetti({
                particleCount: 120,
                angle: 60,
                spread: 70,
                origin: { x: 0 }
            });
            confetti({
                particleCount: 120,
                angle: 120,
                spread: 70,
                origin: { x: 1 }
            });
        }, 1200);

        // Stop after 15 seconds
        setTimeout(() => {
            clearInterval(fireworks);
        }, 15000);
    }
}


