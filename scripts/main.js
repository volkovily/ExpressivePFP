import fileOperations from "./file_operations.js";
import avatarFetcher from "./fetch.js";

const pageElements = {
  canvas: new fabric.Canvas("canvasEditor"),
  emojiPicker: document.querySelector("emoji-picker"),
  imageRender: document.getElementById("imageRender"),
  templateFileInput: document.getElementById("templateFileInput"),
};

const actionButtons = {
  renderImageBtn: document.getElementById("renderImageBtn"),
  clearCanvasBtn: document.getElementById("clearCanvasBtn"),
  randomFaceBtn: document.getElementById("randomFaceBtn"),
  downloadBtn: document.getElementById("downloadBtn"),
  templateExportBtn: document.getElementById("saveTemplateBtn"),
  templateImportBtn: document.getElementById("importTemplateBtn"),
  fetchAvatarBtn: document.getElementById("fetchAvatarBtn"),
};

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
  FACE_DEFAULT_OFFSET: 40,
  FACE_GOOGLE_OFFSET: 50,
  FACE_TWITTER_OFFSET: 70,
  FACE_INST_OFFSET: 80,
};

const facePoseOffsets = {
  [backgroundButtons.bgTikTokBtn.src]: OFFSETS.FACE_DEFAULT_OFFSET,
  [backgroundButtons.bgGoogleBtn.src]: OFFSETS.FACE_GOOGLE_OFFSET,
  [backgroundButtons.bgTwitterBtn.src]: OFFSETS.FACE_TWITTER_OFFSET,
  [backgroundButtons.bgInstBtn.src]: OFFSETS.FACE_INST_OFFSET,
};

let history = [];

pageElements.emojiPicker.addEventListener("emoji-click", (emoji) => {
  const textbox = new fabric.Textbox(emoji.detail.unicode, {
    editable: false,
    left: Math.random() * OFFSETS.MAX_EMOJI_OFFSET,
    top: Math.random() * OFFSETS.MAX_EMOJI_OFFSET,
  });
  pageElements.canvas.add(textbox);
});

function getRandomEmojiHex() {
  // 0x600 - 0x637 is a range of face emojis in Hex
  const hex = Math.floor(Math.random() * (0x637 - 0x600 + 1)) + 0x600;
  return hex.toString(16);
}

const removeLastRandomFace = () => {
  for (const object of pageElements.canvas._objects) {
    if (object.fontSize === OFFSETS.FACE_FONT_SIZE) {
      pageElements.canvas.remove(object);
      pageElements.canvas.renderAll();
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
  pageElements.canvas.add(textbox);
};

function getFacePose() {
  const backgroundImageSrc = pageElements.canvas.backgroundImage.getSrc();
  const offset =
    facePoseOffsets[backgroundImageSrc] || OFFSETS.FACE_DEFAULT_OFFSET;
  return offset;
}

function isTemplateInHistory(image) {
  return history.some((historyItem) => historyItem.image === image);
}

const saveCurrentState = () => {
  const image = pageElements.canvas.toDataURL({});

  if (!isTemplateInHistory(image)) {
    const json = pageElements.canvas.toJSON();
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
      pageElements.canvas.loadFromJSON(
        historyItem.template,
        pageElements.canvas.renderAll.bind(pageElements.canvas)
      );
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
  pageElements.canvas.setBackgroundImage(
    imageSrc,
    pageElements.canvas.renderAll.bind(pageElements.canvas),
    {}
  );
};

setCanvasBackground(backgroundButtons.bgTikTokBtn.src);

for (const button of Object.values(backgroundButtons)) {
  button.addEventListener("click", () => {
    setCanvasBackground(button.src);
  });
}

actionButtons.fetchAvatarBtn.addEventListener("click", () =>
  avatarFetcher.fetchAvatar(pageElements.canvas)
);

actionButtons.randomFaceBtn.addEventListener("click", generateRandomFace);

actionButtons.renderImageBtn.addEventListener("click", function () {
  downloadBtn.style.visibility = "visible";
  const dataUrl = pageElements.canvas.toDataURL();
  pageElements.imageRender.src = dataUrl;

  saveCurrentState();
  renderHistory();
});

actionButtons.downloadBtn.addEventListener("click", function () {
  fileOperations.downloadImage(pageElements.imageRender.src);
});

actionButtons.templateImportBtn.onclick = () => {
  pageElements.templateFileInput.click();
};

pageElements.templateFileInput.addEventListener("change", function (event) {
  fileOperations.importTemplate(event.target, pageElements.canvas);
});

actionButtons.templateExportBtn.addEventListener("click", () => {
  fileOperations.exportTemplate(pageElements.canvas);
});

actionButtons.clearCanvasBtn.addEventListener("click", function () {
  setCanvasBackground(backgroundButtons.bgTikTokBtn.src);
  pageElements.canvas.clear();
  pageElements.canvasImage();
});

document.addEventListener("keydown", (event) => {
  if (event.code === "KeyX") {
    pageElements.canvas.remove(pageElements.canvas.getActiveObject());
  }
});
