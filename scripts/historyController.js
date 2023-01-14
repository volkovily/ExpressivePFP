const historyDiv = document.getElementById("historyContainer");
let history = [];

function isTemplateInHistory(image) {
  return history.some((historyItem) => historyItem.image === image);
}

export const saveCurrentState = (canvas) => {
  const image = canvas.toDataURL({});

  if (!isTemplateInHistory(image)) {
    const json = canvas.toJSON();
    history.push({ template: json, image });
  }
};

export const renderHistory = (canvas) => {
  historyDiv.innerHTML = "";
  for (const historyItem of history) {
    const img = createHistoryImage(historyItem, canvas);
    historyDiv.appendChild(img);
  }
};

const createHistoryImage = (item, canvas) => {
  const img = document.createElement("img");
  img.src = item.image;
  img.classList.add("history-image");
  img.addEventListener("click", () => {
    canvas.loadFromJSON(item.template, canvas.renderAll.bind(canvas));
  });
  img.addEventListener("contextmenu", (e) => removeItemFromHistory(e, canvas));
  return img;
};

const removeItemFromHistory = (e, canvas) => {
  e.preventDefault();
  if (confirm(`Delete selected image?`)) {
    const image = e.target.src;
    history = history.filter((historyItem) => historyItem.image !== image);
    renderHistory(canvas);
  }
};
