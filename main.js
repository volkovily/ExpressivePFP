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

emojiPicker.addEventListener("emoji-click", (emoji) => {
  const textbox = new fabric.Textbox(emoji.detail.unicode, {
    editable: false,
    left: Math.random() * 200,
    top: Math.random() * 200,
  });
  canvas.add(textbox);
});

function getRandomEmojiHex() {
  const hex = Math.floor(Math.random() * (0x644 - 0x600 + 1)) + 0x600;
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
    left: 67,
    top: 40,
    fontSize: 120.12,
  });
  canvas.add(textbox);
}

randomFaceBtn.addEventListener("click", function () {
  removeLastRandomFace();
  generateRandomFace();
});

const setCanvasBackground = (imageSrc) => {
  canvas.setBackgroundImage(imageSrc, canvas.renderAll.bind(canvas), {
    backgroundImageOpacity: 1,
    backgroundImageStretch: false,
  });
};

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

downloadBtn.addEventListener("click", function () {
  downloadImage(imageRender.src);
});

function downloadImage(url) {
  let anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = url;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

clearCanvasBtn.addEventListener("click", function () {
  canvas.clear();
  canvasImage();
});

renderImageBtn.addEventListener("click", function () {
  buttonsRendered.style.visibility = "visible";
  const dataUrl = canvas.toDataURL();
  imageRender.src = dataUrl;
});

document.addEventListener("keydown", (event) => {
  if (event.code === "KeyX") {
    canvas.remove(canvas.getActiveObject());
  }
});
