export let playerUIActive = false;

export const controlsUIState = {
    NORMAL: "NORMAL",
    LEFT_HOVER: "LEFT_HOVER", 
    RIGHT_HOVER: "RIGHT_HOVER",
    A_PRESSED: "A_PRESSED",
    D_PRESSED: "D_PRESSED",
}

export const audioButtonStates = {
  MUTED: "Muted", 
  UNMUTED: "Unmuted", 
  MUTED_HOVER: "Muted_Hover", 
  UNMUTED_HOVER: "Unmuted_Hover",
}

export class PlayerUI {

  constructor({
    containerId = "ui-root",
    imgSrc = null,    
    controlRightSrc = null,     
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

    // --- Bottom-left image --- //
    this.bottomLeftImage = document.createElement("button");
    if (imgSrc) {
      this.bottomLeftImage.style.width = "256px";
      this.bottomLeftImage.style.height = "64px";
      this.bottomLeftImage.style.backgroundImage = `url(${imgSrc})`;
      this.bottomLeftImage.style.backgroundSize = "100% 100%";
      this.bottomLeftImage.style.backgroundRepeat = "no-repeat";
      this.bottomLeftImage.style.backgroundPosition = "center";
    }

    this.bottomLeftImage.style.position = "absolute";
    this.bottomLeftImage.style.left = `30px`;
    this.bottomLeftImage.style.bottom = `15px`;
    this.bottomLeftImage.style.imageRendering = "pixelated";
    this.bottomLeftImage.style.border = "none";
    this.bottomLeftImage.style.padding = "0";
    this.bottomLeftImage.style.backgroundColor = "transparent";
    this.bottomLeftImage.style.cursor = "pointer";
    this.bottomLeftImage.style.pointerEvents = "auto";
    this.root.appendChild(this.bottomLeftImage);

    this.bottomRightImage = document.createElement("button");
    if (controlRightSrc) {
      this.bottomRightImage.style.width = "325px";
      this.bottomRightImage.style.height = "64px";
      this.bottomRightImage.style.backgroundImage = `url(${controlRightSrc})`;
      this.bottomRightImage.style.backgroundSize = "100% 100%";
      this.bottomRightImage.style.backgroundRepeat = "no-repeat";
      this.bottomRightImage.style.backgroundPosition = "center";
    }
    this.bottomRightImage.style.position = "absolute";
    this.bottomRightImage.style.left = `260px`;
    this.bottomRightImage.style.bottom = `15px`;
    this.bottomRightImage.style.imageRendering = "pixelated";
    this.bottomRightImage.style.border = "none";
    this.bottomRightImage.style.padding = "0";
    this.bottomRightImage.style.backgroundColor = "transparent";
    this.bottomRightImage.style.cursor = "pointer";
    this.bottomRightImage.style.pointerEvents = "auto";
    this.root.appendChild(this.bottomRightImage);

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

  this.bottomLeftImage.addEventListener("mouseenter", () => {
    this.bottomLeftImage.style.backgroundImage = `url(./assets/PlayerUI/ControlsLeftHover.png)`;
  });

  this.bottomLeftImage.addEventListener("mouseleave", () => {
    this.bottomLeftImage.style.backgroundImage = `url(./assets/PlayerUI/ControlsLeft.png)`;
  });

  this.bottomRightImage.addEventListener("mouseenter", () => {
    this.bottomRightImage.style.backgroundImage = `url(./assets/PlayerUI/ControlsRightHover.png)`;
  });

  this.bottomRightImage.addEventListener("mouseleave", () => {
    this.bottomRightImage.style.backgroundImage = `url(./assets/PlayerUI/ControlsRight.png)`;
  });

    this.audioToggleButton = document.createElement("button");
    if (controlRightSrc) {
      this.audioToggleButton.style.width = "256px";
      this.audioToggleButton.style.height = "64px";
      this.audioToggleButton.style.backgroundImage = `url(./assets/audioToggle/unmuted.png)`;
      this.audioToggleButton.style.backgroundSize = "100% 100%";
      this.audioToggleButton.style.backgroundRepeat = "no-repeat";
      this.audioToggleButton.style.backgroundPosition = "center";
    }
    this.audioToggleButton.style.position = "absolute";
    this.audioToggleButton.style.right = `30px`;
    this.audioToggleButton.style.bottom = `15px`;
    this.audioToggleButton.style.imageRendering = "pixelated";
    this.audioToggleButton.style.border = "none";
    this.audioToggleButton.style.padding = "0";
    this.audioToggleButton.style.backgroundColor = "transparent";
    this.audioToggleButton.style.cursor = "pointer";
    this.audioToggleButton.style.pointerEvents = "auto";
    this.root.appendChild(this.audioToggleButton);

  }
  

  // Set bottom-left image
  setImage(src) {
    this.bottomLeftImage.src = src;
  }

  setControlsImage(state=controlsUIState.NORMAL) {
    switch(state){
      case controlsUIState.NORMAL:
        this.bottomLeftImage.style.backgroundImage = `url(./assets/PlayerUI/ControlsLeft.png)`;
        this.bottomRightImage.style.backgroundImage = `url(./assets/PlayerUI/ControlsRight.png)`;
        break;
      case controlsUIState.A_PRESSED:
        this.bottomLeftImage.style.backgroundImage = `url(./assets/PlayerUI/ControlsLeftPressed.png)`;
        this.bottomRightImage.style.backgroundImage = `url(./assets/PlayerUI/ControlsRight.png)`;
        break;
      case controlsUIState.D_PRESSED:
        this.bottomLeftImage.style.backgroundImage = `url(./assets/PlayerUI/ControlsLeft.png)`;
        this.bottomRightImage.style.backgroundImage = `url(./assets/PlayerUI/ControlsRightPressed.png)`;
        break;
      case controlsUIState.LEFT_HOVER:
        this.bottomLeftImage.src = "./assets/PlayerUI/ControlsUI_Left_Hover.png"
        break;
      case controlsUIState.RIGHT_HOVER:
        this.bottomLeftImage.src = "./assets/PlayerUI/ControlsUI_Right_Hover.png"
        break;
    }
  }

switchControl(isMuted) {
  if (isMuted) {
    this.audioToggleButton.style.backgroundImage = `url(./assets/audioToggle/mute.png)`;
  } 
  else {
    this.audioToggleButton.style.backgroundImage = `url(./assets/audioToggle/unmuted.png)`;
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
    this.bottomRightImage.style.display = "block";
    this.topLeftImage.style.display = "block";
    this.audioToggleButton.style.display = "block";
  }

  hide() {
    playerUIActive = false;
    this.bottomLeftImage.style.display = "none";
    this.bottomRightImage.style.display = "none";
    this.topLeftImage.style.display = "none";
    this.audioToggleButton.style.display = "none";
  }

  assignLeftButton(callback) {
    this.bottomLeftImage.addEventListener("click", callback);
  }

  assignRightButton(callback) {
    this.bottomRightImage.addEventListener("click", callback);
  }

  assignMuteButton(callback) {
    this.audioToggleButton.addEventListener("click", callback);
  }

  
}

