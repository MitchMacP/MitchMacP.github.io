import * as THREE from "three";

const audioLoader = new THREE.AudioLoader();
export const sounds = {}; 
export let activeListener = null;

export function setAudioListener(listener) {
    activeListener = listener;
}

export function loadSound(name, path, listener, volume = 1, loop = false) {
    const sound = new THREE.Audio(activeListener);
    
    audioLoader.load(path, (buffer) => {
        sound.setBuffer(buffer);
        sound.setVolume(volume);
        sound.setLoop(loop);
        
        sounds[name] = sound;
    });
}

export function loadSoundGroup(name, paths, listener, volume = 1) {
    sounds[name] = []; 

    paths.forEach(path => {
        const sound = new THREE.Audio(activeListener);
        audioLoader.load(path, (buffer) => {
            sound.setBuffer(buffer);
            sound.setVolume(volume);
            sounds[name].push(sound);
        });
    });
}

export function playSound(name) {
    const target = sounds[name];
    if (!target) return;

    if (Array.isArray(target)) {
        const randomSound = target[Math.floor(Math.random() * target.length)];
        if (randomSound.isPlaying) randomSound.stop();
        randomSound.play();
    } else {
        if (target.isPlaying) target.stop();
        target.play();
    }
}

export function setAmbienceVolume(volumeLevel) {
    const ambient = sounds['shipAmbience'];
    if (ambient) {
        ambient.setVolume(volumeLevel);
    }
}


export function muteAudio(isMuted, listener) {
    listener.setMasterVolume(isMuted ? 0 : 1);
}
