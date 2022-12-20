const canvas = new fabric.Canvas("canvasEditor");
const emojiPicker = document.querySelector("emoji-picker");
const imageRender = document.getElementById("imageRender");
const renderImageBtn = document.getElementById("renderImageBtn");
const clearCanvasBtn = document.getElementById("clearCanvasBtn");

canvasImage();

emojiPicker.addEventListener("emoji-click", (emoji) => {
  const textbox = new fabric.Textbox(emoji.detail.unicode, {
    editable: false,
    left: Math.random() * 200,
    top: Math.random() * 200,
  });
  canvas.add(textbox);
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
