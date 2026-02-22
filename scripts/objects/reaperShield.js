import * as THREE from "three";
import { FBXLoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/FBXLoader.js';

const loader = new FBXLoader();

export async function createShield(modelPath) {
    try {
        const object = await loader.loadAsync(modelPath);        
        return object;
    } catch (error) {
        console.error("Error loading FBX:", error);
    }
}

