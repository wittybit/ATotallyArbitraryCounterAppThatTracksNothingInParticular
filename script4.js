document.addEventListener('DOMContentLoaded', () => {
    const counterElement = document.getElementById('counter');
    const undoButton = document.getElementById('undoButton');

    const memeClips = [
        'APyEATPHbIg', //bruh
        '1lPwKDwVCYo', //old man stairs
        'OZw9L-PkRKs'
        // Add more video IDs as needed
    ];

    let count = getCookie('counter') ? parseInt(getCookie('counter')) : 0;
    counterElement.innerText = count;

    document.body.addEventListener('click', (event) => {
        if (event.target !== undoButton) {
            count++;
            counterElement.innerText = count;
            setCookie('counter', count, 365);
            launchConfetti();
            if (count >= 3) {
                playRandomMeme();
            }
        }
    });

    undoButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (count > 0) {
            count--;
            counterElement.innerText = count;
            setCookie('counter', count, 365);
        }
    });

    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cname) == 0) {
                return c.substring(cname.length, c.length);
            }
        }
        return "";
    }

    function launchConfetti() {
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 150 * (timeLeft / duration);

            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.0, 1.0), y: 0 } }));
        }, 250);
    }

    function playRandomMeme() {
        const randomIndex = Math.floor(Math.random() * memeClips.length);
        const memeClipId = memeClips[randomIndex];
        const memeElement = document.createElement('div');
        memeElement.id = `player-${memeClipId}`;
        memeElement.style.position = 'absolute';
        memeElement.style.width = '300px';
        memeElement.style.height = '200px';

        const randomX = Math.random() * (window.innerWidth - 300);
        const randomY = Math.random() * (window.innerHeight - 200);
        memeElement.style.left = `${randomX}px`;
        memeElement.style.top = `${randomY}px`;

        document.body.appendChild(memeElement);

        const playerVars = {
            autoplay: 1,
            controls: 0,  // Hide controls
            modestbranding: 1
        };

        new YT.Player(memeElement.id, {
            height: '200',
            width: '300',
            videoId: memeClipId,
            playerVars: playerVars,
            showInfo: 0,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerReady(event) {
        console.log('onPlayerReady event:', event);
        event.target.playVideo();
    }

    function onPlayerStateChange(event) {
        console.log('onPlayerStateChange event:', event);
        if (event.data === 0) {
            const playerElement = event.target.getIframe();
            document.body.removeChild(playerElement);
        }
    }

    // This function loads the IFrame Player API code asynchronously.
    function onYouTubeIframeAPIReady() {
        // This function is required by the YouTube API, but we don't need to do anything here
    }
});
