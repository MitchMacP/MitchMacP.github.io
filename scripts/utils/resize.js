export function handleResize(camera, renderer) {

  function resize() {

    const width = renderer.domElement.parentElement.clientWidth;
    const height = renderer.domElement.parentElement.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize);
  resize();
}
