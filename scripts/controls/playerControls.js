import * as THREE from "three";

const titleImages = {
  front: "./assets/FlightDeckText.png",
  right: "./assets/ProjectDisplayText.png",
  back: "./assets/SkillsWorkstationText.png",
  left: "./assets/ContactBeaconText.png"
};

let controlsActive = false;

export function setActive(active) {
  controlsActive = active;
}

export function initPlayerControls(camera, ui) {
  let targetRotationY = camera.rotation.y;
  let movePressed = null; 

  function rotateCamera(deg, dir) {
    targetRotationY += THREE.MathUtils.degToRad(deg);
    movePressed = dir; 
  }

  window.addEventListener("keydown", (e) => {
    if (e.repeat || !controlsActive) return;

    if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") rotateCamera(-90, "right");
    if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") rotateCamera(90, "left");
  });

  return function update() {
    camera.rotation.y = THREE.MathUtils.lerp(
      camera.rotation.y,
      targetRotationY,
      0.25
    );

    if (ui) {
      let degY = THREE.MathUtils.radToDeg(camera.rotation.y);
      degY = (degY % 360 + 360) % 360;
      let direction = "front";

      if (degY >= 45 && degY < 135) direction = "left";
      else if (degY >= 135 && degY < 225) direction = "back";
      else if (degY >= 225 && degY < 315) direction = "right";

      ui.setTopLeftImage(titleImages[direction]);
    }

    const pressed = movePressed;
    movePressed = null;
    return pressed;
  };
}


