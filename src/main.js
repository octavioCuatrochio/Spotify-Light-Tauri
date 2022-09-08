const { invoke } = window.__TAURI__.tauri;
const { once, emit, listen } = window.__TAURI__.event;
const { appWindow } = window.__TAURI__.window;

let player;
let img;
let title;

let center_btn;
let prev_btn;
let next_btn;
let vol;

let token_g;

let play_icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"/></svg>`;
let pause_icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z"/></svg>`;

document
  .querySelector("#minimize")
  .addEventListener("click", () => appWindow.minimize());
document.getElementById("close").addEventListener("click", () => {
  player.disconnect();
  appWindow.close();
});

window.addEventListener("DOMContentLoaded", () => {
  img = document.querySelector("#song-img");
  title = document.querySelector("#song-title");
  center_btn = document.querySelector("#play");
  prev_btn = document.querySelector("#prev");
  next_btn = document.querySelector("#next");
  vol = document.querySelector("#vol");

  setTimeout(() => {
    emit("frontend-loaded", { ready: true });
  }, 250);

  once("get-token", async (event) => {
    token_g = getToken(event.payload.url);

    let head = document.getElementsByTagName("head")[0];

    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://sdk.scdn.co/spotify-player.js";
    head.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      player = new Spotify.Player({
        name: "Light Player",
        getOAuthToken: (cb) => {
          // cb("BQAijb2mjsn72vlXM2i1A2wEvAo0eL4OQJk8mREVPVoDrjsVnJo5TW-KjYL8PgPP7oNMpX2xr7SDH2bhqw1hfb6EnnkEsJNSdXc0dtYdjXxg4iSw0GAwUyQotmEWk8YETjk1l22tGwdG_DbQXl8j00G3SSPoLdmZBeMk6-g5Oy22lazbvLwMT3zypQP2FcDCyahS8DXKglfFrutx4QLf5P4");
        cb(token_g);
        },
        volume: 0.5,
      });

      // Ready
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error(message);
      });

      player.addListener("account_error", ({ message }) => {
        console.error(message);
      });

      player.addListener("player_state_changed", (state) => {
        updateUI(state);
      });
      player.connect();

      document.querySelector("#auth").remove();
      document.querySelector(".song-info").style.marginBottom = "50px";
      document.querySelector("#song-title").style.height = "25px";
    };
  });
});

function getToken(url) {
  let search = "token=";
  let start = url.indexOf(search) + search.length;

  let token = "";
  let c = "";
  let i = start;
  while (c != "&") {
    token += c;
    c = url[i];
    i++;
  }

  return token;
}

function updateUI(state) {
  img.src = state.track_window.current_track.album.images[0].url;
  title.innerHTML = state.track_window.current_track.name;

  if (state.paused == false) {
    center_btn.innerHTML = pause_icon;
  } else {
    center_btn.innerHTML = play_icon;
  }
}

async function changeVol(vol) {
  let f_vol;

  if (vol < 100) {
    f_vol = vol / 100;
  } else f_vol = 1.0;

  player.setVolume(f_vol);
}

async function play() {
  player.togglePlay();
}

async function prevTrack() {
  player.previousTrack();
}

async function nextTrack() {
  player.nextTrack();
}

function auth() {
  window.location.replace(
    `https://accounts.spotify.com/authorize?client_id=b2b436164711470c8ca1eef0b842f339&response_type=token&redirect_uri=https://tauri.localhost/&scope=streaming%20app-remote-control&show_dialog=true`
  );
}

window.prevTrack = prevTrack;
window.nextTrack = nextTrack;
window.play = play;
window.changeVol = changeVol;
window.auth = auth;
