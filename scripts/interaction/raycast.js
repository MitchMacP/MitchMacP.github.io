import * as THREE from "three";
import { tooltipState } from "../objects/boxes.js";

export let panelActive = false;
let hoveredObject = null;
let tooltipActive = false;
let disableTooltip = false;

export function initRaycast(camera, objects) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function updateMouse(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onHoverEnter(object) {
    console.log(object.userData.title + "hover enter");
  }

  function onHoverExit(object) {
    console.log(object.userData.title + "hover exit");
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
  backgroundPanel.style.background = "rgba(0, 0, 0, 0.25)";
  backgroundPanel.style.zIndex = "9998";
  backgroundPanel.style.display = "none";

  document.body.appendChild(backgroundPanel);

  const panel = document.createElement("div");
  panel.id = "infoPanel";
  panel.style.position = "fixed";
  panel.style.top = "50%";
  panel.style.left = "50%";
  panel.style.width = "60vw";
  panel.style.height = "80vh";
  panel.style.transform = "translate(-50%, -50%)";
  panel.style.background = "rgba(103, 159, 202, 0.4)";
  panel.style.outline = "solid 2px cyan";
  panel.style.color = "#fff";
  panel.style.zIndex = "9999";
  panel.style.padding = "20px";
  panel.style.boxSizing = "border-box";
  panel.style.overflowY = "auto";

  backgroundPanel.appendChild(panel);

  function closePanel() {
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

    switch (data.state) {
      case tooltipState.PROJECT:
        html = `
          <div class="tab">
            <button class="tablinks active" tab-data="general" "><p>General</p></button>
            <button class="tablinks" "><p>Screenshots</p></button>
            <button class="tablinks" "><p>Links</p></button>
          </div>
        <div class="general" style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <h1 style="font-size: 50pt; margin-bottom: 10px; text-align: center;">
            ${data.title || "No Title"}
          </h1>
          <p style="font-size: 15pt; margin-bottom: 60px; width: 50%; text-align: center;">
            ${data.description || "No Description"}
          </p>
        </div>
        `;

        if (data.iframeUrl) {
          html += `<iframe src="${data.iframeUrl}?autoplay=1" style="width:60%; height:90vh; border:none; border: 2px solid cyan;"></iframe>`;
        }

        if (data.customHtml) {
          html += data.customHtml;
        }
        break;
      case tooltipState.CV:
        html = `<h1>Do you want to download my CV?</h1>
                <a href="./assets/cv/MitchellMacPherson_CV.pdf" target="_blank":>
                  <button>Download</button>
                </a>
                `;
        break;
      case tooltipState.SKILLS:
        html = ``;

      case tooltipState.BLOG:
        html = ``;

      default:
        html = `<h1>ERROR: Incorrect State Assigned<h1>`;
    }


    return html;
  }

  function switchTabs(tabName) {
    console.log("Tab: " + tabName);
  }

  function showPanel(object) {
    const panelData = {
      title: object.userData.title || object.name,
      description: object.userData.description || object.userData.info,
      imageUrl: object.userData.imageUrl,
      iframeUrl: object.userData.iframeUrl || object.userData.url,
      customHtml: object.userData.customHtml,
      state: object.userData.tooltipState || tooltipState.PROJECT,
    };

    // Disable tooltip
    disableTooltip = true;
    hideTooltip();

    content.innerHTML = createPanelTemplate(panelData);
    backgroundPanel.style.display = "block";
    panelActive = true;

    const tabButtons = content.querySelectorAll(".tab button"); // query inside content
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

    switch (state) {
      case tooltipState.PROJECT:
        html = `
        <div style="content-align: center; justify-content: center; padding: 5px">
        <h1 style="font-size: 30pt; color: white;">${data.title || "No Title"}</h1>
        <p style="color: white; font-size: 15pt;">
          <strong>Date:</strong> ${data.creationDate || "No Date"}
        </p>
        <p style="color: white; font-size: 15pt;">
          <strong>Description:</strong> ${data.description || "No Description"}
        </p>
        </div>`;
        break;
      case tooltipState.CV:
        html = `
        <div style="display: flex; flex-direction: column; padding: 2px">
          <h1 style="font-size: 30pt; color: white;">Download CV</h1>
        </div>
        `;
        break;
      case tooltipState.SKILLS:
        html = `<h1>Skills</h1>`;
    }

    return html;
  }

  function showTooltip(object) {
    if (!disableTooltip) {
      const tooltipData = {
        title: object.userData.title || object.name,
        description: object.userData.description || object.userData.info,
        creationDate: object.userData.creationDate,
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

      if (obj.userData.clickable) {
        showPanel(obj);
        console.log(`${obj.userData.title} clicked`);
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
      tooltip.style.left = e.clientX - 1 + "px";
      tooltip.style.top = e.clientY - tooltip.offsetHeight - 35 + "px";
    }
  });
}
