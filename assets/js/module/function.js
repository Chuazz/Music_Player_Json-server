import * as myVar from "./variable.js";

// Chuyển đổi drive link để chạy nhạc được
export function convertDriveLink(importLink) {
    var finalLink = "";
    var concatLink = "http://docs.google.com/uc?export=open&id=";

    if (importLink.startsWith("https://drive.google.com/file/d/") && importLink.endsWith("/view?usp=sharing")) {
        var driveLink = importLink;
        var linkId = driveLink.split('/');

        finalLink = finalLink.concat(concatLink, linkId[5]);
        return finalLink;
    }
    return undefined;
}

export function addZeroBefore(number) {
    if (number < 10) {
        number = `0${number}`;
    }
    return number;
};

export function convertToMinute(second) {
    var minute = addZeroBefore(Math.floor(second / 60));
    var second = addZeroBefore(Math.floor(second % 60));

    if (second >= 60) {
        second = 0;
        minute += 1;
    }

    return `${minute}:${second}`;
};

export function renderTimeDuration(songList) {
    var audio = document.createElement("audio");
    var songItem = myVar.$$(".song__item");
    var dem = 0;

    for (let i = 0; i < songList.length; i++) {
        const song = songList[i];
        audio.src = convertDriveLink(song.path);

        if(song.duration === null){
            audio.addEventListener("loadedmetadata", () => {
                song.duration = audio.duration;
                songItem[i].querySelector(".song__duration p").innerText = convertToMinute(song.duration);
            });
        }

        if(dem < songList.length - 1){
            audio.src = convertDriveLink(songList[dem+=1].path);
        }
    }
}

export function renderSong(songList, selector) {
    var html = songList.sort((a, b) => a.id - b.id).map((song, i) => {
        return `
        <div class="song__item">
            <div class="song__item-body" data-index="${i+1}" data-songId="${song.id}">
                <div class="row ali-center h-100">
                    <div>
                        <p class="song-id">${addZeroBefore(i+1)}</p>
                        <audio src="${convertDriveLink(song.path)}"></audio>
                    </div>

                    <div>
                        <img class="song__img" src="${song.image}" alt="">
                    </div>

                    <div class="song__dct">
                        <h4 class="song__name">${song.name}</h4>
                        <p class="song__author">${song.singer}</p>
                        <div class="row ali-center song__duration">
                            <span></span>
                            <p class="time__left">${convertToMinute(song.duration) || "00:00"}</p>
                        </div>
                    </div>

                    <div class="row flex-column jus-evenly ali-center h-100">
                        <i class="fa-solid fa-heart"></i>

                        <i class="fa-solid fa-download"></i>
                    </div>
                </div>

                <div class="form-update">
                </div>
            </div>
        </div>
        `;
    });

    if (myVar.totalSong) {
        myVar.totalSong.innerHTML = songList.length;
    }
    selector.innerHTML = html.join("");
    renderTimeDuration(songList);
};

export function countElementTime(list, x) {
    var count = 0;

    for (let i = 0; i < list.length; i++) {
        const value = list[i];

        if (value == x) {
            count++;
        }
    }
    return count;
}

// Tính toán lại Id bài hát khi thêm xóa
export function CountFromID(id, songList) {
    var songItem = myVar.$$(".song__item-body");
    var songId = myVar.$$(".song__item-body .song-id");

    for (let i = id; i < songList.length; i++) {
        const song = songList[i];

        song.id -= 2;
        songId[i].innerHTML = song.id;
        songItem[i].dataset.index = `${song.id}`;
    }
}

// Lấy ra phần tử cha
export function getParentElement(element, parent) {
    while (element.parentElement) {
        if (element.parentElement.matches(parent)) {
            return element.parentElement;
        }

        element = element.parentElement;
    }
}