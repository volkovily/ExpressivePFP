const canvas = new fabric.Canvas("canvasEditor");
const emojiPicker = document.querySelector("emoji-picker");
const imageRender = document.getElementById("imageRender");
const renderImageBtn = document.getElementById("renderImageBtn");
const clearCanvasBtn = document.getElementById("clearCanvasBtn");
const randomFaceBtn = document.getElementById("randomFaceBtn");
const downloadBtn = document.getElementById("downloadBtn");
const buttonsRendered = document.getElementById("buttonsRendered");

const backgroundTTBtn = document.getElementById("backgroundTTBtn");
const backgroundGoogleBtn = document.getElementById("backgroundGoogleBtn");
const backgroundTwBtn = document.getElementById("backgroundTwBtn");
const backgroundInstBtn = document.getElementById("backgroundInstBtn");

const templateExportBtn = document.getElementById("saveTemplateBtn");
const templateImportBtn = document.getElementById("importTemplateBtn");
const templateFileInput = document.getElementById("templateFileInput");

let history = [];

emojiPicker.addEventListener("emoji-click", (emoji) => {
  const textbox = new fabric.Textbox(emoji.detail.unicode, {
    editable: false,
    left: Math.random() * 200,
    top: Math.random() * 200,
  });
  canvas.add(textbox);
});

function getRandomEmojiHex() {
  const hex = Math.floor(Math.random() * (0x637 - 0x600 + 1)) + 0x600;
  return hex.toString(16);
}

function removeLastRandomFace() {
  canvas.forEachObject(function (object) {
    if (object.fontSize === 120.12) {
      canvas.remove(object);
    }
  });
  canvas.renderAll();
}

function generateRandomFace() {
  const unicode = "1F" + getRandomEmojiHex();
  const randomEmoji = String.fromCodePoint(parseInt(unicode, 16));

  const textbox = new fabric.Textbox(randomEmoji, {
    editable: false,
    left: 66,
    top: getFacePose(),
    fontSize: 120.12,
  });
  canvas.add(textbox);
}

function getFacePose() {
  const backgroundImageSrc = canvas.backgroundImage.getSrc();

  switch (backgroundImageSrc) {
    case backgroundTTBtn.src:
      return 40;
    case backgroundGoogleBtn.src:
      return 50;
    case backgroundTwBtn.src:
      return 70;
    case backgroundInstBtn.src:
      return 80;
    default:
      return 40;
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
    historyDiv.appendChild(img);
  }
};

const setCanvasBackground = (imageSrc) => {
  canvas.setBackgroundImage(imageSrc, canvas.renderAll.bind(canvas), {});
};

setCanvasBackground(backgroundTTBtn.src);

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

randomFaceBtn.addEventListener("click", function () {
  removeLastRandomFace();
  generateRandomFace();
});

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
  setCanvasBackground(backgroundTTBtn.src);
  canvas.clear();
  canvasImage();
});

backgroundTTBtn.addEventListener("click", () =>
  setCanvasBackground(backgroundTTBtn.src)
);
backgroundGoogleBtn.addEventListener("click", () =>
  setCanvasBackground(backgroundGoogleBtn.src)
);
backgroundTwBtn.addEventListener("click", () =>
  setCanvasBackground(backgroundTwBtn.src)
);
backgroundInstBtn.addEventListener("click", () =>
  setCanvasBackground(backgroundInstBtn.src)
);

document.addEventListener("keydown", (event) => {
  if (event.code === "KeyX") {
    canvas.remove(canvas.getActiveObject());
  }
});
