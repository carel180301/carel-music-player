const audio = document.getElementById("audio");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");
const repeatBtn = document.getElementById("repeatBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const time = document.getElementById("time");

let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;

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
    title: "Justin Bieber - Come Around Me",
    src: "Justin_Bieber_Come_Around_Me.mp3",
    cover: "album_justin-bieber_changes.png",
  },
  {
    title: "LANY - No",
    src: "Lany-No.mp3",
    cover: "album_lany-beautiful-blur.jpg",
  },
  {
    title: "Krewella & Yellow Claw feat.VAVA - New World",
    src: "krewella_new-world.mp3",
    cover: "album_krewella_new-world.jpg",
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

function next() {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
    return;
  }

  if (isShuffle) {
    if (shuffleIndex >= shuffleQueue.length) return;

    currentIndex = shuffleQueue[shuffleIndex];
    shuffleIndex++;
    loadSong(currentIndex, true);
    return;
  }

  if (currentIndex === songs.length - 1) {
    audio.pause();
    playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
    return;
  }

  currentIndex++;
  loadSong(currentIndex, true);
}

function prev() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  if (isShuffle && shuffleIndex > 1) {
    shuffleIndex -= 2;
    next();
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

/* PROGRESS + TIME UPDATE */
audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.value = percent || 0;

  if (!isNaN(audio.duration)) {
    time.textContent = `${formatTime(audio.currentTime)} / ${formatTime(
      audio.duration
    )}`;
  }
});

/* SEEK */
progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

audio.addEventListener("ended", () => {
  playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
  if (!isRepeat) next();
});

// load first song
loadSong(currentIndex);
