import fileOperations from "./file_operations.js";

import avatarFetcher from "./fetch.js";

const canvas = new fabric.Canvas("canvasEditor");
const emojiPicker = document.querySelector("emoji-picker");
const imageRender = document.getElementById("imageRender");
const renderImageBtn = document.getElementById("renderImageBtn");
const clearCanvasBtn = document.getElementById("clearCanvasBtn");
const randomFaceBtn = document.getElementById("randomFaceBtn");
const downloadBtn = document.getElementById("downloadBtn");

const templateExportBtn = document.getElementById("saveTemplateBtn");
const templateImportBtn = document.getElementById("importTemplateBtn");
const templateFileInput = document.getElementById("templateFileInput");

const backgroundButtons = {
  bgTikTokBtn: document.getElementById("backgroundTTBtn"),
  bgGoogleBtn: document.getElementById("backgroundGoogleBtn"),
  bgTwitterBtn: document.getElementById("backgroundTwBtn"),
  bgInstBtn: document.getElementById("backgroundInstBtn"),
};

const OFFSETS = {
  MAX_EMOJI_OFFSET: 200,
  FACE_LEFT_OFFSET: 66,
  FACE_FONT_SIZE: 120.12,
};

const FACE_TOP_OFFSETS = {
  FACE_TT_OFFSET: 40,
  FACE_GOOGLE_OFFSET: 50,
  FACE_TWITTER_OFFSET: 70,
  FACE_INST_OFFSET: 80,
};

let history = [];

const fetchAvatarBtn = document.getElementById("fetchAvatarBtn");
fetchAvatarBtn.addEventListener("click", () =>
  avatarFetcher.fetchAvatar(canvas)
);

emojiPicker.addEventListener("emoji-click", (emoji) => {
  const textbox = new fabric.Textbox(emoji.detail.unicode, {
    editable: false,
    left: Math.random() * OFFSETS.MAX_EMOJI_OFFSET,
    top: Math.random() * OFFSETS.MAX_EMOJI_OFFSET,
  });
  canvas.add(textbox);
});

function getRandomEmojiHex() {
  const hex = Math.floor(Math.random() * (0x637 - 0x600 + 1)) + 0x600;
  return hex.toString(16);
}

const removeLastRandomFace = () => {
  for (const object of canvas._objects) {
    if (object.fontSize === OFFSETS.FACE_FONT_SIZE) {
      canvas.remove(object);
      canvas.renderAll();
      break;
    }
  }
};

const generateRandomFace = () => {
  removeLastRandomFace();
  const unicode = "1F" + getRandomEmojiHex();
  const randomEmoji = String.fromCodePoint(parseInt(unicode, 16));

  const textbox = new fabric.Textbox(randomEmoji, {
    editable: false,
    left: OFFSETS.FACE_LEFT_OFFSET,
    top: getFacePose(),
    fontSize: OFFSETS.FACE_FONT_SIZE,
  });
  canvas.add(textbox);
};

function getFacePose() {
  const backgroundImageSrc = canvas.backgroundImage.getSrc();

  switch (backgroundImageSrc) {
    case backgroundButtons.bgTikTokBtn.src:
      return FACE_TOP_OFFSETS.FACE_TT_OFFSET;
    case backgroundButtons.bgGoogleBtn.src:
      return FACE_TOP_OFFSETS.FACE_GOOGLE_OFFSET;
    case backgroundButtons.bgTwitterBtn.src:
      return FACE_TOP_OFFSETS.FACE_TWITTER_OFFSET;
    case backgroundButtons.bgInstBtn.src:
      return FACE_TOP_OFFSETS.FACE_INST_OFFSET;
    default:
      return FACE_TOP_OFFSETS.FACE_TT_OFFSET;
  }
}

function isTemplateInHistory(image) {
  return history.some((historyItem) => historyItem.image === image);
}

const saveCurrentState = () => {
  const image = canvas.toDataURL({});

  if (!isTemplateInHistory(image)) {
    const json = canvas.toJSON();
    history.push({ template: json, image });
  }
};

const renderHistory = () => {
  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "";
  for (const historyItem of history) {
    const img = document.createElement("img");
    img.src = historyItem.image;
    img.addEventListener("click", () => {
      canvas.loadFromJSON(historyItem.template, canvas.renderAll.bind(canvas));
    });
    img.classList.add("history-image");
    img.addEventListener("contextmenu", removeItemFromHistory);
    historyDiv.appendChild(img);
  }
};

const removeItemFromHistory = (e) => {
  e.preventDefault();
  if (confirm(`Delete selected image?`)) {
    const image = e.target.src;
    history = history.filter((historyItem) => historyItem.image !== image);
    renderHistory();
  }
};

const setCanvasBackground = (imageSrc) => {
  canvas.setBackgroundImage(imageSrc, canvas.renderAll.bind(canvas), {});
};

for (const button of Object.values(backgroundButtons)) {
  button.addEventListener("click", () => {
    setCanvasBackground(button.src);
  });
}

setCanvasBackground(backgroundButtons.bgTikTokBtn.src);

renderImageBtn.addEventListener("click", function () {
  downloadBtn.style.visibility = "visible";
  const dataUrl = canvas.toDataURL();
  imageRender.src = dataUrl;

  saveCurrentState();
  renderHistory();
});

randomFaceBtn.addEventListener("click", generateRandomFace);

downloadBtn.addEventListener("click", function () {
  fileOperations.downloadImage(imageRender.src);
});

templateImportBtn.onclick = () => {
  document.getElementById("templateFileInput").click();
};

templateFileInput.addEventListener("change", function (event) {
  fileOperations.importTemplate(event.target, canvas);
});

templateExportBtn.addEventListener("click", () => {
  fileOperations.exportTemplate(canvas);
});

clearCanvasBtn.addEventListener("click", function () {
  setCanvasBackground(backgroundButtons.bgTikTokBtn.src);
  canvas.clear();
  canvasImage();
});

document.addEventListener("keydown", (event) => {
  if (event.code === "KeyX") {
    canvas.remove(canvas.getActiveObject());
  }
});
