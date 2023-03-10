const fileController = {
  importTemplate: (fileInput, canvas) => {
    const file = fileInput.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async function () {
      const json = JSON.parse(reader.result);
      if (!json.hasOwnProperty("objects")) {
        alert("Invalid template format!");
        return;
      }
      await canvas.loadFromJSON(json, () => {
        canvas.renderAll();
      });
    };
    reader.readAsText(file);
  },
  exportTemplate: (canvas) => {
    const json = canvas.toJSON();
    const jsonString = JSON.stringify(json);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "template.json";
    link.click();
  },
  downloadImage: (url) => {
    let anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  },
};

export default fileController;
