import { muteAudio, activeListener } from "../Audio/audioManager.js";

const loadingTips = [
  "Tip: Try clicking the console.",
  "Tip: Cartridges contain previous projects.",
  "\"I think I left my computer unlocked...\"",
  "ALERT: \"The CV blaster has been set to max\"",
];

export class LoadingScreen {
  constructor() {

    const loadingScreen = document.createElement("div");
    loadingScreen.id = "loadingScreen";
    loadingScreen.style.position = "fixed";
    loadingScreen.style.top = "0";
    loadingScreen.style.left = "0";
    loadingScreen.style.width = "100vw";
    loadingScreen.style.height = "100vh";
    loadingScreen.style.background = 'url("./assets/loadingScreenBackground.png") no-repeat center';
    loadingScreen.style.backgroundSize = "100% auto"; 
    loadingScreen.style.zIndex = "10000";
    document.body.appendChild(loadingScreen);

    const topOverlay = document.createElement("div");
    topOverlay.style.position = "absolute";
    topOverlay.style.top = "0";
    topOverlay.style.left = "0";
    topOverlay.style.width = "100%";
    topOverlay.style.height = "20%";        
    topOverlay.style.backgroundColor = "rgba(103, 136, 162, 1)";
    topOverlay.style.zIndex = "12";
    loadingScreen.appendChild(topOverlay);

    const bottomOverlay = document.createElement("div");
    bottomOverlay.style.position = "absolute";
    bottomOverlay.style.bottom = "0";
    bottomOverlay.style.left = "0";
    bottomOverlay.style.width = "100%";
    bottomOverlay.style.height = "20%";     
    bottomOverlay.style.backgroundColor = "rgba(103, 136, 162, 1)"; 
    loadingScreen.appendChild(bottomOverlay);

    this.paragraph = document.createElement("p");
    const randomTipIndex = Math.floor(Math.random() * loadingTips.length);
    this.paragraph.textContent = loadingTips[randomTipIndex];
    this.paragraph.style.position = "absolute";
    this.paragraph.style.width = "auto";
    this.paragraph.style.textAlign = "justify";
    this.paragraph.style.bottom = "-10px";
    this.paragraph.style.left = "10px";
    this.paragraph.style.fontSize = "20pt";
    this.paragraph.style.color = "#fff";
    this.paragraph.style.border = "2px solid #fff"; 
    this.paragraph.style.borderRadius = "1px";
    this.paragraph.style.padding = "10px 15px";
    this.paragraph.style.background = "rgba(0,0,0,0.3)"; 
    loadingScreen.appendChild(this.paragraph);

    this.loadingIcon = document.createElement("img");
    this.loadingIcon.src = "./assets/loadingIcon/loadingIcon.gif";
    this.loadingIcon.style.width = "12%";
    this.loadingIcon.style.position = "absolute";
    this.loadingIcon.style.bottom = "20px";
    this.loadingIcon.style.right = "50px";
    loadingScreen.appendChild(this.loadingIcon);

    this.continueButton = document.createElement("button");
    this.continueButton.style.width = "256px";
    this.continueButton.style.height = "64px";
    this.continueButton.style.backgroundSize = "100% 100%";
    this.continueButton.style.backgroundRepeat = "no-repeat";
    this.continueButton.style.backgroundPosition = "center";

    this.continueButton.style.position = "absolute";
    this.continueButton.style.right = `30px`;
    this.continueButton.style.bottom = `15px`;
    this.continueButton.style.imageRendering = "pixelated";
    this.continueButton.style.border = "none";
    this.continueButton.style.padding = "0";
    this.continueButton.style.cursor = "pointer";
    this.continueButton.style.pointerEvents = "auto";
    this.continueButton.style.display = "none";
    this.continueButton.style.border = "2px solid #fff"; 
    this.continueButton.classList.add("continueButton");
    this.continueButton.textContent = "Continue";
    loadingScreen.appendChild(this.continueButton);

    this.el = loadingScreen;

    loadingScreen.style.pointerEvents = "all";
    loadingScreen.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    loadingScreen.addEventListener("mousedown", (e) => {
      e.stopPropagation();
    });
  }

  show() {
    this.el.style.display = "block";
    this.el.style.opacity = "1";
  }

async hide(duration = 350) {
    const steps = 30;
    const stepTime = duration / steps;
    let opacity = 1;

    for (let i = 0; i < steps; i++) {
      opacity -= 1 / steps;
      this.el.style.opacity = opacity;
      await new Promise(resolve => setTimeout(resolve, stepTime));
    }

    this.el.style.display = "none";
  }

  showContinueButton() {
    this.continueButton.style.display = "block";
    this.loadingIcon.style.display = "none";
    this.paragraph.style.display = "none";
    //muteAudio(false, activeListener);
    this.continueButton.addEventListener("click", () => {
      this.hide();
    });
  }
}


