import * as THREE from "three";
import { tooltipState } from "../tooltipState.js";
import { createGallery } from "./screenshotGallery.js";
import { galleryPaths } from "./galleryImageOptions.js";
import { playSound, loadSoundGroup, activeListener, loadSound } from "../Audio/audioManager.js";

export let panelActive = false;
let hoveredObject = null;
let tooltipActive = false;
let disableTooltip = false;

export function setDisableTooltip(value) {
  disableTooltip = value;
}

let defaultTooltipXPos = 145;
let defaultTooltipYPos = 35;

const mouseSide = {
  LEFT: "Left",
  RIGHT: "Right",
}

export function initRaycast(camera, objects, renderer) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let currentSkillIndex = 0;
  let hasPlayedHover = false;

  loadSoundGroup('switch', [
  './assets/audioFiles/uiSwitch01.wav',
  './assets/audioFiles/uiSwitch02.wav',
  './assets/audioFiles/uiSwitch03.wav'
  ], activeListener, 0.5);
  loadSound('uiSkillSwitch', './assets/audioFiles/uiSkillSwitch.wav', activeListener, 1, false);
  loadSound('formSent', './assets/audioFiles/contactMessageSent.wav', activeListener, 1, false);
  loadSound('uiHover', './assets/audioFiles/uiHover.wav', activeListener, 0.1, false);
  loadSound('', './assets/audioFiles/uiHover.wav', activeListener, 0.1, false);

 

function updateMouse(event) {
  const rect = renderer.domElement.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  mouse.x = (x / rect.width) * 2 - 1;
  mouse.y = -(y / rect.height) * 2 + 1;
}

  function onHoverEnter(object) {
    if (!hasPlayedHover && !panelActive) {
      playSound("uiHover");
      hasPlayedHover = true;
    }
  }

  function onHoverExit(object) {
    hasPlayedHover = false;
  }

  let currentMouseSide = mouseSide.LEFT;

  const tooltip = document.createElement("div");
  tooltip.id = "ToolTip";
  tooltip.style.position = "fixed";
  tooltip.style.width = "25vw";
  tooltip.style.height = "fit-content";
  tooltip.style.background = "rgba(103, 159, 202, 0.9)";
  tooltip.style.outline = "solid 2px cyan";
  tooltip.style.zIndex = "9991";
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
  panel.style.background = "rgba(103, 159, 202, 0.9)";
  panel.style.outline = "solid 2px cyan";
  panel.style.color = "#fff";
  panel.style.zIndex = "9990";
  panel.style.boxSizing = "border-box";
  panel.style.overflowY = "scroll";
  panel.style.scrollbarWidth = "none";

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
  content.style.minHeight = "0";
  content.style.height = "100%";
  content.style.overflowY = "auto";
  content.style.fontSize = "18px";

  content.style.display = "flex";
  content.style.flexDirection = "column";
  content.style.alignItems = "center";
  content.style.justifyContent = "flex-start";
  panel.appendChild(content);

  function createPanelTemplate(data) {
    let html;
    panel.style.width = "60vw";
    panel.style.height = "85vh";

    switch (data.state) {
      case tooltipState.PROJECT:
        html = `
        <div class="tab">
          <button class="tablinks active" tab-data="general"><p>General [1]</p></button>
          <button class="tablinks" tab-data="screenshots"><p>Screenshots [2]</p></button>
          <button class="tablinks" tab-data="extras"><p>Extras [3]</p></button>
        </div>

        <div id="general" class="tab-content panel_general_div" >
          <h1 class="panel_h1">
            ${data.title || "No Title"}
          </h1>
          <p class="panel_p">
            ${data.description || "No Description"}
          </p>
          
        ${data.iframeUrl ?
            `
            <iframe 
                id="youtubeFrame" 
                src="${data.iframeUrl}?autoplay=1" 
                style="width: 60vh; aspect-ratio: 16 / 9; border: 2px solid cyan; "
                data-src="${data.iframeUrl}?autoplay=1">
            </iframe>
            `
            : ''
          }
        </div> 
        <div id="screenshots" class="tab-content">
          <h1 class="panel_h1">Additional Screenshots</h1>
          ${createGallery(data.galleryPath)}
        </div>

        <div id="extras" class="tab-content">
          ${data.downloadLink ?
            `
            <h1 class="panel_h2">Download / View project page:</h1>
            <a href="${data.downloadLink}" target="_blank">
              <button class="panel_button">
                Visit Itch.io Page
              </button>
            </a>`
            : (data.customHtml || "<p class='panel_p'>No Extras</p>")
          }
        </div>
      `;
        break;
      case tooltipState.CV:
        panel.style.width = "30vw";
        panel.style.height = "35vh";
        html = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
          <h1>Download my CV.</h1>
          <a href="./assets/cv/MitchellMacPherson_CV.pdf" target="_blank">
            <button class="panel_button"><p class="tooltip_paragraph">Open [↗]</p></button>
          </a>
        </div>`;
        break;
      case tooltipState.BLOG:
        panel.style.width = "30vw";
        panel.style.height = "35vh";
        html = `
          <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
            <h1>Blog coming soon...</h1>
          </div>`;
        break;
      case tooltipState.CONTACT:
        html = `
        <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <form class="panel_contact_form" id="contactForm">
              <h1>Send Message</h1>
              <input type="hidden" name="_subject" value="Website Contact Form">
              <label class="panel_contact_label">Your email:</label>
              <input type="email" name="email" required>
              <label class="panel_contact_label"> Your message:</label>
              <textarea name="message" required style="width: 400px; height: 200px; resize: none;"></textarea>
              <button class="panel_button" type="submit">Send</button>
            </form>
            <div id="contactStatus" style="margin-top: 10px; color: #fff;"></div>
        </div>
        `;
        break;
      case tooltipState.WELCOME:
        html = `
        <div id="welcome_container">
          <h1>Hi, I'm Mitchell.</h1>
          <br>
          <p>A graduate in sound design and a current MSc Computing student at Edinburgh Napier University. I have heavy experience working on game projects, particularly in sound design, programming, and quality assurance.</p>
          <br>
          <button class="panel_button" onclick=" window.open('https://www.linkedin.com/in/mitchell-macpherson-04b917219/','_blank')">LinkedIn [↗]</button>
          <button class="panel_button" onclick=" window.open('https://mmac0.itch.io/','_blank')">Itch.io [↗]</button>
          <button class="panel_button" onclick=" window.open('https://github.com/MitchMacP/','_blank')">GitHub [↗]</button>
          <br>
          <br>
          <br>
          <a class="website_attribution_hyperlink" href="./assets/cv/attribution.pdf" target="_blank">
            <p class="website_attribution_hyperlink">Website Attribution</p>
          </a>
        </div>
        `;
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
        playSound("switch");
        switchTabs(tabName);
      });
    });

    const contactForm = content.querySelector("#contactForm");
    if (contactForm) {
      const status = content.querySelector("#contactStatus");

      contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);

        try {
          const response = await fetch("https://formspree.io/f/xeelwlod", {
            method: "POST",
            body: formData,
            headers: { "Accept": "application/json" }
            });

            if (response.ok) {
              contactForm.reset(); 
              closePanel();
              playSound("formSent");
            } else {
              const data = await response.json();
              status.textContent = data.error || "Oops! Something went wrong.";
            }
          } catch (err) {
            status.textContent = "Oops! Something went wrong.";
            console.error(err);
          }
        });
      }

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
          <h1 class="tooltip_header">My CV</h1>
        </div>
        `;
        break;
      case tooltipState.SKILLS:
        tooltip.style.width = "50vw";
        currentSkillIndex = 0;
        html = `
        <div class="tooltip_skills_div">
          <div class="tooltip_skills_left">
            <h1 class="tooltip_skills_h1">${data.title}</h1>
            <ul id="skillsList">
              ${data.skillTree 
                ? data.skillTree.map((skill, index) =>
                    `<li class="tooltip_skills_list${index === currentSkillIndex ? ' active-skill' : ''}">${index === currentSkillIndex ? '>> ' + skill + ' <<' : skill}</li>`
                  ).join('')
                : ""}
            </ul>
            <p class="tooltip_skills_click">[CLICK TO CYCLE]</p>
        </div>
        <div class="tooltip_skills_right">
          <h1 class="tooltip_skills_title">${data.skillTree[currentSkillIndex]}</h1>
          <hr class="tooltip_skills_hr">
          <p class="tooltip_skills_description">
            ${data.skillDescription[currentSkillIndex] || ""}
          </p>
        </div>
        </div>`;
        break;
      case tooltipState.BLOG:
        html = `
        <div class="tooltip_inner_div">
          <h1 class="tooltip_header">${data.title}</h1>
        </div>`;
        break;
      case tooltipState.CONTACT:
        html = `
        <div class="tooltip_inner_div">
          <h1 class="tooltip_header">${data.title}</h1>
        </div>`;
        break;
      case tooltipState.WELCOME:
        html = `
        <h1 class="tooltip_header">Welcome!</h1>
        `;
        break;
    }

    return html;
  }

  function showTooltip(object) {
    if (!disableTooltip) {

      const tooltipData =
      {
        title: object.userData.title || object.name,
        description: object.userData.description || object.userData.info,
        smallDescription: object.userData.smallDescription,
        creationDate: object.userData.creationDate,
        skillTree: object.userData.skillTree,
        skillDescription: object.userData.skillDescription,
      };

      const state = object.userData.tooltipState || tooltipState.PROJECT;

      tooltip.innerHTML = createTooltipTemplate(tooltipData, state);
      tooltip.style.display = "inline-block";

      if (state === tooltipState.SKILLS) {
        if (currentMouseSide == mouseSide.RIGHT) {
          defaultTooltipXPos = -75;
          defaultTooltipYPos = -400;
        } else {
          defaultTooltipXPos = 75;
          defaultTooltipYPos = -250;
        }
      }
      else {
        defaultTooltipXPos = 75;
        defaultTooltipYPos = 35;
      }

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
    if (hoveredObject && 
        hoveredObject.userData.tooltipState === tooltipState.SKILLS &&
        tooltipActive) {

      const descriptions = hoveredObject.userData.skillDescription;
      const titles = hoveredObject.userData.skillTree;

      if (descriptions && descriptions.length > 0) {
        currentSkillIndex = (currentSkillIndex + 1) % descriptions.length;

        const titleElement = tooltip.querySelector(".tooltip_skills_title");
        if (titleElement) {
          titleElement.textContent = titles[currentSkillIndex];
        }

        const descElement = tooltip.querySelector(".tooltip_skills_description");
        if (descElement) {
          descElement.textContent = descriptions[currentSkillIndex];
        }
      }

      const skillItems = tooltip.querySelectorAll(".tooltip_skills_list");
      playSound("uiSkillSwitch");
      skillItems.forEach((item, index) => {
        const skillName = hoveredObject.userData.skillTree[index];
        
        if (index === currentSkillIndex) {
          item.textContent = ">> " + skillName + " <<";
        } else {
          item.textContent = skillName;
        }
      });

      return; 
    }


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
    if (panelActive) {
      switch (event.key) {
        case "Escape":
          closePanel();
          break;
          case "1":
            switchTabs("general");
            content.querySelectorAll(".tab button").forEach(b => {
              b.classList.toggle("active", b.getAttribute("tab-data") === "general");
            });
            playSound("switch");
          break;
        case "2":
          switchTabs("screenshots");
          content.querySelectorAll(".tab button").forEach(b => {
            b.classList.toggle("active", b.getAttribute("tab-data") === "screenshots");
          });
          playSound("switch");
          break;
        case "3":
          switchTabs("extras");
          content.querySelectorAll(".tab button").forEach(b => {
            b.classList.toggle("active", b.getAttribute("tab-data") === "extras");
          });
          playSound("switch");
          break;
      }
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

    if (newHovered !== null && hoveredObject !== newHovered) {

      if (hoveredObject !== null) {
        onHoverExit(hoveredObject); 
      }

      hoveredObject = newHovered;
      showTooltip(hoveredObject);
      onHoverEnter(hoveredObject); 
    }

    if (newHovered === null && hoveredObject !== null) {
      hideTooltip();
      onHoverExit(hoveredObject);
      hoveredObject = null;
    }

    if (newHovered !== null) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }

    const middle = window.innerWidth / 2;
    if (e.clientX < middle) {
      currentMouseSide = mouseSide.LEFT;
    } else {
      currentMouseSide = mouseSide.RIGHT;
    }

    if (tooltipActive && !disableTooltip) {
      const maxX = window.innerWidth - tooltip.offsetWidth - 20;
      const maxY = window.innerHeight - tooltip.offsetHeight + 30;

      tooltip.style.left = Math.min(e.clientX + defaultTooltipXPos, maxX) + "px";
      tooltip.style.top = Math.min(e.clientY + defaultTooltipYPos, maxY) + "px";
    }

  });

  return {
    hideTooltip: hideTooltip
  };
}
