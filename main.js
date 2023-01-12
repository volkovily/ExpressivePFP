const canvas = new fabric.Canvas("canvasEditor");
const emojiPicker = document.querySelector("emoji-picker");
const imageRender = document.getElementById("imageRender");
const renderImageBtn = document.getElementById("renderImageBtn");
const clearCanvasBtn = document.getElementById("clearCanvasBtn");
const randomFaceBtn = document.getElementById("randomFaceBtn");
const downloadBtn = document.getElementById("downloadBtn");
const buttonsRendered = document.getElementById("buttonsRendered");

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
fetchAvatarBtn.addEventListener("click", fetchAvatar);

async function fetchAvatar() {
  const username = prompt("Enter a GitHub username:");
  if (!username) {
    return;
  }
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (response.ok) {
      const json = await response.json();
      const fetchedImage = new Image();
      fetchedImage.crossOrigin = "Anonymous";
      fetchedImage.onload = function () {
        const imgInstance = new fabric.Image(fetchedImage);
        imgInstance.scaleToWidth(canvas.width * 0.8);
        canvas.setBackgroundImage(imgInstance, canvas.renderAll.bind(canvas));
        imgInstance.scaleToWidth(canvas.getWidth());
        canvas.centerObject(imgInstance);
      };
      fetchedImage.src = json.avatar_url + "?not-from-cache-please";
    } else {
      alert(`The user "${username}" could not be found.`);
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while fetching the avatar.");
  }
}

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

function downloadImage(url) {
  let anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = url;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function exportTemplateAsJSON() {
  const json = canvas.toJSON();
  const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "template.json";

  document.body.appendChild(anchor);
  anchor.click();

  document.body.removeChild(anchor);
}

templateFileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  const reader = new FileReader();
  reader.addEventListener("load", function () {
    const json = JSON.parse(reader.result);
    canvas.loadFromJSON(json, function () {
      for (const object of canvas._objects) {
        if (object.type === "textbox") {
          object.set({ editable: false });
        }
      }
      canvas.renderAll();
    });
  });
  reader.readAsText(file);
});

renderImageBtn.addEventListener("click", function () {
  buttonsRendered.style.visibility = "visible";
  const dataUrl = canvas.toDataURL();
  imageRender.src = dataUrl;

  saveCurrentState();
  renderHistory();
});

randomFaceBtn.addEventListener("click", generateRandomFace);

downloadBtn.addEventListener("click", function () {
  downloadImage(imageRender.src);
});

templateExportBtn.addEventListener("click", function () {
  exportTemplateAsJSON();
});

templateImportBtn.addEventListener("click", function () {
  document.getElementById("templateFileInput").click();
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
