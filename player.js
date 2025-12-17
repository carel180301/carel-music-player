const audio = document.getElementById("audio");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");

let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;

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
    title: "Justin Bieber - Come Around Me",
    src: "Justin_Bieber_Come_Around_Me.mp3",
    cover: "album_justin-bieber_changes.png",
  },
  {
    title: "LANY - No",
    src: "Lany-No.mp3",
    cover: "album_lany-beautiful-blur.jpg",
  },
];

function loadSong(index, autoplay = false) {
  audio.src = songs[index].src;
  title.textContent = songs[index].title;
  cover.src = songs[index].cover;

  if (autoplay) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶️";
  }
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶️";
  }
}

function next() {
  // 🔴 IF LAST SONG → STOP
  if (!isRepeat && currentIndex === songs.length - 1) {
    audio.pause();
    playBtn.textContent = "▶️";
    return;
  }

  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentIndex++;
  }

  loadSong(currentIndex, true);
}

function prev() {
  if (currentIndex === 0) {
    audio.currentTime = 0;
    return;
  }

  currentIndex--;
  loadSong(currentIndex, true);
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  alert("Shuffle: " + (isShuffle ? "ON" : "OFF"));
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  audio.loop = isRepeat;
  alert("Repeat: " + (isRepeat ? "ON" : "OFF"));
}

/* PROGRESS BAR UPDATE */
audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.value = percent || 0;
});

/* SEEK WHEN USER DRAGS BAR */
progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

audio.addEventListener("ended", () => {
  playBtn.textContent = "▶️";
  if (!isRepeat) next();
});

// load first song (PAUSED)
loadSong(currentIndex);
