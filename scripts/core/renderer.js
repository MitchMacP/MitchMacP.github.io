import * as THREE from "three";

export function createRenderer(pixelated = false) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  document.body.appendChild(renderer.domElement);

  if (pixelated) {
    const wrapper = document.createElement("div");
    wrapper.style.width = "98.75vw";
    wrapper.style.height = "98vh";
    wrapper.style.position = "fixed";
    wrapper.style.top = "50%";
    wrapper.style.left = "50%";
    wrapper.style.transform = "translate(-50%, -50%)";
    wrapper.style.borderRadius = "5px";
    wrapper.style.overflow = "hidden";

    document.body.appendChild(wrapper);
    wrapper.appendChild(renderer.domElement);

    renderer.setSize(480, 360, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.imageRendering = "pixelated";
  } else {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // TODO: Fix this. Doesn't work //
  window.addEventListener("resize", () => {
    if (pixelated) {
      renderer.setSize(480, 360, false);
    } else {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  });

  return renderer;
}
