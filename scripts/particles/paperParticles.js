import * as THREE from "three";

const loader = new THREE.TextureLoader();
const cvTexture = loader.load("./assets/jobApplication.png");

cvTexture.magFilter = THREE.NearestFilter;
cvTexture.minFilter = THREE.NearestFilter;
cvTexture.generateMipmaps = false;

const cvGeometry = new THREE.BoxGeometry(0.12, .2, 0.001);
const cvMaterial = new THREE.MeshStandardMaterial({
  map: cvTexture,
  color: 0x929292
});

const cvParticleTemplate = new THREE.Mesh(cvGeometry, cvMaterial);

export class ParticleSystem {
  constructor(scene, {
    spawnRate = 0.2,
    speed = 2,
    startX = -20,
    endX = 20,
    yRange = [-2, 2],
    zRange = [-2, 2],
    sizeRange = [0.8, 1.2],
  }) {
    this.scene = scene;
    this.spawnObject = cvParticleTemplate;
    this.spawnRate = spawnRate;
    this.speed = speed;
    this.startX = startX;
    this.endX = endX;
    this.yRange = yRange;
    this.zRange = zRange;
    this.sizeRange = sizeRange;

    this.particles = [];
    this.timeSinceLastSpawn = 0;

    this.preWarm();
  }

  preWarm() {
    const totalDistance = this.endX - this.startX;
    const spacing = this.speed * this.spawnRate;
    const count = Math.floor(totalDistance / spacing);

    for (let i = 0; i < count; i++) {
      const clone = this.spawnObject.clone(true);

      // Added a little random jitter to X so they aren't perfectly aligned
      const jitter = THREE.MathUtils.randFloat(-spacing * 0.5, spacing * 0.5);
      const initialX = this.startX + (i * spacing) + jitter;

      const scale = THREE.MathUtils.randFloat(this.sizeRange[0], this.sizeRange[1]);
      clone.scale.set(scale, scale, scale);
      clone.rotation.set(
        Math.PI * Math.random(),
        Math.PI * Math.random(),
        Math.PI * Math.random()
      );

      clone.position.set(
        initialX,
        THREE.MathUtils.randFloat(this.yRange[0], this.yRange[1]),
        THREE.MathUtils.randFloat(this.zRange[0], this.zRange[1])
      );

      this.scene.add(clone);
      this.particles.push(clone);
    }
  }

  spawn() {
    const clone = this.spawnObject.clone(true);

    const scale = THREE.MathUtils.randFloat(this.sizeRange[0], this.sizeRange[1]);
    clone.scale.set(scale, scale, scale);

    clone.rotation.set(
      Math.PI * Math.random(),
      Math.PI * Math.random(),
      Math.PI * Math.random()
    );

    clone.position.set(
      this.startX,
      THREE.MathUtils.randFloat(this.yRange[0], this.yRange[1]),
      THREE.MathUtils.randFloat(this.zRange[0], this.zRange[1])
    );

    this.scene.add(clone);
    this.particles.push(clone);
  }

  update(delta) {
    this.timeSinceLastSpawn += delta;
    if (this.timeSinceLastSpawn >= this.spawnRate) {
      this.spawn();
      this.timeSinceLastSpawn = 0;
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const obj = this.particles[i];
      obj.position.x += this.speed * delta;

      if (obj.position.x >= this.endX) {
        this.scene.remove(obj);
        // REMOVED: .dispose() calls. We want to keep the shared template alive!
        this.particles.splice(i, 1);
      }
    }
  }
}