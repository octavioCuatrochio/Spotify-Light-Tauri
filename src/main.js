const { invoke } = window.__TAURI__.tauri;

let player;
let img;
let title;

let center_btn;
let prev_btn;
let next_btn;
let vol;

let play_icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"/></svg>`;

let pause_icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z"/></svg>`;

window.addEventListener("DOMContentLoaded", () => {
  img = document.querySelector("#song-img");
  title = document.querySelector("#song-title");
  center_btn = document.querySelector("#play");
  prev_btn = document.querySelector("#prev");
  next_btn = document.querySelector("#next");
  vol = document.querySelector("#vol");
});

window.onSpotifyWebPlaybackSDKReady = () => {
  const token =
"BQBAmh70KmSFdoISHWxZ5qGgo7tcysGk5TkApLc17LykgdD6Dgrf-TTusERHMqCaH6hSyY8_RlmMfcmIWUeDnLvDATmAEfTKYLlBoyO8Ni-cVJo1zxnoZfilRTArdoEjafKUMZT0A7ggt_UyzvGgYNOzVFpftcCCLjTRdE-f2kjT5syO1kq9BzjYre-tYQ12E5p4c9JdEBrygC0ESxpSGFA";
  player = new Spotify.Player({
    name: "Spotify Light Player",
    getOAuthToken: (cb) => {
      cb(token);
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
};

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
  
  console.log(vol);
  console.log(f_vol);

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

window.prevTrack = prevTrack;
window.nextTrack = nextTrack;
window.play = play;
window.changeVol = changeVol;
