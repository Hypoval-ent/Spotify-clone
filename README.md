# Mini Spotify Clone 🎧

A responsive, front-end-only music player inspired by Spotify — built using just **HTML**, **CSS**, and **JavaScript**. It allows users to browse dynamic albums, play music, control playback, and view the current song — all from local storage.

## 🎯 Features

- 🎵 **Dynamic Albums**: Albums and song data are loaded from `localStorage`, enabling fast, dynamic rendering without a backend.
- ▶️ **Music Player**:
  - Play / Pause control
  - Next / Previous song navigation
  - Volume Up / Down
  - Mute / Unmute toggle
  - "Now Playing" song display
- 📱 **Responsive Design**: Optimized to look great on devices of all screen sizes.

## 🛠 Tech Stack

- **HTML**
- **CSS**
- **JavaScript**
- **LocalStorage** for storing album & song data

## 🚀 How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/mini-spotify-clone.git
   ```

2. Open the project folder and launch `index.html` in your browser:
   ```bash
   cd mini-spotify-clone
   ```

3. That’s it! Enjoy the music 🎶

> ℹ️ Note: This project uses local files and `localStorage`, so make sure you're running it in a browser that supports audio playback and local file access. Some features might not work as expected if opened directly from GitHub Pages.

## 📂 Folder Structure

```
SPOTIFYCLONE/
├── CSS/
│   ├── style.css
│   └── utility.css
├── JavaScript/
│   └── new.js
├── Images/
├── Songs/
│   ├── Angry_(mood)/
│   │   ├── BhoolBhulaiyaa.mp3
│   │   ├── cover.jpg
│   │   └── info.json
│   ├── Bright_(mood)/
│   ├── Chill_(mood)/
│   ├── Dark_(mood)/
│   ├── Diljit/
│   ├── Funky_(mood)/
│   ├── karan_aujla/
│   ├── Love_(mood)/
│   ├── Uplifting_(mood)/
│   └── ncs/
├── .htaccess
├── .hintrc
├── favicon.ico
├── index.html
└── README.md
```

## 📌 Limitations

- No backend integration — songs and albums are stored in localStorage
- Not deployable to GitHub Pages due to local file access restrictions

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
