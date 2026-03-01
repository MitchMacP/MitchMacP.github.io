import * as THREE from "three";
import { createShield } from "./reaperShield.js";
import { tooltipState } from "../tooltipState.js";
import { panels } from "../interaction/projectsData.js";

export const loadingManager = new THREE.LoadingManager();

const loader = new THREE.TextureLoader(loadingManager);

loadingManager.onLoad = () => {
  console.log("Loaded ship");
}

function createBox({ name, texture, position, geometry, rotationY = 0, rotationZ = 0, url, panelInfo, wrapRepeat, canClick = false, state = tooltipState.PROJECT}) {

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

function createCartridge({ name, texture, position = [0, 0, 0], rotationY = 0, panelInfo }) {
  /*
  let material;
  if (texture) {
    const tex = loader.load(texture);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    material = new THREE.MeshStandardMaterial({
      map: tex,
      color: 0xffffff,
      flatShading: true
    });
  } else {
    material = new THREE.MeshStandardMaterial({
      color: 0x888888,
      flatShading: true
    });
  }

  const bodyGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
  const cartridgeMesh = new THREE.Mesh(bodyGeometry, material);

  cartridgeMesh.name = name;
  cartridgeMesh.position.set(...position);
  cartridgeMesh.rotation.y = rotationY;

  cartridgeMesh.userData = {
    clickable: true,
    title: panelInfo?.title,
    description: panelInfo?.description,
    imageUrl: panelInfo?.imageUrl,
    iframeUrl: panelInfo?.iframeUrl,
    downloadLink: panelInfo?.downloadLink,
    customHtml: panelInfo?.customHtml,
    creationDate: panelInfo?.creationDate, 
    galleryPath: panelInfo?.galleryPath,
    smallDescription: panelInfo?.smallDescription,
  };

  return cartridgeMesh;
  */

  
    const container = new THREE.Group();
    const scaleValue = 0.00025;

    createShield("./assets/Models/gameCartridge.fbx").then((cartridge) => {
        cartridge.scale.set(scaleValue, scaleValue, scaleValue);
        cartridge.rotation.y = rotationY;
        cartridge.position.set(...position);

        const cartridgePanelInfo = {
          clickable: true,
          title: panelInfo?.title,
          description: panelInfo?.description,
          imageUrl: panelInfo?.imageUrl,
          iframeUrl: panelInfo?.iframeUrl,
          downloadLink: panelInfo?.downloadLink,
          customHtml: panelInfo?.customHtml,
          creationDate: panelInfo?.creationDate, 
          galleryPath: panelInfo?.galleryPath,
          smallDescription: panelInfo?.smallDescription,
        };

        cartridge.traverse((child) => {
            if (child.isMesh) {
                child.userData = cartridgePanelInfo;

                if (child.material.map) {
                    child.material.map.magFilter = THREE.NearestFilter;
                    child.material.map.minFilter = THREE.NearestFilter;
                    child.material.map.needsUpdate = true;
                }
                child.material.transparent = false; 
                child.material.opacity = 1.0;       
                child.material.alphaTest = 0;
                child.material.needsUpdate = true;
            }
        });

        container.add(cartridge);
    });

    return container;
  
}

function createShelf(name, position) {

  const tex = loader.load("./assets/wood.png");

  let material = new THREE.MeshStandardMaterial({
    map: tex,
    color: 0x888888,
    flatShading: true
  });

  const geometry = new THREE.BoxGeometry(0.1, 0.025, 0.2);
  const shelf = new THREE.Mesh(geometry, material);

  shelf.name = name;
  shelf.position.set(...position);

  return shelf;
}

function createProjectsShelf() {
  // --- Projects Wall --- //
  const wallTex = loader.load("./assets/wallTexture.png");
  wallTex.magFilter = THREE.NearestFilter;
  wallTex.minFilter = THREE.NearestFilter;
  wallTex.generateMipmaps = false;

  const wallBodyGeometry = new THREE.BoxGeometry(0.5, 1, 0.74);
  const wallBodyMaterial = new THREE.MeshStandardMaterial({
    map: wallTex,
    color: 0x929292
  });

  const projectsWall = new THREE.Mesh(wallBodyGeometry, wallBodyMaterial);
  projectsWall.name = "ProjectsWall";
  projectsWall.position.set(0.75, 0, 0);

  // --- Display --- //
  const displayTexure = loader.load("./assets/blueWall.png");
  displayTexure.magFilter = THREE.NearestFilter;
  displayTexure.minFilter = THREE.NearestFilter;
  displayTexure.wrapS = THREE.RepeatWrapping;
  displayTexure.wrapT = THREE.RepeatWrapping;
  displayTexure.generateMipmaps = false;

  const displayBodyGeometry = new THREE.BoxGeometry(0.1, 1, 0.65);
  displayTexure.repeat.set(displayBodyGeometry.parameters.width, displayBodyGeometry.parameters.height);
  displayTexure.repeat.set(2, 2);
  const displayBodyMaterial = new THREE.MeshStandardMaterial({
    map: displayTexure,
    color: 0x929292
  });

  const projectDisplayText = createBox({
      name: "projectDisplayText",
      texture: "./assets/projectDisplayObjectText.png",
      position: [0.01, 0.2, 0],
      geometry: new THREE.BoxGeometry(0.65, 0.085, 0.22),
    });

  projectsWall.add(projectDisplayText);
    

  const displayObj = new THREE.Mesh(displayBodyGeometry, displayBodyMaterial);
  displayObj.name = "DisplayWall";
  displayObj.position.set(-0.21, 0, 0);
  projectsWall.add(displayObj);

  // --- Shelves --- //
  const leftShelf = createShelf("leftShelf", [-0.1, -0.035, -0.15]);
  displayObj.add(leftShelf);

  const rightShelf = createShelf("leftShelf", [-0.1, -0.035, 0.15]);
  displayObj.add(rightShelf);

  const leftBottomShelf = createShelf("leftShelf", [-0.1, -0.23, -0.15]);
  displayObj.add(leftBottomShelf);

  const rightBottomShelf = createShelf("leftShelf", [-0.1, -0.23, 0.15]);
  displayObj.add(rightBottomShelf);

  // --- Cartridges --- //
  const honoursCartridge = createCartridge({
    name: "HonoursCartidge",
    texture: "./assets/cartridge.png",
    position: [-0.1, 0.015, -0.2],
    rotationY: -7.9,
    panelInfo: panels.honours,
  });
  displayObj.add(honoursCartridge);
  const paperFaceCartridge = createCartridge({
    name: "PaperFaceCartridge",
    texture: "./assets/cartridge.png",
    position: [-0.1, -0.18, 0.2],
    rotationY: -7.9,
    panelInfo: panels.paperFace,
  });
  displayObj.add(paperFaceCartridge);
  const byronTheBinCartridge = createCartridge({
    name: "PaperFaceCartridge",
    texture: "./assets/cartridge.png",
    position: [-0.1, -0.18, -0.2],
    rotationY: -7.9,
    panelInfo: panels.byronTheBin,
  });
  displayObj.add(byronTheBinCartridge);
  const local58Cartridge = createCartridge({
    name: "Local58Cartridge",
    texture: "./assets/cartridge.png",
    position: [-0.1, 0.015, 0.1],
    rotationY: -7.9,
    panelInfo: panels.local58ReDesign,
  });
  displayObj.add(local58Cartridge);
  const interningAtValdivianCartridge = createCartridge({
    name: "Local58Cartridge",
    texture: "./assets/cartridge.png",
    rotationY: -7.9,
    position: [-0.1, -0.18, -0.1],
    panelInfo: panels.interningAtValdivian,
  });
  displayObj.add(interningAtValdivianCartridge);
  const wildfireCartridge = createCartridge({
    name: "WildfireCartridge",
    texture: "./assets/cartridge.png",
    position: [-0.1, -0.18, 0.1],
    rotationY: -7.9,
    panelInfo: panels.wildfire,
  });
  displayObj.add(wildfireCartridge);


  return projectsWall;
}

function createShowreelHologram({ name, texture, position }) {
  const tex = loader.load(texture);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;

  const material = new THREE.MeshStandardMaterial({
    map: tex,
    transparent: true,      
    alphaTest: 0.1,         
    depthWrite: false,      
    side: THREE.DoubleSide  
  });

  const geometry = new THREE.PlaneGeometry(0.3, 0.35);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);

  return mesh;
}


function createConsole({ name, texture, position, rotationY = 0, panelInfo }) {
  const tex = loader.load(texture);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;

  const bodyGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.25);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    map: tex,
    color: 0x555555,
    flatShading: true
  });

  const consoleMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  consoleMesh.name = name;
  consoleMesh.position.set(...position);
  consoleMesh.rotation.y = rotationY;

  const hoverGeometry = new THREE.BoxGeometry(0.35, 0.15, 0.3);
  const hoverMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false
  });

  const hoverMesh = new THREE.Mesh(hoverGeometry, hoverMaterial);
  hoverMesh.name = name + "_hover";
  hoverMesh.position.set(0, 0.25, 0);

  hoverMesh.userData = {
    clickable: true,
    title: panelInfo?.title,
    description: panelInfo?.description,
    imageUrl: panelInfo?.imageUrl,
    iframeUrl: panelInfo?.iframeUrl,
    downloadLink: panelInfo?.downloadLink,
    customHtml: panelInfo?.customHtml,
    creationDate: panelInfo?.creationDate, 
    galleryPath: panelInfo?.galleryPath,
    smallDescription: panelInfo?.smallDescription,
  };

  consoleMesh.add(hoverMesh);

  const showreelHologram = createShowreelHologram({
    name: "Showreel_Hologram",
    texture: "./assets/showreelHologram.png",
    position: [0, 0.23, -0.01], 
  });

  showreelHologram.userData.baseY = showreelHologram.position.y;

  consoleMesh.add(showreelHologram);


  return consoleMesh;
}


function createTransparentWindow({ name, texture, position, geometry, rotationY = 0, url, opacity = 0.3 }) {
  let materialOptions = {
    color: 0x3428BB,
    transparent: true,
    opacity: opacity,
    side: THREE.DoubleSide
  };

  if (texture) {
    materialOptions.map = loader.load(texture);
  }

  const material = new THREE.MeshStandardMaterial(materialOptions);

  const windowMesh = new THREE.Mesh(geometry, material);
  windowMesh.name = name;
  windowMesh.position.set(...position);
  windowMesh.rotation.y = rotationY;
  windowMesh.userData.url = url;
  windowMesh.geometry = geometry;

  return windowMesh;
}

function loadComputerModel(modelPath) {
    const container = new THREE.Group();

    createShield(modelPath).then((computer) => {
        computer.scale.set(0.0005, 0.0005, 0.0005);
        computer.rotation.y = Math.PI / 1.1;
        computer.position.set(-0.11, -0.13, 0.5);

        const computerPanelInfo = {
            clickable: true,
            tooltipState: tooltipState.PROJECT,
            title: "Computer [UNLOCKED]",
            skillTree: "",
            creationDate: "Feb, 2026",
            tooltipState: tooltipState.BLOG,
        };

        computer.traverse((child) => {
            if (child.isMesh) {
                child.userData = computerPanelInfo;

                if (child.material.map) {
                    child.material.map.magFilter = THREE.NearestFilter;
                    child.material.map.minFilter = THREE.NearestFilter;
                    child.material.map.needsUpdate = true;
                }
                child.material.transparent = false; 
                child.material.opacity = 1.0;       
                child.material.alphaTest = 0;
                child.material.needsUpdate = true;
            }
        });

        container.add(computer);
    });

    return container;
}

function loadContactBeaconModel(modelPath) {
    const container = new THREE.Group();

    createShield(modelPath).then((computer) => {
        computer.scale.set(0.00175, 0.00175, 0.00175);
        computer.rotation.y = Math.PI / 2;
        computer.position.set(-0.8, -0.46, 0);

        const computerPanelInfo = {
            clickable: true,
            title: "Contact Beacon [SEND MESSAGE]",
            tooltipState: tooltipState.CONTACT,
        };

        computer.traverse((child) => {
            if (child.isMesh) {
                child.userData = computerPanelInfo;

                if (child.material.map) {
                    child.material.map.magFilter = THREE.NearestFilter;
                    child.material.map.minFilter = THREE.NearestFilter;
                    child.material.map.needsUpdate = true;
                }
                child.material.transparent = false; 
                child.material.opacity = 1.0;       
                child.material.alphaTest = 0;
                child.material.needsUpdate = true;
            }
        });

        container.add(computer);
    });

    return container;
}

function loadWorkstationDeskModel(modelPath) {
    const container = new THREE.Group();

    createShield(modelPath).then((computer) => {
        computer.scale.set(0.0007, 0.0007, 0.0007);
        computer.rotation.y = Math.PI / 1;
        computer.position.set(-0.1, -0.30, 0.61);

        computer.traverse((child) => {
            if (child.isMesh) {

                if (child.material.map) {
                    child.material.map.magFilter = THREE.NearestFilter;
                    child.material.map.minFilter = THREE.NearestFilter;
                    child.material.map.needsUpdate = true;
                }
                child.material.transparent = false; 
                child.material.opacity = 1.0;       
                child.material.alphaTest = 0;
                child.material.needsUpdate = true;
            }
        });

        container.add(computer);
    });

    return container;
}


function loadShieldModel(modelPath) {
    const container = new THREE.Group();

    createShield(modelPath).then((shield) => {
        shield.scale.set(0.002, 0.002, 0.002);
        shield.rotation.y = Math.PI;
        shield.rotation.x = Math.PI / 7;
        shield.position.set(0.45, -.3, 0.6);

        const shieldPanelInfo = {
            clickable: true,
            tooltipState: tooltipState.PROJECT,
            title: "Audio Production",
            skillTree: ['Mixing', 'Mastering', 'Asset Creation', 'Foley', 'Spatial Audio'],
            skillDescription: 
            [
              'I ensure everything is balanced and clear, creating space for important sounds so the mix doesn’t become muddy or cluttered.', 
              'I make sure the final product translates well across different devices, whether it is being played through headphones or speakers.', 
              'I have experience creating assets across various aspects of sound design, including ambience, dialogue, UI, environments, and player sounds.', 
              'I am experienced in recording in both foley rooms and field environments, using a variety of microphones such as shotguns, condensers, and booms.', 
              'I have experience designing 3D sound environments for both linear and non-linear media.',
            ],
            creationDate: "Feb, 2026",
            tooltipState: tooltipState.SKILLS,
        };

        shield.traverse((child) => {
            if (child.isMesh) {
                child.userData = shieldPanelInfo;

                if (child.material.map) {
                    child.material.map.magFilter = THREE.NearestFilter;
                    child.material.map.minFilter = THREE.NearestFilter;
                    child.material.map.needsUpdate = true;
                }
                child.material.transparent = false; 
                child.material.opacity = 1.0;       
                child.material.alphaTest = 0;
                child.material.needsUpdate = true;
            }
        });

        container.add(shield);
    });

    return container;
}

function loadUnityModel(modelPath) {
    const container = new THREE.Group();

    createShield(modelPath).then((unity) => {
        const scaleValue = 0.0007;
        unity.scale.set(scaleValue, scaleValue, scaleValue);
        //unity.rotation.z = Math.PI / 6;
        //unity.rotation.z = Math.PI / 12;
        unity.rotation.y = Math.PI / -2;
        unity.position.set(-0.52, -0.35, 0.65);

        const shieldPanelInfo = {
            clickable: true,
            tooltipState: tooltipState.PROJECT,
            title: "Game Development",
            skillTree: ['Unity', 'Audio Implementation', 'QA & Testing', 'Group Development'],
            skillDescription: 
            [
              'I ensure everything is balanced and clear, creating space for important sounds so the mix doesn’t become muddy or cluttered.', 
              'I make sure the final product translates well across different devices, whether it is being played through headphones or speakers.', 
              'I have experience creating assets across various aspects of sound design, including ambience, dialogue, UI, environments, and player sounds.', 
              'I am experienced in recording in both foley rooms and field environments, using a variety of microphones such as shotguns, condensers, and booms.', 
            ],
            creationDate: "Feb, 2026",
            tooltipState: tooltipState.SKILLS,
        };

        unity.traverse((child) => {
            if (child.isMesh) {
                child.userData = shieldPanelInfo;

                if (child.material.map) {
                    child.material.map.magFilter = THREE.NearestFilter;
                    child.material.map.minFilter = THREE.NearestFilter;
                    child.material.map.needsUpdate = true;
                }
                child.material.transparent = false; 
                child.material.opacity = 1.0;       
                child.material.alphaTest = 0;
                child.material.needsUpdate = true;
            }
        });

        container.add(unity);
    });

    return container;
}

function loadDisplayTitleModel(modelPath) {
    const container = new THREE.Group();

    createShield(modelPath).then((computer) => {
        computer.scale.set(0.0006, 0.0006, 0.0006);
        computer.rotation.y = Math.PI / -2;
        computer.position.set(0.45, 0.2, 0);

        computer.traverse((child) => {
            if (child.isMesh) {

                if (child.material.map) {
                    child.material.map.magFilter = THREE.NearestFilter;
                    child.material.map.minFilter = THREE.NearestFilter;
                    child.material.map.needsUpdate = true;
                }
                child.material.transparent = false; 
                child.material.opacity = 1.0;       
                child.material.alphaTest = 0;
                child.material.needsUpdate = true;
            }
        });

        container.add(computer);
    });

    return container;
}

function loadUMLPosterBox({ geometry, position }) {
  const tex = loader.load("./assets/workStationBackground.png");

  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;


  const material = new THREE.MeshStandardMaterial({
    map: tex,
    color: 0x929292
  });

  const poster = new THREE.Mesh(geometry, material);
  poster.name = "Poster";
  poster.position.set(...position);
  poster.rotation.y = Math.PI / -2;

  const posterPanelInfo = {
    clickable: true,
    tooltipState: tooltipState.PROJECT,
    title: "Programming",
    skillTree: ['C#', 'Python', 'Java', 'Debugging', 'Web Development', 'Databases'],
    skillDescription: 
    [
      'I have used C# for .NET projects and Unity development. This has included game jams, group projects, and personal projects', 
      'I have used python for creating local web servers, and terminal apps.',
      'I have good knowledge in Java, primarily creating applications using Window Builder Pro.',
      'I have experience debugging coding issues through my experience as a student demonstrator and group projects. This also includes recording and prioritising certain bugs',
      'I have good knowledge in Javascript, PHP, HTML, and CSS, creating great web experiences',
      'I have experience using SQL in platforms such as PHPMyAdmin and linux server environments.',
    ],
    creationDate: "Feb, 2026",
    tooltipState: tooltipState.SKILLS,
  };

  poster.userData.clickable = true;
  poster.userData = posterPanelInfo;


  return poster;
}



export function createBoxes() {
  return [

    createProjectsShelf(),

    createBox({
      name: "deck_bottom_background",
      texture: "./assets/rustTexture.png",
      position: [0, -.3, -0.8],
      geometry: new THREE.BoxGeometry(2.05, 0.1, 0.1),
      wrapRepeat: [5, 0.1]
    }),

    // Top Deck Window Borders //
    createBox({
      name: "deck_top_background",
      texture: "./assets/rustTexture.png",
      position: [0, .5, -0.8],
      geometry: new THREE.BoxGeometry(2.05, 0.1, 0.1),
      wrapRepeat: [5, 0.1]
    }),

    createTransparentWindow({
      name: "deck_bottom_leftSideWindow",
      texture: "./assets/glassTexture.png",
      position: [0, 0.1, -0.77],
      geometry: new THREE.BoxGeometry(2, 0.75, 0.01),
      opacity: .17
    }),

    createBox({
      name: "deckBackground",
      texture: "./assets/greyMetalWall.png",
      position: [0, 0.1, -0.78],
      geometry: new THREE.BoxGeometry(0.5, .9, 0.1),
      wrapRepeat: [3, 0.8]
    }),
    createBox({
      name: "projects_wall",
      texture: "./assets/wallTexture.png",
      position: [0.85, .1, 0],
      geometry: new THREE.BoxGeometry(0.1, 1, 1.6),
      wrapRepeat: [2, 0.8]
    }),
    createBox({
      name: "contact_wall",
      texture: "./assets/wallTexture.png",
      position: [-0.85, .1, 0],
      geometry: new THREE.BoxGeometry(0.1, 1, 1.6),
      wrapRepeat: [2, 0.8]
    }),

    createBox({
      name: "skills_wall",
      texture: "./assets/wallTexture.png",
      position: [0, .1, 0.80],
      geometry: new THREE.BoxGeometry(1.6, 1, .01),
      wrapRepeat: [2, 0.8]
    }),

    createBox({
      name: "floor",
      texture: "./assets/floorTexture.png",
      position: [0, -0.6, 0],
      geometry: new THREE.BoxGeometry(2.5, 0.5, 2.0),
      wrapRepeat: [2, 2]
    }),


    createBox({
      name: "spaceBackground",
      texture: "./assets/spaceBackground.png",
      position: [0, .3, -1.2],
      geometry: new THREE.BoxGeometry(0.1, 1.3, 2.3),
      rotationY: Math.PI / 2,
    }),

    createConsole({
      name: "Console",
      texture: "./assets/consoleTexture.png",
      position: [0, -0.3, -0.55],
      panelInfo: panels.showreel
    }),

    createBox({
      name: "JobApplication",
      texture: "./assets/jobApplication.png",
      position: [-0.6, -0.35, -0.4],
      geometry: new THREE.BoxGeometry(0.1375, 0.001, 0.25),
      rotationY: Math.PI / 8,
      wrapRepeat: [1, 1],
      canClick: true,
      state: tooltipState.CV
    }),

    createBox({
      name: "JobApplication2",
      texture: "./assets/jobApplication.png",
      position: [-0.6, -0.34, -0.5],
      geometry: new THREE.BoxGeometry(0.1375, 0.001, 0.25),
      rotationY: Math.PI / 4,
      wrapRepeat: [1, 1],
      canClick: true,
      state: tooltipState.CV
    }),

    createBox({
      name: "JobApplication3",
      texture: "./assets/jobApplication.png",
      position: [0.45, -0.34, -0.6],
      geometry: new THREE.BoxGeometry(0.1375, 0.001, 0.2),
      rotationY: Math.PI / 4,
      wrapRepeat: [1, 1],
      canClick: true,
      state: tooltipState.CV
    }),

    createBox({
      name: "JobApplication4",
      texture: "./assets/jobApplication.png",
      position: [0.4, -0.35, -0.6],
      geometry: new THREE.BoxGeometry(0.1375, 0.001, 0.2),
      rotationY: Math.PI / 2,
      wrapRepeat: [1, 1],
      canClick: true,
      state: tooltipState.CV
    }),

    createBox({
      name: "JobApplication5",
      texture: "./assets/jobApplication.png",
      position: [0.22, -0.35, 0.65],
      geometry: new THREE.BoxGeometry(0.1375, 0.001, 0.2),
      rotationY: Math.PI / 12,
      wrapRepeat: [1, 1],
      canClick: true,
      state: tooltipState.CV
    }),


    loadShieldModel("./assets/Models/reaperShield_V4.fbx"),
    loadComputerModel("./assets/Models/computer.fbx"),
    loadWorkstationDeskModel("./assets/Models/workstationDesk.fbx"),
    loadDisplayTitleModel("./assets/Models/displayTitle.fbx"), 
    loadContactBeaconModel("./assets/Models/contactBeacon.fbx"),
    loadUnityModel("./assets/Models/UnityLogo.fbx"),
    loadUMLPosterBox({
      geometry: new THREE.BoxGeometry(0.01, .25, .25),
      position: [0.3, 0.055, 0.79],
    }),
  ];
} 
