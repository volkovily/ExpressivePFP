const canvas = new fabric.Canvas("canvasEditor");
const emojiPicker = document.querySelector("emoji-picker");
const imageRender = document.getElementById("imageRender");
const renderImageBtn = document.getElementById("renderImageBtn");
const clearCanvasBtn = document.getElementById("clearCanvasBtn");
const randomFaceBtn = document.getElementById("randomFaceBtn");

canvasImage();

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

function canvasImage() {
  const image = new Image();
  image.src = "assets/default.jpg";
  image.onload = () => {
    fabric.Image.fromURL(image.src, function (img) {
      img.scaleToWidth(canvas.getWidth());
      img.scaleToHeight(canvas.getHeight());
      img.set({
        selectable: false,
        evented: false,
      });
      canvas.add(img);
    });
  };
}

clearCanvasBtn.addEventListener("click", function () {
  canvas.clear();
  canvasImage();
});

renderImageBtn.addEventListener("click", function () {
  const dataUrl = canvas.toDataURL();
  imageRender.src = dataUrl;
});

document.addEventListener("keydown", (event) => {
  if (event.code === "KeyX") {
    canvas.remove(canvas.getActiveObject());
  }
});
