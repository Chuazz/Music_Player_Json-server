import * as myVar from "./variable.js";

// Chuyển đổi drive link để chạy nhạc được
export function convertDriveLink(importLink){
    var finalLink = "";
    var concatLink = "http://docs.google.com/uc?export=open&id=";

    if(importLink.startsWith("https://drive.google.com/file/d/") && importLink.endsWith("/view?usp=sharing")){
        var driveLink = importLink;
        var linkId = driveLink.split('/');

        finalLink = finalLink.concat(concatLink, linkId[5]);
        return finalLink;
    }
    return undefined;
}

export function addZeroBefore (number) {
    if(number < 10){
        number = `0${number}`;
    }
    return number;
};

export function convertToMinute (second) {
    var minute = addZeroBefore(Math.floor(second / 60));
    var second = addZeroBefore(Math.floor(second % 60));

    if(second >= 60){
        second = 0;
        minute += 1;
    }

    return `${minute}:${second}`;
};

export function renderTimeDuration (songList) {
    var audio = document.createElement("audio");
    audio.src = convertDriveLink(songList[0].path);

    if(songList[0].duration === null){
        audio.addEventListener("loadedmetadata", () => {
            myVar.$$(".song__item").forEach((song, i) => {
                songList[i].duration = song.querySelector("audio").duration;
                song.querySelector(".song__duration p").innerText = convertToMinute(songList[i].duration);
            });
        });
    }
}

export function renderSong(songList, selector) {
    var html = songList.sort((a, b) => a.id - b.id).map((song) => {
        return `
        <div class="song__item">
            <div class="song__item-body" data-index="${song.id}">
                <div class="row ali-center h-100">
                    <div>
                        <p class="song-id">${addZeroBefore(song.id)}</p>
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

    if(myVar.totalSong){
        myVar.totalSong.innerHTML = songList.length;
    }
    selector.innerHTML = html.join("");
    renderTimeDuration(songList);
};

export function countElementTime(list, x){
    var count = 0;

    for (let i = 0; i < list.length; i++) {
        const value = list[i];

        if(value == x){
            count++;
        }
    }
    return count;
}

// Tính toán lại Id bài hát khi thêm xóa
export function CountFromID(id, songList){
    var songContents = myVar.$$(".song__content-body");
    var songId = myVar.$$(".song__content-body .song-id");

    for (let i = 0; i < songList.length; i++) {
        const song = songList[i];
        if(i >= id){
            song.id -= 1;
            songContents[i].dataset.index = `${song.id}`;
            songId[i].innerHTML = this.addZeroBefore(song.id);
        }
    }
}

// Lấy ra phần tử cha
export function getParentElement(element, parent){
    while(element.parentElement){
        if(element.parentElement.matches(parent)){
            return element.parentElement;
        }

        element = element.parentElement;
    }
}