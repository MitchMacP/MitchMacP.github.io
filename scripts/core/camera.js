import * as THREE from "three";

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    72,
    window.innerWidth / window.innerHeight,
    0.1,
    10
  );

  return camera;
}
