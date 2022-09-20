const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const APP_CONFIG = "MP3_APP_CONFIG";
const songAPI = "http://localhost:3000/songs";

const nextSong = $(".next-song span");
const songContainer = $(".song-container");
const currSong = $(".current-song");
const currSongName = $(".current__song-name");
const currSinger = $(".current__singer");
const totalSong = $(".total-song span");
const currImg = $(".current__img");
const songVolume = $(".song__volume");
const songVolumeIcon = $(".song__volume i");
const songVolumeRange = $(".song__volume input");
const repeatBtn = $(".fa-arrow-rotate-right");
const backwardBtn = $(".fa-backward-step");
const toogleBtn = $(".play-pause__toggle");
const forwardBtn = $(".fa-forward-step");
const randomBtn = $(".fa-shuffle");
const audio = $(".progess audio");
const progess = $(".progess input");
const playlist = $(".song-list");
const playWith = $(".play-with");
const menuBar = $(".fa-bars");
const changeTab = $(".change-tab");
const alertContent = $(".alert-content");
const keyShortCut = $$(".key-shortcut");
const start = $(".time-start");
const end = $(".time-end");
const deleteLocal = $(".delete-local");
// ===============================================================
const removeContainer = $(".remove-song__container");
const totalSongRemove = $(".total-song--remove span");
// ================================================================
export{
    $,
    $$,
    APP_CONFIG,
    songAPI,
    // =======================
    songContainer,
    nextSong,
    currSong,
    currSongName,
    currSinger,
    totalSong,
    currImg,
    songVolume,
    songVolumeIcon,
    songVolumeRange,
    repeatBtn,
    backwardBtn,
    toogleBtn,
    forwardBtn,
    randomBtn,
    audio,
    progess,
    playlist,
    changeTab,
    alertContent,
    keyShortCut,
    start,
    end,
    menuBar,
    playWith,
    deleteLocal,
    // ===================
    removeContainer,
    totalSongRemove,
}