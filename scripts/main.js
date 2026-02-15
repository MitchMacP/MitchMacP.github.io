import { createRenderer } from "./core/renderer.js";
import { createCamera } from "./core/camera.js";
import { createScene } from "./core/scene.js";
import { ParticleSystem } from "./particles/paperParticles.js";
import { addLighting } from "./core/lighting.js";
import { createBoxes, loadingManager } from "./objects/boxes.js";
import { initPlayerControls, setActive } from "./controls/playerControls.js";
import { initRaycast, panelActive } from "./interaction/raycast.js";
import { handleResize } from "./utils/resize.js";
import { PlayerUI, playerUIActive, controlsUIState } from "./controls/playerUI.js";
import { LoadingScreen } from "./UI/loadingScreen.js";
import { setCursor } from "./controls/cursor.js";
import * as THREE from "three";

// --- Renderer --- //
const renderer = createRenderer(true);
const camera = createCamera();
const scene = createScene();

const clock = new THREE.Clock();

// --- Cursor --- //
setCursor(renderer);

// --- Lighting --- //
addLighting(scene);

// --- Loading Screen --- //
const loading = new LoadingScreen();

// --- Player UI --- //
const playerUI = new PlayerUI({
  imgSrc: "./assets/ControlsUI.png",
  topLeftSrc: "./assets/top-left-image.png",
  bottom: 25,
  left: 20,
  topLeftTop: 25,
  topLeftLeft: 20
});

playerUI.setImage("./assets/ControlsUI.png");
playerUI.setTopLeftImage("./assets/FlightDeckText.png");
playerUI.hide();

// --- On Load --- //
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
loadingManager.onLoad = async () => {
  await wait(300);
  loading.hide();
  await wait(250);
  setActive(true);
  playerUI.show();
  // TO DO: Enable Ship Soundsdd
  console.log("Main environment loaded");
};

// --- Load Environment --- //
const boxes = createBoxes();
boxes.forEach(box => scene.add(box));

const updateControls = initPlayerControls(camera, playerUI);
initRaycast(camera, boxes);
handleResize(camera, renderer);

// --- Particle System --- //
const particleSystem = new ParticleSystem(scene, {
  spawnRate: 3,       
  speed: 0.05,        
  startX: -1.2,         
  endX: 1.25,            
  yRange: [-0.4, 0.8],       
  zRange: [-1, -1]        
});

function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  
  const elapsed = clock.getElapsedTime();

  particleSystem.update(delta);

  const move = updateControls();
  if (move) {
    console.log("Player moved:", move);
    if (move == "left") {
      playerUI.animateControlsImage(controlsUIState.A_PRESSED);
    }
    else if (move == "right") {
      playerUI.animateControlsImage(controlsUIState.D_PRESSED);
    }
    // You can also do additional things here if needed
  }

const hologram = scene.getObjectByName("Showreel_Hologram");
if (hologram) {

  if (hologram.userData.baseY === undefined) {
    hologram.userData.baseY = hologram.position.y;
  }

  hologram.position.y =
    hologram.userData.baseY + Math.sin(elapsed * 2) * 0.002;
}



  renderer.render(scene, camera);

  // --- Set UI State based on Panel state --- //
  if (panelActive && playerUIActive) {
    playerUI.hide();
  } else {
    if (!panelActive && !panelActive) {  // <-- probably you meant !playerUIActive here
      playerUI.show();
    }
  }
}


animate();
