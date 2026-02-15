export let playerUIActive = false;

export const controlsUIState = {
    NORMAL: "NORMAL",
    LEFT_HOVER: "LEFT_HOVER", 
    RIGHT_HOVER: "RIGHT_HOVER",
    A_PRESSED: "A_PRESSED",
    D_PRESSED: "D_PRESSED",
}

export class PlayerUI {

  constructor({
    containerId = "ui-root",
    imgSrc = null,         
    topLeftSrc = null,     
    width = 512,
    height = 64,
    bottom = 10,
    left = 10,
    topLeftWidth = 512,
    topLeftHeight = 64,
    topLeftTop = 10,
    topLeftLeft = 10
  } = {}) {
    // Create root container if it doesn't exist
    this.root = document.getElementById(containerId);
    if (!this.root) {
      this.root = document.createElement("div");
      this.root.id = containerId;
      this.root.style.position = "fixed";
      this.root.style.inset = "0";
      this.root.style.pointerEvents = "none"; 
      this.root.style.zIndex = "9";
      document.body.appendChild(this.root);
    }

    // --- Bottom-left image (original) ---
    this.bottomLeftImage = document.createElement("img");
    if (imgSrc) this.bottomLeftImage.src = imgSrc;
    this.bottomLeftImage.style.position = "absolute";
    this.bottomLeftImage.style.left = `${left}px`;
    this.bottomLeftImage.style.bottom = `${bottom}px`;
    this.bottomLeftImage.style.width = `${width}px`;
    this.bottomLeftImage.style.height = `${height}px`;
    this.bottomLeftImage.style.imageRendering = "pixelated"; 
    this.bottomLeftImage.style.pointerEvents = "none"; 
    this.root.appendChild(this.bottomLeftImage);

    // --- Top-left image (new) ---
    this.topLeftImage = document.createElement("img");
    if (topLeftSrc) this.topLeftImage.src = topLeftSrc;
    this.topLeftImage.style.position = "absolute";
    this.topLeftImage.style.left = `${topLeftLeft}px`;
    this.topLeftImage.style.top = `${topLeftTop}px`;
    this.topLeftImage.style.width = `${topLeftWidth}px`;
    this.topLeftImage.style.height = `${topLeftHeight}px`;
    this.topLeftImage.style.imageRendering = "pixelated"; 
    this.topLeftImage.style.pointerEvents = "none"; 
    this.root.appendChild(this.topLeftImage);
  }

  // Set bottom-left image
  setImage(src) {
    this.bottomLeftImage.src = src;
  }

  setControlsImage(state=controlsUIState.NORMAL) {
    switch(state){
      case controlsUIState.NORMAL:
        this.bottomLeftImage.src = "./assets/ControlsUI.png";
        break;
      case controlsUIState.A_PRESSED:
        this.bottomLeftImage.src = "./assets/PlayerUI/ControlsUI_A_Pressed.png"
        break;
      case controlsUIState.D_PRESSED:
        this.bottomLeftImage.src = "./assets/PlayerUI/ControlsUI_D_Pressed.png"
        break;
      case controlsUIState.LEFT_HOVER:
        this.bottomLeftImage.src = "./assets/PlayerUI/ControlsUI_Left_Hover.png"
        break;
      case controlsUIState.RIGHT_HOVER:
        this.bottomLeftImage.src = "./assets/PlayerUI/ControlsUI_Right_Hover.png"
        break;
    }
  }

animateControlsImage(state) {
  if (state === controlsUIState.NORMAL) return;

  this.setControlsImage(state);

  setTimeout(() => {
    this.setControlsImage(controlsUIState.NORMAL);
  }, 100);
}

  // Set top-left image
  setTopLeftImage(src) {
    this.topLeftImage.src = src;
  }

  show() {
    playerUIActive = true;
    this.bottomLeftImage.style.display = "block";
    this.topLeftImage.style.display = "block";
  }

  hide() {
    playerUIActive = false;
    this.bottomLeftImage.style.display = "none";
    this.topLeftImage.style.display = "none";
  }
}
