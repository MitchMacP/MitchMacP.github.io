import * as THREE from "three";

class AudioMixer {
    constructor() {
        this.groups = {};
    }

    createGroup(name, volume = 1) {
        
    }

    setVolume(name, value) {
        if (this.groups[name]) {
            // TODO: change group volume through audiomanager //
        }
    }

    getGroup(name) {
        return this.groups[name] || null;
    }
}

export const audioMixer = new AudioMixer();