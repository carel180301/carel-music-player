const audio = document.getElementById("audio");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");
const repeatBtn = document.getElementById("repeatBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const time = document.getElementById("time");

const playerContainer = document.getElementById("playerContainer");
const minimizeBtn = document.getElementById("minimizeBtn");

let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;
let isMini = false;

// shuffle system
let shuffleQueue = [];
let shuffleIndex = 0;

const songs = [
  {
    title: "Pencil Legs - Rag Doll",
    src: "pencil-legs_rag-doll.mp3",
    cover: "album_pencil-legs_ragdoll.jpg",
  },
  {
    title: "Keshi - I Swear I'll Never Leave You Again",
    src: "keshi_i-swear-ill-never-leave-you-again.mp3",
    cover: "album_keshi_the-reaper.jpg",
  },
  {
    title: "LANY - No",
    src: "Lany-No.mp3",
    cover: "album_lany-beautiful-blur.jpg",
  },
];

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

function loadSong(index, autoplay = false) {
  audio.src = songs[index].src;
  title.textContent = songs[index].title;
  cover.src = songs[index].cover;
  time.textContent = "0:00 / 0:00";

  if (autoplay) {
    audio.play();
    playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
  } else {
    audio.pause();
    playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
  }
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
  } else {
    audio.pause();
    playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
  }
}

/* 🔽 MINIMIZE / EXPAND */
minimizeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  isMini = true;
  playerContainer.classList.add("mini");
});

playerContainer.addEventListener("click", () => {
  if (isMini) {
    isMini = false;
    playerContainer.classList.remove("mini");
  }
});

function next() {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
    return;
  }

  if (isShuffle) {
    if (shuffleIndex >= shuffleQueue.length) return;
    currentIndex = shuffleQueue[shuffleIndex++];
    loadSong(currentIndex, true);
    return;
  }

  if (currentIndex === songs.length - 1) return;

  currentIndex++;
  loadSong(currentIndex, true);
}

function prev() {
  // 🔥 Spotify behavior
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  if (isShuffle) {
    if (shuffleIndex <= 1) return;
    shuffleIndex -= 2;
    currentIndex = shuffleQueue[shuffleIndex++];
    loadSong(currentIndex, true);
    return;
  }

  if (currentIndex === 0) return;

  currentIndex--;
  loadSong(currentIndex, true);
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);

  if (isShuffle) {
    shuffleQueue = [...Array(songs.length).keys()]
      .filter((i) => i !== currentIndex)
      .sort(() => Math.random() - 0.5);

    shuffleQueue.unshift(currentIndex);
    shuffleIndex = 1;
  }
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  audio.loop = isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
}

audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  if (!isNaN(audio.duration)) {
    time.textContent = `${formatTime(audio.currentTime)} / ${formatTime(
      audio.duration
    )}`;
  }
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

audio.addEventListener("ended", () => {
  if (!isRepeat) next();
});

loadSong(currentIndex);
