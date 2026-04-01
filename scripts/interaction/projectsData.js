import { galleryPaths } from "./galleryImageOptions.js";

export const panels = {
  // Projects //
  showreel: {
    title: "Sound Design Showreel",
    description: "Re-Sound Design of some popular titles, such as Batman Arkham Knight, Portal 2, and Hollow Knight.",
    smallDescription: "My recent sound design showreel.",
    iframeUrl: "https://www.youtube.com/embed/YRv10aHKAdA",
    creationDate: "April, 2025"
  },
  honours: {
    title: "Honours Project",
    description: "For my honours project, I developed an adaptive audio system for the game Lethal Company." 
    + " This system dynamically adjusted the priority of sounds based on the player’s situational context.",
    smallDescription: "An adaptive audio system mod for Lethal Company.",
    iframeUrl: "https://www.youtube.com/embed/LyrI1rBP9qY",
    creationDate: "March, 2025",
    galleryPath: galleryPaths.HONOURS,
  },
  paperFace: {
    title: "Paper Face",
    description: "Game made during the 2026 Global Game Jam."
      + "\n You are a bouncer at a masquerade ball. Use your criteria list to determine who to let into the party and who to turn away. Make sure you don't turn away the VIPs!",
    smallDescription: "Global Game Jam entry for 2026.",
    iframeUrl: "https://www.youtube.com/embed/HcZMTQKKFk0",
    galleryPath: galleryPaths.PAPERFACE,
    creationDate: "February, 2026",
    downloadLink: "https://forestlf.itch.io/paperface",
  },
  local58ReDesign: {
    title: "Local58 Re-sound Design",
    description: "In this redesign, I altered the sounds to resemble those coming through a CRT’s speaker, with audio from the videotape player occurring "
    + "spatially on its own. This enhances immersion by making the “monster” seem to break through the speakers.",
    smallDescription: "Sound redesigns of two episodes of Local58.",
    iframeUrl: "https://www.youtube.com/embed/Naaq5xNNFOA",
    creationDate: "December, 2024"
  },
  interningAtValdivian: {
    title: "Interning At Valdivian",
    description: "This is a short gravity puzzle game. Instead of traditional jumping, players switch gravity to navigate challenging levels, avoiding obstacles and hazards along the way",
    smallDescription: "Gravity-based puzzle game.",
    iframeUrl: "https://www.youtube.com/embed/peuUUqYx7l8",
    creationDate: "January, 2023", 
    downloadLink: "https://mmac0.itch.io/interning-at-valdivian",
    galleryPath: galleryPaths.INTERNINGATVALDIVIAN,
  },
  wildfire: {
    title: "Wildfire",
    description: "This game was created for the 2025 V&A Game Jam in dundee.",
    smallDescription: "Game created for the V&A Game Jam in Dundee",
    iframeUrl: "https://www.youtube.com/embed/ZP2IiS8HQ6g",
    creationDate: "March, 2025",
    downloadLink: "https://forestlf.itch.io/wildfire",
    galleryPath: galleryPaths.WILFIRE,
  },
  lastLaughShowdown: {
    title: "Last Laugh Showdown",
    description: "Last Laugh Showdown is a slapstick 1v1 fighting game created during the 2024 Global Game Jam in Edinburgh."
    + "<br><br>I handled all sound design, audio implementation, and music implementation, creating every sound and integrating the full audio experience to match the game’s over-the-top energy.",
    smallDescription: "Global Game entry for 2024",
    downloadLink: "https://stubbsuk69.itch.io/last-laugh-showdown",
    iframeUrl: "https://www.youtube.com/embed/PUXxplSHXsA",
    creationDate: "January, 2024",
    galleryPath: galleryPaths.LASTLAUGHSHOWDOWN,
  },
};