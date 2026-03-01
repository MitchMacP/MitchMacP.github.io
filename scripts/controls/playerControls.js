import * as THREE from "three";

const titleImages = {
  front: "./assets/FlightDeckText.png",
  right: "./assets/ProjectDisplayText.png",
  back: "./assets/SkillsWorkstationText.png",
  left: "./assets/ContactBeaconText.png"
};

let controlsActive = false;
let keyListenerAttached = false;

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

  if (!keyListenerAttached) {
    window.addEventListener("keydown", (e) => {
      if (e.repeat || !controlsActive) return;

      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight")
        rotateCamera(-90, "right");

      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft")
        rotateCamera(90, "left");
    });

    keyListenerAttached = true;
  }

  function update(delta) {
    if (!delta) delta = 1 / 60;

    const lerpFactor = 1 - Math.exp(-15 * delta);

    camera.rotation.y = THREE.MathUtils.lerp(
      camera.rotation.y,
      targetRotationY,
      lerpFactor
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
  }

  return {
    update,
    rotateLeft: () => rotateCamera(90, "left"),
    rotateRight: () => rotateCamera(-90, "right"),
  };
}




