import { renderSong } from "../../../js/module/function.js";
import { $$, removeContainer, songAPI, totalSongRemove } from "../../../js/module/variable.js";

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
        removeContainer.addEventListener("click", (e) => {
            var songItem = e.target.closest(".song__item-body");

            if(songItem){
                songItem.classList.toggle("active");
                totalSongRemove.innerHTML = $$(".song__item-body.active").length;
            }
        })
    },

    start: function () {
        this.loadSongList();
        this.handleEvents();
    }
}

app.start();