import fileController from "./fileController.js";
import { fetchAvatar } from "./avatarFetch.js";
import { generateRandomFace, backgroundHandler } from "./canvasEditor.js";
import { saveCurrentState, renderHistory } from "./historyController.js";

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

const MAX_EMOJI_OFFSET = 200;

pageElements.emojiPicker.addEventListener("emoji-click", (emoji) => {
  const textbox = new fabric.Textbox(emoji.detail.unicode, {
    editable: false,
    left: Math.random() * MAX_EMOJI_OFFSET,
    top: Math.random() * MAX_EMOJI_OFFSET,
  });
  pageElements.canvas.add(textbox);
});

backgroundHandler(pageElements.canvas);

actionButtons.fetchAvatarBtn.addEventListener("click", () =>
  fetchAvatar(pageElements.canvas)
);

actionButtons.randomFaceBtn.addEventListener("click", () =>
  generateRandomFace(pageElements.canvas)
);

actionButtons.renderImageBtn.addEventListener("click", function () {
  actionButtons.downloadBtn.style.visibility = "visible";
  const dataUrl = pageElements.canvas.toDataURL();
  pageElements.imageRender.src = dataUrl;

  saveCurrentState(pageElements.canvas);
  renderHistory(pageElements.canvas);
});

actionButtons.downloadBtn.addEventListener("click", function () {
  fileController.downloadImage(pageElements.imageRender.src);
});

actionButtons.templateImportBtn.onclick = () => {
  pageElements.templateFileInput.click();
};

pageElements.templateFileInput.addEventListener("change", function (event) {
  fileController.importTemplate(event.target, pageElements.canvas);
});

actionButtons.templateExportBtn.addEventListener("click", () => {
  fileController.exportTemplate(pageElements.canvas);
});

actionButtons.clearCanvasBtn.addEventListener("click", function () {
  pageElements.canvas.clear();
  pageElements.canvasImage();
});

document.addEventListener("keydown", (event) => {
  if (event.code === "KeyX") {
    pageElements.canvas.remove(pageElements.canvas.getActiveObject());
  }
});
