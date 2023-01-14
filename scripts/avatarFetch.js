export async function fetchAvatar(canvas) {
  const username = prompt("Enter a GitHub username:");
  if (!username) {
    alert("Please enter a username");
    return;
  }
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (response.ok) {
      const json = await response.json();
      updateFetchedAvatar(json.avatar_url, canvas);
    } else {
      alert(`The user "${username}" could not be found.`);
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while fetching the avatar.");
  }
}

function updateFetchedAvatar(url, canvas) {
  const fetchedImage = new Image();
  fetchedImage.crossOrigin = "Anonymous";
  fetchedImage.onload = onFetchedImageLoad.bind(null, fetchedImage, canvas);
  fetchedImage.src = url;
}

function onFetchedImageLoad(fetchedImage, canvas) {
  const imgInstance = new fabric.Image(fetchedImage);
  imgInstance.scaleToWidth(canvas.getWidth());
  canvas.setBackgroundImage(imgInstance);
  canvas.renderAll();
  canvas.centerObject(imgInstance);
}
