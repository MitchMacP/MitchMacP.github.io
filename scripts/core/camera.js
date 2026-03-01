import * as THREE from "three";

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    50
  );

  return camera;
}


