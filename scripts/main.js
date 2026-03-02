import { createRenderer } from "./core/renderer.js";
import { createCamera } from "./core/camera.js";
import { createScene } from "./core/scene.js";
import { ParticleSystem } from "./particles/paperParticles.js";
import { addLighting } from "./core/lighting.js";
import { createBoxes, loadingManager } from "./objects/shipScene.js";
import { initPlayerControls, setActive } from "./controls/playerControls.js";
import { initRaycast, panelActive } from "./interaction/raycast.js";
import { handleResize } from "./utils/resize.js";
import { PlayerUI, playerUIActive, controlsUIState } from "./controls/playerUI.js";
import { LoadingScreen } from "./UI/loadingScreen.js";
import { setCursor } from "./controls/cursor.js";
import { isMobile } from "./mobileDetector.js";
import {loadSound, loadSoundGroup, playSound, muteAudio, setAmbienceVolume, setAudioListener} from "./Audio/audioManager.js"
import * as THREE from "three";

// --- Redirect if mobile --- //
if (isMobile()) {
  window.location.href = "https://macpherson277.wixsite.com/home"; z
} 
else {
  // --- Renderer --- //
  const listener = new THREE.AudioListener();
  const camera = createCamera();
  camera.add(listener);
  
  setAudioListener(listener);
  
  // --- Loading Screen --- //
  const loading = new LoadingScreen();

  // --- Initialise Audio --- //
  loadSound('uiSelect', './assets/audioFiles/uiSelect.wav', listener, 1, false);
  loadSound('uiClose', './assets/audioFiles/uiClose.wav', listener, 1, false);
  loadSound('shipAmbience', './assets/audioFiles/shipAmbience.wav', listener, 1, true);
  loadSoundGroup('cameraTurn', [
    './assets/audioFiles/cameraTurn01.wav',
    './assets/audioFiles/cameraTurn02.wav',
    './assets/audioFiles/cameraTurn03.wav'
  ], listener, 0.5);
  let isMuted = false;

  
  const renderer = createRenderer(camera, true);
  const scene = createScene();
  
  const clock = new THREE.Clock();
  
  // --- Cursor --- //
  setCursor(renderer);
  
  // --- Lighting --- //
  const lights = addLighting(scene);
  
  // --- Player UI --- //
  const playerUI = new PlayerUI({
    imgSrc: "./assets/PlayerUI/ControlsLeft.png",
    topLeftSrc: "./assets/top-left-image.png",
    controlRightSrc: "./assets/PlayerUI/ControlsRight.png",
    bottom: 25,
    left: 20,
    topLeftTop: 15,
    topLeftLeft: 30
  });
  
  playerUI.setImage("./assets/PlayerUI/ControlsLeft.png");
  playerUI.setTopLeftImage("./assets/FlightDeckText.png");
  playerUI.hide();
  
  // --- On Load --- //
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  loadingManager.onLoad = async () => {
    await wait(5000);
    //loading.hide();
    loading.showContinueButton();
    await wait(250);
    setActive(true);
    playerUI.show();
    playSound("shipAmbience");
    console.log("Main environment loaded");
  };
  
  // --- Load Environment --- //
  const boxes = createBoxes();
  boxes.forEach(box => scene.add(box));
  
  const controls = initPlayerControls(camera, playerUI);
  const raycastTools = initRaycast(camera, boxes, renderer);
  handleResize(camera, renderer);
  
  // --- Assign Buttons --- //
  playerUI.assignLeftButton(() => {
    controls.rotateLeft();
  });
  playerUI.assignRightButton(() => {
    controls.rotateRight();
  });
  playerUI.assignMuteButton(() => {
    isMuted = !isMuted;
    playerUI.switchControl(isMuted);
    muteAudio(isMuted, listener);
  });
  
  
  // --- Particle System --- //
  const particleSystem = new ParticleSystem(scene, {
    spawnRate: 3,       
    speed: 0.05,        
    startX: -1.2,         
    endX: 1.25,            
    yRange: [-0.4, 0.8],       
    zRange: [-1, -1]        
  });
  
  let uiSoundPlayed = false;

  function animate() {
    
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    const cappedDelta = Math.min(delta, 0.05);
    const elapsed = clock.getElapsedTime();
  
    particleSystem.update(delta);
  
    if (lights.computerLight) {
      lights.computerLight.intensity = 1.75 + Math.random() * 0.2;
    }
  
    const move = controls.update(cappedDelta);
    if (move) {
      if (!panelActive) {
        raycastTools.hideTooltip();
      }
      switch (move) {
        case "left":
          playerUI.animateControlsImage(controlsUIState.A_PRESSED);
          playSound("cameraTurn");
          break;
        case "right":
          playerUI.animateControlsImage(controlsUIState.D_PRESSED);
          playSound("cameraTurn");
          break;
      }
    }  
  
  const hologram = scene.getObjectByName("Showreel_Hologram");
  if (hologram) {
  
    if (hologram.userData.baseY === undefined) {
      hologram.userData.baseY = hologram.position.y;
    }
  
    hologram.position.y =
      hologram.userData.baseY + Math.sin(elapsed * 2) * 0.002;
  }
if (!panelActive) {  
    setActive(true);
    playerUI.show();
    
    if (!uiSoundPlayed) {
      playSound("uiClose");
      setAmbienceVolume(1);
      uiSoundPlayed = true; 
    }
  } else {
    if (playerUIActive) {
        setActive(false);
        playSound("uiSelect");
        setAmbienceVolume(0);
        playerUI.hide();
        uiSoundPlayed = false; 
    }
  }  
  
  
    renderer.render(scene, camera);

  }
  
  
  animate();
}

