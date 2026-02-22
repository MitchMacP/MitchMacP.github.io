import * as THREE from "three";

export function addLighting(scene) {
  const hemiLight = new THREE.HemisphereLight(0xFFEEDC, 0x000000, 2);
  scene.add(hemiLight);

  const hologramLight = new THREE.PointLight(0x00ffff, 0.6, 100);
  hologramLight.position.set(0, -0.09, -0.55);
  scene.add(hologramLight);

  const projectsLogoLight = new THREE.PointLight(0xff7c00, 0.45, 100);
  projectsLogoLight.position.set(0.3, .2, 0);
  scene.add(projectsLogoLight);

  const computerLight = new THREE.PointLight(0x0058a8, 1, 0.15);
  computerLight.position.set(-0.09, -0.03, 0.495);
  scene.add(computerLight);

  const geometry = new THREE.ConeGeometry(0.2, 0.75, 10, 1, true);

  geometry.translate(0, -0.1, 0);

  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const beam = new THREE.Mesh(geometry, material);

  beam.rotation.z = -Math.PI / 1;
  beam.rotation.x = Math.PI / 12;

  beam.position.set(0, -0.39, -0.6);

  scene.add(beam);

  return { computerLight } ;


}
