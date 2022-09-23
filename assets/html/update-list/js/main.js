import { convertDriveLink, convertToMinute, countElementTime, CountFromID, renderSong } from "../../../js/module/function.js";
import { $, $$, addButton, navbar, removeButton, removeContainer, songAPI, totalSongRemove } from "../../../js/module/variable.js";

var songList = JSON.parse(localStorage.getItem("songList"));
var checkedSong = [];

const app = {
    // Lấy danh sách bài hát
    loadSongList: function () {
        fetch(songAPI)
            .then(response => {
                return response.json();
            })
            .then(data => {
                renderSong(data, removeContainer);
            })
    },

    handleEvents: function () {
        // Chọn bài hát cần xóa
        removeContainer.addEventListener("click", (e) => {
            var songItem = e.target.closest(".song__item-body");

            if (songItem) {
                songItem.classList.toggle("active");
                totalSongRemove.innerHTML = $$(".song__item-body.active").length;
                checkedSong.push(Number(songItem.dataset.index));
                checkedSong = checkedSong.filter((value) => {
                    return countElementTime(checkedSong, value) === 1;
                });
            }
        });

        // Bấm để xóa
        removeButton.addEventListener("click", () => {
            var songItem = $$(".song__item");
            // var isSure = confirm("Bạn chắc chắn xóa những bài đã chọn ?");
            // if (isSure) {
                checkedSong.forEach(songId => {
                    songItem[songId - 1].remove();
                    songList.splice(songId - 1, 1);
                });
            // }
        });

        // Chuyển tab
        navbar.addEventListener("click", (e) => {
            var navItem = e.target.closest(".nav-item");
            var commandSongs = $$(".command-song");

            if (navItem) {
                $$(".nav-item").forEach((element, i) => {
                    commandSongs[i].classList.add("remove");
                });
                var index = Number(navItem.dataset.index);

                $(".command-song.active").classList.remove("active");
                commandSongs[index].classList.replace("remove", "active");

            }
        });

        // Bấm để thêm bài hát
        addButton.addEventListener("click", () => {
            var song = {
                id: songList.length + 1,
                name: $("input[name=songName]").value,
                singer: $("input[name=singerName]").value,
                path: $("input[name=songPath]").value,
                image: $("input[name=songImg]").value,
                duration: null,
            }

            if (JSON.parse(sessionStorage.getItem("error"))) {
                songList.push(song);
                localStorage.setItem("songList", JSON.stringify(songList));
                this.addSong(song);
            }
        });
    },

    // Xử lý thêm bài hát
    addSong: function (song) {
        var options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(song),
        };

        fetch(songAPI, options)
            .then((response) => response.json())
            .then(() => alert("Thêm bài hát thành công"));
    },

    // Xử lý xóa bài hát
    removeSong: function (id) {
        var options = {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

        };
        return;
        fetch(`${songAPI}/${id}`, options)
            .then(response => response.json())
            .then(() => {
                songItem[id - 1].remove();
                songList.splice(id - 1, 1);
                localStorage.setItem("songList", JSON.stringify(songList));
            })
    },

    start: function () {
        renderSong(songList, removeContainer);
        this.handleEvents();
    }
}

app.start();