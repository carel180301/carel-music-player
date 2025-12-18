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
const songList = document.getElementById("songList");
const navbar = document.querySelector(".custom-navbar");

const mySongsHeader = document.getElementById("mySongsHeader");

const searchInput = document.querySelector(
  '.custom-navbar input[type="search"]'
);

let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;
let isMini = false;

let shuffleQueue = [];
let shuffleIndex = 0;

const songs = [
  {
    title: "DJ Snake ft.Bipolar Sunshine - Middle",
    src: "assets/dj-snake_middle.mp3",
    cover: "assets/dj-snake_middle.png",
  },
  {
    title: "J Tajor - Like I Do",
    src: "assets/j-tajor_like-i-do.mp3",
    cover: "assets/j-tajor_like-i-do.png",
  },
  {
    title: "Justin Bieber - Come Around Me",
    src: "assets/justin-bieber_come-around-me.mp3",
    cover: "assets/justin-bieber_come-around-me.png",
  },
  {
    title: "Pencil Legs - Rag Doll",
    src: "assets/pencil-legs_rag-doll.mp3",
    cover: "assets/pencil-legs_rag-doll.jpg",
  },
  {
    title: "Krewella, Yellow Claw ft.VAVA - New World",
    src: "assets/krewella_new-world.mp3",
    cover: "assets/krewella_new-world.jpg",
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

/* =========================
   MINIMIZE
   ========================= */

minimizeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  isMini = true;
  playerContainer.classList.add("mini");
  navbar.classList.add("show-navbar");
  mySongsHeader.style.display = "block";
});

/* =========================
   EXPAND
   ========================= */

playerContainer.addEventListener("click", (e) => {
  if (!isMini) return;
  if (e.target === playerContainer) {
    isMini = false;
    playerContainer.classList.remove("mini");
    navbar.classList.remove("show-navbar");
    mySongsHeader.style.display = "none";
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

/* =========================
   SONG LIST
   ========================= */

function renderSongList(filter = "") {
  songList.innerHTML = "";

  songs
    .filter((song) => song.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach((song, index) => {
      const realIndex = songs.indexOf(song);
      const card = document.createElement("div");
      card.className = "song-card";

      card.innerHTML = `
        <img src="${song.cover}">
        <span>${song.title}</span>
      `;

      card.addEventListener("click", (e) => {
        e.stopPropagation();
        currentIndex = realIndex;
        loadSong(realIndex, true);
      });

      songList.appendChild(card);
    });
}

/* =========================
   LIVE SEARCH
   ========================= */

searchInput.addEventListener("input", (e) => {
  renderSongList(e.target.value);
});

renderSongList();
loadSong(currentIndex);
