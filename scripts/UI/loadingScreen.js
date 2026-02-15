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
    loadingScreen.style.background = 'url("./assets/loadingScreenBackground.png")';
    loadingScreen.style.backgroundSize = "cover"; 
    loadingScreen.style.backgroundRepeat = "no-repeat";
    loadingScreen.style.backgroundPosition = "center";
    loadingScreen.style.zIndex = "11";

    document.body.appendChild(loadingScreen);

    const paragraph = document.createElement("p");
    const randomTipIndex = Math.floor(Math.random() * loadingTips.length);
    paragraph.textContent = loadingTips[randomTipIndex];
    paragraph.style.position = "absolute";
    paragraph.style.width = "35%";
    paragraph.style.textAlign = "justify";
    paragraph.style.bottom = "-10px";
    paragraph.style.left = "10px";
    paragraph.style.fontSize = "20pt";
    paragraph.style.color = "#fff";
    paragraph.style.border = "2px solid #fff"; 
    paragraph.style.borderRadius = "1px";
    paragraph.style.padding = "10px 15px";
    paragraph.style.background = "rgba(0,0,0,0.3)"; 
    loadingScreen.appendChild(paragraph);

    const loadingIcon = document.createElement("img");
    loadingIcon.src = "./assets/loadingIcon/loadingIcon.gif";
    loadingIcon.style.width = "12%";
    loadingIcon.style.position = "absolute";
    loadingIcon.style.bottom = "20px";
    loadingIcon.style.right = "50px";
    loadingScreen.appendChild(loadingIcon);

    this.el = loadingScreen;
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
}
