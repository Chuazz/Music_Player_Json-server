import { renderSong } from "../../../js/module/function.js";
import { removeContainer, songList } from "../../../js/module/variable.js";

const app = {
    start: function(){
        renderSong(songList, removeContainer);
    }
}

app.start();