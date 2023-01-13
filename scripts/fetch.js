const avatarFetcher = {
  async fetchAvatar(canvas) {
    const username = prompt("Enter a GitHub username:");
    if (!username) {
      alert("Please enter a username");
      return;
    }
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (response.ok) {
        const json = await response.json();
        this.updateFetchedAvatar(json.avatar_url, canvas);
      } else {
        alert(`The user "${username}" could not be found.`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching the avatar.");
    }
  },

  updateFetchedAvatar(url, canvas) {
    const fetchedImage = new Image();
    fetchedImage.crossOrigin = "Anonymous";
    fetchedImage.onload = this.onFetchedImageLoad.bind(
      this,
      fetchedImage,
      canvas
    );
    fetchedImage.src = url;
  },

  onFetchedImageLoad(fetchedImage, canvas) {
    const imgInstance = new fabric.Image(fetchedImage);
    imgInstance.scaleToWidth(canvas.getWidth());
    canvas.setBackgroundImage(imgInstance, canvas.renderAll.bind(canvas));
    canvas.centerObject(imgInstance);
  },
};

export default avatarFetcher;
