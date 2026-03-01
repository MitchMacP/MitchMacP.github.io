import * as THREE from "three";

export function addLighting(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.1));

  const hemiLight = new THREE.HemisphereLight(0xFFEEDC, 0x000000, 2);
  scene.add(hemiLight);

  const hologramLight = new THREE.PointLight(0x00ffff, 0.6, 100);
  hologramLight.position.set(0, -0.09, -0.55);
  scene.add(hologramLight);

  const projectsLogoLight = new THREE.PointLight(0xff7c00, 0.1, 50);
  projectsLogoLight.position.set(0.3, .2, 0);
  scene.add(projectsLogoLight);

  const projectsLogoLight2 = new THREE.PointLight(0xff7c00, 0.2, 100);
  projectsLogoLight2.position.set(0.3, -0.1, 0);
  scene.add(projectsLogoLight2);

  const computerLight = new THREE.PointLight(0x0058a8, 1, 0.1);
  computerLight.position.set(-0.05, -0.055, 0.495);
  scene.add(computerLight);

  const contactBeaconLight = new THREE.PointLight(0x0058a8, 2.5, 0.5);
  contactBeaconLight.position.set(-0.5, -0.055, 0);
  scene.add(contactBeaconLight);

  const unityLightRange = 0.3;

  const unityLight = new THREE.PointLight(0xFFFFFF, 0.5, unityLightRange);
  unityLight.position.set(-0.52, -0.35, 0.5);
  scene.add(unityLight);

  const unityLight2 = new THREE.PointLight(0xFFFFFF, 0.5, unityLightRange);
  unityLight2.position.set(-0.4, -0.35, 0.55);
  scene.add(unityLight2);

  const unityLight3 = new THREE.PointLight(0xFFFFFF, 0.5, unityLightRange);
  unityLight3.position.set(-0.52, -0.15, 0.52);
  scene.add(unityLight3);

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
