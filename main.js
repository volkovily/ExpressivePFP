const canvas = new fabric.Canvas("canvasEditor");
const emojiPicker = document.querySelector("emoji-picker");

canvasImage();

emojiPicker.addEventListener("emoji-click", (emoji) => {
  const textbox = new fabric.Textbox(emoji.detail.unicode, {
    editable: false,
    left: 100,
    top: 100,
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
