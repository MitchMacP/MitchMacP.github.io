import * as THREE from "three";

export const loadingManager = new THREE.LoadingManager();

const loader = new THREE.TextureLoader(loadingManager);

loadingManager.onLoad = () => {
  console.log("Loaded ship");
}

export const tooltipState = {
  PROJECT: "PROJECT",
  CV: "CV",
  SKILLS: "SKILLS",
  BLOG: "BLOG",
}

function createBox({ name, texture, position, geometry, rotationY = 0, rotationZ = 0, url, panelInfo, wrapRepeat, canClick = false
  , state = tooltipState.PROJECT
}) {

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
    customHtml: panelInfo?.customHtml,
    creationDate: panelInfo?.creationDate
  };

  return cartridgeMesh;
}

function createShelf(name, position) {
  let material = new THREE.MeshStandardMaterial({
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
  const wallTex = loader.load("./assets/concrete.png");
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
    position: [-0.1, 0, -0.2],
    rotationY: 0,
    panelInfo: panels.honours,
  });
  displayObj.add(honoursCartridge);
  const paperFaceCartridge = createCartridge({
    name: "PaperFaceCartridge",
    texture: "./assets/cartridge.png",
    position: [-0.1, 0, -0.1],
    rotationY: 0,
    panelInfo: panels.paperFace,
  });
  displayObj.add(paperFaceCartridge);
  const byronTheBinCartridge = createCartridge({
    name: "PaperFaceCartridge",
    texture: "./assets/cartridge.png",
    position: [-0.1, 0, 0.1],
    rotationY: 0,
    panelInfo: panels.byronTheBin,
  });
  displayObj.add(byronTheBinCartridge);
  const local58Cartridge = createCartridge({
    name: "Local58Cartridge",
    texture: "./assets/cartridge.png",
    position: [-0.1, 0, 0.2],
    rotationY: 0,
    panelInfo: panels.local58ReDesign,
  });
  displayObj.add(local58Cartridge);
  const interningAtValdivianCartridge = createCartridge({
    name: "Local58Cartridge",
    texture: "./assets/cartridge.png",
    position: [-0.1, -0.2, -0.1],
    rotationY: 0,
    panelInfo: panels.interningAtValdivian,
  });
  displayObj.add(interningAtValdivianCartridge);
  const wildfireCartridge = createCartridge({
    name: "WildfireCartridge",
    texture: "./assets/cartridge.png",
    position: [-0.1, -0.2, 0.1],
    rotationY: 0,
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

  const geometry = new THREE.PlaneGeometry(0.3, 0.3);

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
    customHtml: panelInfo?.customHtml,
    creationDate: panelInfo?.creationDate
  };

  consoleMesh.add(hoverMesh);

  const showreelHologram = createShowreelHologram({
    name: "Showreel_Hologram",
    texture: "./assets/showreelHologram.png",
    position: [0, 0.22, -0.01], 
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


// dd
export const panels = {
  // Projects //
  showreel: {
    title: "Sound Design Showreel",
    description: "Re-Sound Design of some popular titles, such as Batman Arkham Knight, Portal 2, and Hollow Knight.",
    iframeUrl: "https://www.youtube.com/embed/tgbNymZ7vqY",
    creationDate: "April, 2025"
  },
  honours: {
    title: "Honours Project",
    description: "This console shows the latest projects.",
    iframeUrl: "https://www.youtube.com/embed/LyrI1rBP9qY",
    creationDate: "March, 2025"
  },
  paperFace: {
    title: "Paper Face",
    description: "Game made during the 2026 Global Game Jam."
      + "\n You are a bouncer at a masquerade ball. Use your criteria list to determine who to let into the party and who to turn away. Make sure you don't turn away the VIPs!",
    iframeUrl: "https://www.youtube.com/embed/tgbNymZ7vqY",
    creationDate: "February, 2026"
  },
  byronTheBin: {
    title: "Byron The Bin",
    description: "This console shows the latest projects.",
    iframeUrl: "https://www.youtube.com/embed/tgbNymZ7vqY",
    creationDate: "May, 2023"
  },
  local58ReDesign: {
    title: "Local58 Re-sound Design",
    description: "This is a re-sound design of the popular online series Local58.",
    iframeUrl: "https://www.youtube.com/embed/Naaq5xNNFOA",
    creationDate: "December, 2024"
  },
  interningAtValdivian: {
    title: "Interning At Valdivian",
    description: "This is a short gravity puzzle game. Instead of traditional jumping, players switch gravity to navigate challenging levels, avoiding obstacles and hazards along the way",
    iframeUrl: "https://www.youtube.com/embed/Naaq5xNNFOA",
    creationDate: "January, 2023"
  },
  wildfire: {
    title: "Wildfire",
    description: "This game was created for the 2025 V&A Game Jam in dundee.",
    iframeUrl: "https://www.youtube.com/embed/Naaq5xNNFOA",
    creationDate: "March, 2025"
  },
};

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
      position: [0, .3, -1.1],
      geometry: new THREE.BoxGeometry(0.1, 1.25, 2.1),
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
      geometry: new THREE.BoxGeometry(0.1875, 0.001, 0.3),
      rotationY: Math.PI / 8,
      wrapRepeat: [1, 1],
      canClick: true,
      state: tooltipState.CV
    }),

    createBox({
      name: "ToolRack",
      texture: "./assets/workStationBackground.png",
      position: [0.3, 0.055, 0.79],
      geometry: new THREE.BoxGeometry(0.01, .25, .25),
      rotationY: Math.PI / 2,
    }),

  ];
} 
