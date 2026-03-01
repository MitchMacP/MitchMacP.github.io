// * THIS IS NOT BEING USED YET *//


import * as THREE from "three";
import { tooltipState } from "../tooltipState.js";

export const loadingManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadingManager);

export function createBox({ name, texture, position, geometry, rotationY = 0, rotationZ = 0, url, panelInfo, wrapRepeat, canClick = false, state = tooltipState.PROJECT}) {

  const tex = loader.load(texture);

  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;

  if (wrapRepeat) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(wrapRepeat[0], wrapRepeat[1]);
  }

  const material = new THREE.MeshStandardMaterial({
    map: tex,
    color: 0x929292
  });

  const box = new THREE.Mesh(geometry, material);
  box.name = name;
  box.rotation.y = rotationY;
  box.rotation.z = rotationZ;
  box.position.set(...position);
  box.userData.url = url;
  box.userData.info = panelInfo?.description;
  box.userData.title = panelInfo?.title;
  box.userData.imageUrl = panelInfo?.imageUrl;
  box.userData.iframeUrl = panelInfo?.iframeUrl;
  box.userData.customHtml = panelInfo?.customHtml;
  box.geometry = geometry;

  if (canClick) {
    box.userData.clickable = true;
    if (state !== tooltipState.CV) {
      box.userData.title = panelInfo?.title;
      box.userData.description = panelInfo?.description;
      box.userData.creationDate = panelInfo?.creationDate;
    }
    box.userData.tooltipState = state;
  }

  return box;
}