import * as THREE from "three";
import { FBXLoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/FBXLoader.js';
import { loadingManager } from "./shipScene.js"; 


export async function createShield(modelPath) {
    try {
        const loader = new FBXLoader(loadingManager); 
        const object = await loader.loadAsync(modelPath);        
        return object;
    } catch (error) {
        console.error("Error loading FBX:", error);
    }
}

