console.log("GitHub Pages Compatible Music Player - Dynamic JSON Loading");

let currentSong = new Audio();
let Songs = [];
let currFolder;
let ALBUMS = {}; // Will be populated dynamically

// List of your album folders - update this array with your actual folder names
const ALBUM_FOLDERS = [
  "Angry_(mood)",
  "Bright_(mood)", 
  "Chill_(mood)",
  "cs",
  "Dark_(mood)",
  "Diljit",
  "Funky_(mood)",
  "karan aujla",
  "Love_(mood)",
  "ncs",
  "Uplifting_(mood)"
];

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

async function loadAlbumData() {
  console.log("Loading album data...");
  
  for (const folder of ALBUM_FOLDERS) {
    try {
      // Try to fetch the info.json file
      const response = await fetch(`Songs/${folder}/info.json`);
      if (response.ok) {
        const albumInfo = await response.json();
        ALBUMS[folder] = {
          title: albumInfo.title || folder.replace(/_/g, ' '),
          description: albumInfo.description || "Music Collection",
          cover: `Songs/${folder}/cover.jpg`,
          songs: albumInfo.tracks || []
        };
        console.log(`Loaded album: ${folder}`, ALBUMS[folder]);
      } else {
        console.warn(`Could not load info.json for ${folder}, using default data`);
        // Fallback if info.json doesn't exist
        ALBUMS[folder] = {
          title: folder.replace(/_/g, ' '),
          description: "Music Collection",
          cover: `Songs/${folder}/cover.jpg`,
          songs: [] // Will need to be manually filled
        };
      }
    } catch (error) {
      console.error(`Error loading album data for ${folder}:`, error);
      // Fallback data
      ALBUMS[folder] = {
        title: folder.replace(/_/g, ' '),
        description: "Music Collection", 
        cover: `Songs/${folder}/cover.jpg`,
        songs: []
      };
    }
  }
}

function getSongs(folder) {
  currFolder = folder;
  
  // Get songs from loaded album data
  const albumKey = folder.replace('Songs/', '');
  if (ALBUMS[albumKey]) {
    Songs = ALBUMS[albumKey].songs;
  } else {
    Songs = [];
    console.error(`Album ${albumKey} not found in loaded data`);
  }

  // Show all the Songs in the playlist
  let songUL = document.querySelector(".songList")?.getElementsByTagName("ul")[0];
  if (songUL) {
    songUL.innerHTML = "";
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
      e.addEventListener("click", () => {
        const songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
        playMusic(songName);
      });
    });
  }

  return Songs;
}

const playMusic = (track, pause = false) => {
  // Construct the path to your songs
  currentSong.src = `Songs/${currFolder.replace('Songs/', '')}/${track}`;
  
  console.log("Trying to play:", currentSong.src);
  
  if (!pause) {
    currentSong.play().catch(error => {
      console.error("Error playing audio:", error);
      alert(`Could not play "${track}". Please check if the file exists and is accessible.`);
    });
    
    const playButton = document.getElementById("play");
    if (playButton) {
      playButton.src = "Images/pause.svg";
    }
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
    console.error("Card container not found");
    return;
  }
  
  cardContainer.innerHTML = "";
  
  // Use loaded album data
  for (const [folderName, albumData] of Object.entries(ALBUMS)) {
    cardContainer.innerHTML = cardContainer.innerHTML + 
      `<div class="cardContainer">
        <div data-folder="${folderName}" class="card">
          <div class="play-button"></div>
          <img src="${albumData.cover}" alt="${albumData.title}" onerror="this.src='Images/default-cover.jpg'">
          <h2>${albumData.title}</h2>
          <p>${albumData.description}</p>
        </div>
      </div>`;
  }

  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", (item) => {
      const folderName = item.currentTarget.dataset.folder;
      console.log("Loading Songs for folder:", folderName);
      Songs = getSongs(`Songs/${folderName}`);
      if (Songs.length > 0) {
        playMusic(Songs[0]);
      } else {
        console.warn(`No songs found for ${folderName}`);
        alert(`No songs found for "${ALBUMS[folderName]?.title || folderName}". Please check the tracks in info.json.`);
      }
    });
  });
}

async function main() {
  console.log("Initializing music player...");
  
  // First load all album data
  await loadAlbumData();
  
  // Initialize with first available album
  const firstAlbum = Object.keys(ALBUMS)[0];
  if (firstAlbum) {
    getSongs(`Songs/${firstAlbum}`);
    if (Songs.length > 0) {
      playMusic(Songs[0], true);
    }
  }

  // Display all the albums on the page
  displayAlbums();

  // Get UI elements with error checking
  const playButton = document.getElementById("play");
  const previousButton = document.getElementById("previous");
  const nextButton = document.getElementById("next");

  // Attach an event listener to play button
  if (playButton) {
    playButton.addEventListener("click", () => {
      if (currentSong.paused) {
        currentSong.play().catch(error => {
          console.error("Error playing audio:", error);
        });
        playButton.src = "Images/pause.svg";
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
      let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
      const circle = document.querySelector(".circle");
      if (circle) {
        circle.style.left = percent + "%";
      }
      currentSong.currentTime = (currentSong.duration * percent) / 100;
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
      currentSong.pause();
      console.log("Previous clicked");
      
      let currentSongName = currentSong.src.split("/").slice(-1)[0];
      let index = Songs.indexOf(currentSongName);
      
      if (index - 1 >= 0) {
        playMusic(Songs[index - 1]);
      } else if (Songs.length > 0) {
        // Loop to last song
        playMusic(Songs[Songs.length - 1]);
      }
    });
  }

  // Add an event listener to next
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      currentSong.pause();
      console.log("Next clicked");

      let currentSongName = currentSong.src.split("/").slice(-1)[0];
      let index = Songs.indexOf(currentSongName);
      
      if (index + 1 < Songs.length) {
        playMusic(Songs[index + 1]);
      } else if (Songs.length > 0) {
        // Loop to first song
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
    alert(`Could not load "${songName}". Please check if the file exists and is in the correct format.`);
  });

  // Auto-play next song when current song ends
  currentSong.addEventListener("ended", () => {
    if (nextButton) {
      nextButton.click();
    }
  });
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}