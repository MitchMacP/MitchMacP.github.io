import * as THREE from "three";

class AudioManager {
    constructor() {
        this.listener = new THREE.AudioListener();
        this.loader = new THREE.AudioListener();
        this.buffers = {};
    }

    setup(camera) {
        camera.add(this.listener);
    }
}

export const audioManager = new AudioManager();




