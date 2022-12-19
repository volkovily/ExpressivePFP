const canvas = new fabric.Canvas("canvasEditor");

canvasImage();

function canvasImage() {
  const image = new Image();
  image.src = "assets/default.jpg";
  image.onload = () => {
    fabric.Image.fromURL(image.src, function (img) {
      img.scaleToWidth(canvas.getWidth());
      img.scaleToHeight(canvas.getHeight());
      canvas.add(img);
    });
  };
}
