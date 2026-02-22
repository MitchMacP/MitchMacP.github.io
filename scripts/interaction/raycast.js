import * as THREE from "three";
import { tooltipState } from "../objects/shipScene.js";
import { createGallery } from "./screenshotGallery.js";
import { galleryPaths } from "./galleryImageOptions.js";

export let panelActive = false;
let hoveredObject = null;
let tooltipActive = false;
let disableTooltip = false;

let defaultTooltipXPos = 145;
let defaultTooltipYPos = 35;

export function initRaycast(camera, objects) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function updateMouse(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onHoverEnter(object) {
  }

  function onHoverExit(object) {
  }

  const tooltip = document.createElement("div");
  tooltip.id = "ToolTip";
  tooltip.style.position = "fixed";
  tooltip.style.width = "25vw";
  tooltip.style.height = "fit-content";
  tooltip.style.background = "rgba(103, 159, 202, 0.6)";
  tooltip.style.outline = "solid 2px cyan";
  document.body.appendChild(tooltip);
  tooltip.style.display = "none";

  const backgroundPanel = document.createElement("div");
  backgroundPanel.id = "transparentBackground";
  backgroundPanel.style.position = "fixed";
  backgroundPanel.style.top = "50%";
  backgroundPanel.style.left = "50%";
  backgroundPanel.style.transform = "translate(-50%, -50%)";
  backgroundPanel.style.width = "100vw";
  backgroundPanel.style.height = "100vh";
  backgroundPanel.style.background = "rgba(0, 0, 0, 0.45)";
  backgroundPanel.style.zIndex = "9998";
  backgroundPanel.style.display = "none";
  backgroundPanel.style.pointerEvents = "all";
  backgroundPanel.addEventListener("click", (e) => {
  e.stopPropagation(); 
});

  document.body.appendChild(backgroundPanel);

  const panel = document.createElement("div");
  panel.id = "infoPanel";
  panel.style.position = "fixed";
  panel.style.top = "50%";
  panel.style.left = "50%";
  panel.style.width = "60vw";
  panel.style.height = "85vh";
  panel.style.transform = "translate(-50%, -50%)";
  panel.style.background = "rgba(103, 159, 202, 0.4)";
  panel.style.outline = "solid 2px cyan";
  panel.style.color = "#fff";
  panel.style.zIndex = "9999";
  panel.style.padding = "20px";
  panel.style.boxSizing = "border-box";
  panel.style.overflowY = "auto";

  backgroundPanel.appendChild(panel);

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function closePanel() {
    panel.classList.add("glitchOut");    
    await sleep(250);                 
    panel.classList.remove("glitchOut"); 
    content.innerHTML = "";
    backgroundPanel.style.display = "none";
    panelActive = false;
    disableTooltip = false;
  }

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = '<img style="width: 40pt;" src="./assets/xButton.png"/>';
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "15px";
  closeBtn.style.right = "10px";
  closeBtn.style.background = "transparent";
  closeBtn.style.border = "none";
  closeBtn.style.outline = "none";
  closeBtn.style.cursor = "pointer";
  closeBtn.addEventListener("click", () => {
    closePanel();
  });
  panel.appendChild(closeBtn);

  const content = document.createElement("div");
  content.id = "panelContent";
  content.style.width = "100%";
  content.style.height = "90%";
  content.style.fontSize = "18px";
  content.style.overflowY = "auto";

  content.style.display = "flex";
  content.style.flexDirection = "column";
  content.style.alignItems = "center";
  content.style.justifyContent = "center";
  panel.appendChild(content);

  function createPanelTemplate(data) {
  let html;
  panel.style.width = "60vw";
  panel.style.height = "85vh";

  switch (data.state) {
    case tooltipState.PROJECT:
      html = `
        <div class="tab">
          <button class="tablinks active" tab-data="general"><p>General</p></button>
          <button class="tablinks" tab-data="screenshots"><p>Screenshots</p></button>
          <button class="tablinks" tab-data="extras"><p>Extras</p></button>
        </div>

        <div id="general" class="tab-content panel_general_div" >
          <h1 class="panel_h1">
            ${data.title || "No Title"}
          </h1>
          <p class="panel_p">
            ${data.description || "No Description"}
          </p>
          
        ${data.iframeUrl ? 
          `<iframe 
              id="youtubeFrame" 
              src="${data.iframeUrl}?autoplay=1" 
              style="width:60%; height:25vh; border: 2px solid cyan; margin-top: 20px;"
              data-src="${data.iframeUrl}?autoplay=1">
          </iframe>` 
          : ''
        }
        </div> 
        <div id="screenshots" class="tab-content" style="display: none; flex-direction: column; align-items: center;">
          <h1 class="panel_h1">Additional Screenshots</h1>
          ${createGallery(data.galleryPath)}
        </div>

        <div id="extras" class="tab-content" style="display: none; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
          ${data.downloadLink ? 
            `
            <p class="panel_p">You can download the project here:</p>
            <a href="${data.downloadLink}" target="_blank">
              <button style="padding: 10px 20px; font-family: 'VT_Font'; cursor: pointer; background: rgba(0, 255, 255, 0.2); border: 2px solid cyan; color: white;">
                Visit Itch.io Page
              </button>
            </a>` 
            : (data.customHtml || "<p class='panel_p' style='margin-top: 50px;'>No Extras</p>")
          }
        </div>
      `;
      break;
    case tooltipState.CV:
      panel.style.width = "40vw";
      panel.style.height = "40vh";
      html = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
          <h1>Do you want to download my CV?</h1>
          <a href="./assets/cv/MitchellMacPherson_CV.pdf" target="_blank">
            <button class="panel_button"><p class="tooltip_paragraph">Download</p></button>
          </a>
        </div>`;
      break;
    case tooltipState.BLOG:
      html = `<p>test</p>`
      break;

    default:
      html = `<h1>ERROR: Incorrect State Assigned</h1>`;
  }

  return html;
}

function switchTabs(tabName) {
  const allTabs = content.querySelectorAll(".tab-content");
  const youtubeFrame = document.getElementById("youtubeFrame");

  if (youtubeFrame) {
    if (tabName === "general") {
      youtubeFrame.src = youtubeFrame.dataset.src;
    } else {
      youtubeFrame.src = "";
    }
  }

  allTabs.forEach(tab => {
    tab.style.display = "none";
  });

  const activeTab = content.querySelector(`#${tabName}`);
  if (activeTab) {
    activeTab.style.display = "flex"; 
    activeTab.classList.add("glitch");

    setTimeout(() => activeTab.classList.remove("glitch"), 100);
  }
}

  function showPanel(object) {
    const panelData = {
      title: object.userData.title || object.name,
      description: object.userData.description || object.userData.info,
      imageUrl: object.userData.imageUrl,
      iframeUrl: object.userData.iframeUrl || object.userData.url,
      customHtml: object.userData.customHtml,
      state: object.userData.tooltipState || tooltipState.PROJECT,
      downloadLink: object.userData.downloadLink,
      galleryPath: object.userData.galleryPath,
      smallDescription: object.userData.smallDescription,
    };

    disableTooltip = true;
    hideTooltip();

    content.innerHTML = createPanelTemplate(panelData);
    backgroundPanel.style.display = "block";
    panelActive = true;

    panel.classList.add("glitchIn");
    setTimeout(() => panel.classList.remove("glitchIn"), 250);

    const tabButtons = content.querySelectorAll(".tab button"); 
    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const tabName = btn.getAttribute('tab-data');
        switchTabs(tabName);
      });
    });
  }

  // --- TOOLTIP --- //
  function createTooltipTemplate(data, state = tooltipState.PROJECT) {
    let html;
    tooltip.style.width = "25vw";


    switch (state) {
      case tooltipState.PROJECT:
        html = `
        <div class="tooltip_inner_div">
        <h1 class="tooltip_header">${data.title || "No Title"}</h1>
        <p class="tooltip_paragraph">
          <strong>Date:</strong> ${data.creationDate || "No Date"}
        </p>
        <p class="tooltip_paragraph">
          <strong>Description:</strong> ${data.smallDescription || "No Description"}
        </p>
        </div>`;
        break;
      case tooltipState.CV:
        html = `
        <div class="tooltip_inner_div">
          <h1 class="tooltip_header">Download CV</h1>
        </div>
        `;
        break;
      case tooltipState.SKILLS:
        tooltip.style.width = "50vw";
        html = `
        <div class="tooltip_inner_div">
          <h1 class="tooltip_header">${data.title}</h1>
          <ul>
            ${data.skillTree ? data.skillTree.map(skill => `<li>${skill}</li>`).join('') : ""}
          </ul>  
        </div>`;
        break;
      case tooltipState.BLOG:
        html = `
        <div class="tooltip_inner_div">
          <h1 class="tooltip_header">${data.title}</h1>
        </div>
        `;
    }

    return html;
  }

  function showTooltip(object) {
    if (!disableTooltip) {
      const tooltipData = {
        title: object.userData.title || object.name,
        description: object.userData.description || object.userData.info,
        smallDescription: object.userData.smallDescription,
        creationDate: object.userData.creationDate,
        skillTree: object.userData.skillTree,
      };

      const state = object.userData.tooltipState || tooltipState.PROJECT;

      tooltip.innerHTML = createTooltipTemplate(tooltipData, state);
      tooltip.style.display = "inline-block";
      tooltipActive = true;
    }
  }


  function hideTooltip() {
    tooltip.innerHTML = "";
    tooltip.style.display = "none";
    tooltipActive = false;
  }

  // --- MOUSE LISTENERS --- //

  window.addEventListener("click", (e) => {
    updateMouse(e);
    raycaster.setFromCamera(mouse, camera);

    const hit = raycaster.intersectObjects(objects)[0];
    if (hit) {
      const obj = hit.object;

      if (obj.userData.clickable && obj.userData.tooltipState != tooltipState.SKILLS) {
        showPanel(obj);
        switchTabs("general");
      }
      else if (obj.userData.clickable && obj.userData.url) {
        window.open(obj.userData.url, "_blank");
      }
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panelActive) {
      closePanel();
    }
  });

  window.addEventListener("mousemove", function (e) {

    updateMouse(e);
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(objects, true);

    let newHovered = null;

    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.userData.clickable) {
        newHovered = intersects[i].object;
        break;
      }
    }

    // Hover Enter
    if (newHovered !== null && hoveredObject !== newHovered) {

      if (hoveredObject !== null) {
        onHoverExit(hoveredObject); // leave previous
      }

      hoveredObject = newHovered;
      showTooltip(hoveredObject);
      onHoverEnter(hoveredObject); // enter new
    }

    // Hover Leave (nothing hovered anymore)
    if (newHovered === null && hoveredObject !== null) {
      hideTooltip();
      onHoverExit(hoveredObject);
      hoveredObject = null;
    }

    // Cursor change (no ternary)
    if (newHovered !== null) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }

    if (tooltipActive && !disableTooltip) {
      tooltip.style.left = e.clientX - defaultTooltipXPos + "px";
      tooltip.style.top = e.clientY - tooltip.offsetHeight - defaultTooltipYPos + "px";
    }
  });
}
