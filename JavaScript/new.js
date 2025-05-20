console.log("GitHub Pages Static Music Player");

let currentSong = new Audio();
let Songs = [];
let currFolder;

// Static album data - manually configure your albums here
const ALBUMS = {
  "Angry_(mood)": {
    title: "Angry Mood",
    description: "Calm your Anger",
    cover: "Songs/Angry_(mood)/cover.jpg",
    songs: [
      "BhoolBhulaiyaa.mp3"
      // Add more songs here as you have them
    ]
  },
  "Bright_(mood)": {
    title: "Bright Mood", 
    description: "Uplifting vibes",
    cover: "Songs/Bright_(mood)/cover.jpg",
    songs: [
      // Add your songs here
    ]
  },
  "Chill_(mood)": {
    title: "Chill Mood",
    description: "Relaxing music",
    cover: "Songs/Chill_(mood)/cover.jpg", 
    songs: [
      // Add your songs here
    ]
  },
  "cs": {
    title: "CS",
    description: "Music collection",
    cover: "Songs/cs/cover.jpg",
    songs: [
      // Add your songs here
    ]
  },
  "Dark_(mood)": {
    title: "Dark Mood",
    description: "Dark vibes",
    cover: "Songs/Dark_(mood)/cover.jpg",
    songs: [
      // Add your songs here
    ]
  },
  "Diljit": {
    title: "Diljit",
    description: "Diljit Dosanjh songs",
    cover: "Songs/Diljit/cover.jpg",
    songs: [
      // Add your songs here
    ]
  },
  "Funky_(mood)": {
    title: "Funky Mood",
    description: "Funky beats",
    cover: "Songs/Funky_(mood)/cover.jpg",
    songs: [
      // Add your songs here
    ]
  },
  "karan aujla": {
    title: "Karan Aujla",
    description: "Karan Aujla hits",
    cover: "Songs/karan aujla/cover.jpg",
    songs: [
      // Add your songs here
    ]
  },
  "Love_(mood)": {
    title: "Love Mood",
    description: "Romantic songs",
    cover: "Songs/Love_(mood)/cover.jpg",
    songs: [
      // Add your songs here
    ]
  },
  "ncs": {
    title: "NCS",
    description: "No Copyright Sounds",
    cover: "Songs/ncs/cover.jpg",
    songs: [
      // Add your NCS songs here
    ]
  },
  "Uplifting_(mood)": {
    title: "Uplifting Mood",
    description: "Feel good music",
    cover: "Songs/Uplifting_(mood)/cover.jpg",
    songs: [
      // Add your songs here
    ]
  }
};

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

function getSongs(folder) {
  currFolder = folder;
  
  // Get songs from static album data
  const albumKey = folder.replace('Songs/', '');
  if (ALBUMS[albumKey]) {
    Songs = ALBUMS[albumKey].songs;
    console.log(`Loaded ${Songs.length} songs for ${albumKey}`);
  } else {
    Songs = [];
    console.error(`Album ${albumKey} not found in ALBUMS data`);
  }

  // Show all the Songs in the playlist
  let songUL = document.querySelector(".songList")?.getElementsByTagName("ul")[0];
  if (songUL) {
    songUL.innerHTML = "";
    
    if (Songs.length === 0) {
      songUL.innerHTML = "<li><div class='info'><div>No songs available in this album</div></div></li>";
      return Songs;
    }
    
    for (const song of Songs) {
      songUL.innerHTML = songUL.innerHTML + 
        `<li><img class="invert" width="34" src="Images/music.svg" alt="">
          <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Artist</div>
          </div>
          <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="Images/play.svg" alt="">
          </div>
        </li>`;
    }

    // Attach an event listener to each song
    Array.from(songUL.getElementsByTagName("li")).forEach((e) => {
      const songInfo = e.querySelector(".info div");
      if (songInfo && songInfo.innerHTML !== "No songs available in this album") {
        e.addEventListener("click", () => {
          const songName = songInfo.innerHTML.trim();
          playMusic(songName);
        });
      }
    });
  }

  return Songs;
}

const playMusic = (track, pause = false) => {
  // Remove 'Songs/' prefix if it exists in currFolder
  const folderPath = currFolder.startsWith('Songs/') ? currFolder : `Songs/${currFolder}`;
  currentSong.src = `${folderPath}/${track}`;
  
  console.log("Attempting to play:", currentSong.src);
  
  if (!pause) {
    // Add user interaction check
    currentSong.play().then(() => {
      console.log("Audio playing successfully");
      const playButton = document.getElementById("play");
      if (playButton) {
        playButton.src = "Images/pause.svg";
      }
    }).catch(error => {
      console.error("Error playing audio:", error);
      if (error.name === 'NotAllowedError') {
        alert("Please click on the page first to enable audio playback, then try again.");
      } else {
        alert(`Could not play "${track}". Error: ${error.message}`);
      }
    });
  }
  
  const songInfo = document.querySelector(".songinfo");
  if (songInfo) {
    songInfo.innerHTML = decodeURI(track);
  }
  
  const songTime = document.querySelector(".songtime");
  if (songTime) {
    songTime.innerHTML = "00:00 / 00:00";
  }
};

function displayAlbums() {
  console.log("Displaying albums");
  
  const cardContainer = document.querySelector(".bigcard");
  if (!cardContainer) {
    console.error("Card container (.bigcard) not found in HTML");
    return;
  }
  
  cardContainer.innerHTML = "";
  
  // Filter out albums with no songs for display
  const albumsWithSongs = Object.entries(ALBUMS).filter(([key, album]) => album.songs.length > 0);
  
  if (albumsWithSongs.length === 0) {
    cardContainer.innerHTML = "<p>No albums with songs found. Please add songs to the ALBUMS object.</p>";
    return;
  }
  
  for (const [folderName, albumData] of albumsWithSongs) {
    cardContainer.innerHTML = cardContainer.innerHTML + 
      `<div class="cardContainer">
        <div data-folder="${folderName}" class="card">
          <div class="play-button"></div>
          <img src="${albumData.cover}" alt="${albumData.title}" 
               onerror="this.src='Images/default-cover.jpg'" 
               style="width: 100%; height: 200px; object-fit: cover;">
          <h2>${albumData.title}</h2>
          <p>${albumData.description}</p>
          <small>${albumData.songs.length} songs</small>
        </div>
      </div>`;
  }

  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", (item) => {
      const folderName = item.currentTarget.dataset.folder;
      console.log("Loading Songs for folder:", folderName);
      Songs = getSongs(folderName);
      if (Songs.length > 0) {
        playMusic(Songs[0]);
      } else {
        console.warn(`No songs found for ${folderName}`);
        alert(`No songs available in "${ALBUMS[folderName]?.title || folderName}".`);
      }
    });
  });
}

function initializePlayer() {
  console.log("Initializing music player...");
  
  // Find first album with songs
  const firstAlbumWithSongs = Object.entries(ALBUMS).find(([key, album]) => album.songs.length > 0);
  
  if (firstAlbumWithSongs) {
    const [folderName] = firstAlbumWithSongs;
    getSongs(folderName);
    if (Songs.length > 0) {
      playMusic(Songs[0], true);
    }
  } else {
    console.warn("No albums with songs found");
  }

  // Display all the albums on the page
  displayAlbums();
}

function setupEventListeners() {
  // Get UI elements with error checking
  const playButton = document.getElementById("play");
  const previousButton = document.getElementById("previous");
  const nextButton = document.getElementById("next");

  if (!playButton) console.warn("Play button (#play) not found");
  if (!previousButton) console.warn("Previous button (#previous) not found");
  if (!nextButton) console.warn("Next button (#next) not found");

  // Attach an event listener to play button
  if (playButton) {
    playButton.addEventListener("click", () => {
      if (currentSong.paused) {
        currentSong.play().then(() => {
          playButton.src = "Images/pause.svg";
        }).catch(error => {
          console.error("Error playing audio:", error);
        });
      } else {
        currentSong.pause();
        playButton.src = "Images/play.svg";
      }
    });
  }

  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    const songTime = document.querySelector(".songtime");
    const circle = document.querySelector(".circle");
    
    if (songTime) {
      songTime.innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    }
    
    if (circle && currentSong.duration) {
      circle.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    }
  });

  // Add an event listener to seekbar
  const seekbar = document.querySelector(".seekbar");
  if (seekbar) {
    seekbar.addEventListener("click", (e) => {
      if (currentSong.duration) {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        const circle = document.querySelector(".circle");
        if (circle) {
          circle.style.left = percent + "%";
        }
        currentSong.currentTime = (currentSong.duration * percent) / 100;
      }
    });
  }

  // Add an event listener for hamburger
  const hamburger = document.querySelector(".hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const leftPanel = document.querySelector(".left");
      if (leftPanel) {
        leftPanel.style.left = "0";
      }
    });
  }

  // Add an event listener for close button
  const closeButton = document.querySelector(".close");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      const leftPanel = document.querySelector(".left");
      if (leftPanel) {
        leftPanel.style.left = "-120%";
      }
    });
  }

  // Add an event listener to previous
  if (previousButton) {
    previousButton.addEventListener("click", () => {
      if (Songs.length === 0) return;
      
      currentSong.pause();
      console.log("Previous clicked");
      
      let currentSongName = currentSong.src.split("/").slice(-1)[0];
      let index = Songs.indexOf(currentSongName);
      
      if (index - 1 >= 0) {
        playMusic(Songs[index - 1]);
      } else if (Songs.length > 0) {
        playMusic(Songs[Songs.length - 1]);
      }
    });
  }

  // Add an event listener to next
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (Songs.length === 0) return;
      
      currentSong.pause();
      console.log("Next clicked");

      let currentSongName = currentSong.src.split("/").slice(-1)[0];
      let index = Songs.indexOf(currentSongName);
      
      if (index + 1 < Songs.length) {
        playMusic(Songs[index + 1]);
      } else if (Songs.length > 0) {
        playMusic(Songs[0]);
      }
    });
  }

  // Add an event to volume
  const volumeRange = document.querySelector(".range input");
  if (volumeRange) {
    volumeRange.addEventListener("change", (e) => {
      console.log("Setting volume to", e.target.value, "/ 100");
      currentSong.volume = parseInt(e.target.value) / 100;
      
      const volumeImg = document.querySelector(".volume > img");
      if (volumeImg && currentSong.volume > 0) {
        volumeImg.src = volumeImg.src.replace("mute.svg", "volume.svg");
      }
    });
  }

  // Add event listener to mute the track
  const volumeImg = document.querySelector(".volume > img");
  if (volumeImg) {
    volumeImg.addEventListener("click", (e) => {
      const volumeRange = document.querySelector(".range input");
      
      if (e.target.src.includes("volume.svg")) {
        e.target.src = e.target.src.replace("volume.svg", "mute.svg");
        currentSong.volume = 0;
        if (volumeRange) volumeRange.value = 0;
      } else {
        e.target.src = e.target.src.replace("mute.svg", "volume.svg");
        currentSong.volume = 0.1;
        if (volumeRange) volumeRange.value = 10;
      }
    });
  }

  // Handle audio loading errors
  currentSong.addEventListener("error", (e) => {
    console.error("Audio loading error:", e);
    const songName = currentSong.src.split("/").slice(-1)[0];
    alert(`Could not load "${songName}". Please check if the file exists and is accessible.`);
  });

  // Auto-play next song when current song ends
  currentSong.addEventListener("ended", () => {
    if (nextButton && Songs.length > 1) {
      nextButton.click();
    }
  });

  // Handle loading state
  currentSong.addEventListener("loadstart", () => {
    console.log("Started loading audio");
  });

  currentSong.addEventListener("canplay", () => {
    console.log("Audio can start playing");
  });
}

async function main() {
  console.log("Starting main function...");
  
  // Initialize the player
  initializePlayer();
  
  // Setup all event listeners
  setupEventListeners();
  
  console.log("Music player initialized successfully!");
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}