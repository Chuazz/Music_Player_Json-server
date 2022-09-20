import { countElementTime, renderSong } from "../../../js/module/function.js";
import { $, $$, addButton, navbar, removeContainer, songAPI, totalSongRemove } from "../../../js/module/variable.js";

var songList = JSON.parse(localStorage.getItem("songList"));
var checkedSong = [];

const app = {
    // Lấy danh sách bài hát
    // loadSongList: function () {
    //     fetch(songAPI)
    //         .then(response => {
    //             return response.json();
    //         })
    //         .then(data => {
    //             renderSong(data, removeContainer);
    //         })
    // },

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
                })
            }

            console.log(checkedSong);
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

        // Thêm bài hát
        addButton.addEventListener("click", () => {
            var song = {
                name: $("input[name=songName]").value,
                singer: $("input[name=singerName]").value,
                path: $("input[name=songPath]").value,
                image: $("input[name=songImg]").value,
                duration: null,
            };


            this.addSong(song);
        });
    },

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
            .catch(error => console.log(error))
    },

    start: function () {
        renderSong(songList, removeContainer);
        this.handleEvents();
    }
}

app.start();