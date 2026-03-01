import * as THREE from "three";

export function createRenderer(camera, pixelated = true) {
  const renderer = new THREE.WebGLRenderer({ antialias: false }); 
  
  const internalWidth = 480;
  const internalHeight = 360;

  if (pixelated) {
    const wrapper = document.createElement("div");
    wrapper.id = "canvas-wrapper";
    
    wrapper.style.position = "fixed";
    wrapper.style.top = "50%";
    wrapper.style.left = "50%";
    wrapper.style.transform = "translate(-50%, -50%)";
    
    wrapper.style.width = "95vw"; 
    wrapper.style.maxHeight = "80vh"; 
    
    wrapper.style.aspectRatio = "4 / 3";
    wrapper.style.borderRadius = "5px";
    wrapper.style.overflow = "hidden";

    document.body.appendChild(wrapper);
    wrapper.appendChild(renderer.domElement);

    renderer.setSize(internalWidth, internalHeight, false);
    
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.imageRendering = "pixelated"; 
    renderer.domElement.style.imageRendering = "crisp-edges"; 
    
  } else {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  }

  return renderer;
}
