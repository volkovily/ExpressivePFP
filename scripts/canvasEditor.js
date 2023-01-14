const EMOJI_RANGE = {
  // 0x600 - 0x637 is a range of face emoticons in Hex
  MIN_EMOJI_HEX: 0x600,
  MAX_EMOJI_HEX: 0x637,
};

export const backgroundButtons = {
  bgTikTokBtn: document.getElementById("backgroundTTBtn"),
  bgGoogleBtn: document.getElementById("backgroundGoogleBtn"),
  bgTwitterBtn: document.getElementById("backgroundTwBtn"),
  bgInstBtn: document.getElementById("backgroundInstBtn"),
};

const OFFSETS = {
  FACE_LEFT_OFFSET: 66,
  FACE_FONT_SIZE: 120,
  FACE_DEFAULT_OFFSET: 40,
  FACE_GOOGLE_OFFSET: 50,
  FACE_TWITTER_OFFSET: 70,
  FACE_INST_OFFSET: 80,
};

const facePoseOffsets = {
  [backgroundButtons.bgTikTokBtn.src]: OFFSETS.FACE_DEFAULT_OFFSET,
  [backgroundButtons.bgGoogleBtn.src]: OFFSETS.FACE_GOOGLE_OFFSET,
  [backgroundButtons.bgTwitterBtn.src]: OFFSETS.FACE_TWITTER_OFFSET,
  [backgroundButtons.bgInstBtn.src]: OFFSETS.FACE_INST_OFFSET,
};

const getRandomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomEmojiHex = () => {
  const { MIN_EMOJI_HEX, MAX_EMOJI_HEX } = EMOJI_RANGE;
  const randomEmoji = getRandomInRange(MIN_EMOJI_HEX, MAX_EMOJI_HEX);
  const emojiHex = randomEmoji.toString(16);
  return emojiHex;
};

function getFacePose(canvas) {
  if (!canvas.backgroundImage) return OFFSETS.FACE_DEFAULT_OFFSET;
  const backgroundImageSrc = canvas.backgroundImage.getSrc();
  const offset =
    facePoseOffsets[backgroundImageSrc] || OFFSETS.FACE_DEFAULT_OFFSET;
  return offset;
}

const removeLastRandomFace = (canvas) => {
  const objects = canvas.getObjects();
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    if (object.fontSize === OFFSETS.FACE_FONT_SIZE) {
      canvas.remove(object);
      canvas.renderAll();
      break;
    }
  }
};

export const generateRandomFace = (canvas) => {
  removeLastRandomFace(canvas);
  const unicode = "1F" + getRandomEmojiHex();
  const randomEmoji = String.fromCodePoint(parseInt(unicode, 16));

  const textbox = new fabric.Textbox(randomEmoji, {
    editable: false,
    left: OFFSETS.FACE_LEFT_OFFSET,
    top: getFacePose(canvas),
    fontSize: OFFSETS.FACE_FONT_SIZE,
  });
  canvas.add(textbox);
};

const setCanvasBackground = (canvas, imageSrc) => {
  canvas.setBackgroundImage(imageSrc, canvas.renderAll.bind(canvas), {});
};

export const backgroundHandler = (canvas) => {
  for (const button of Object.values(backgroundButtons)) {
    button.addEventListener("click", () => {
      setCanvasBackground(canvas, button.src);
    });
  }
};
