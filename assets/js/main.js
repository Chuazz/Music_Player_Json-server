import * as myVar from "./module/variable.js";
import * as myFunc from "./module/function.js";

var songList =  JSON.parse(localStorage.getItem("songList"));
var likedSong = [];
var likedSongId = [];
var songedId = [];
var imgSize = myVar.currImg.scrollWidth;

var imgAnimate = myVar.currImg.animate([
    { transform: "rotate(360deg)" },
],{
    duration: 7000,
    iterations: 99999,
});

imgAnimate.pause();

const myApp = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    config: JSON.parse(localStorage.getItem(myVar.APP_CONFIG)) || {},

    // Cấu hình các chức năng
    setConfig: function (key, value) {
        this.config[key] = value ;
        localStorage.setItem(myVar.APP_CONFIG, JSON.stringify(this.config));
    },

    // Lưu cấu hình người dùng
    saveConfig: function () {
        this.setConfig("isRepeat", this.isRepeat);
        this.setConfig("isRandom", this.isRandom);
        this.setConfig("isMute", myVar.audio.muted);
        this.setConfig("songVolumeRange", myVar.songVolumeRange.value);
        this.setConfig("volume", myVar.audio.volume);
        this.setConfig("currentIndex", this.currentIndex);
        this.setConfig("likedSongId", likedSongId.sort());
        this.setConfig("likedSong", likedSong);
    },

    // Tải cấu hình người dùng 
    renderConfig: function () {
        var songContents = myVar.$$(".song__item-body");
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.currentIndex = this.config.currentIndex || this.currentIndex;
        myVar.audio.muted = this.config.isMute;

        if(this.config.likedSongId){
            likedSongId = this.config.likedSongId;
            likedSong = this.config.likedSong;
        }

        if(this.config.volume){
            myVar.audio.volume = this.config.volume;
        }

        if(this.config.songVolumeRange){
            myVar.songVolumeRange.value = this.config.songVolumeRange;
        }

        if(this.isRandom){
            myVar.randomBtn.classList.add("active");
        }
        if(this.isRepeat){
            myVar.repeatBtn.classList.add("active");
        }
        if(myVar.audio.muted){
            myVar.audio.volume = 0;
            myVar.songVolumeRange.value = 0;
        }

        if(myVar.audio.volume > 0 || myVar.audio.volume <= 0.6){
            myVar.songVolumeIcon.classList.replace("fa-volume-high", "fa-volume-low");
            myVar.songVolumeIcon.classList.replace("fa-volume-xmark", "fa-volume-low");
        }
        if(myVar.audio.volume > 0.6){
            myVar.songVolumeIcon.classList.replace("fa-volume-low", "fa-volume-high");
            myVar.songVolumeIcon.classList.replace("fa-volume-xmark", "fa-volume-high");
        }
        if(myVar.audio.volume === 0){
            myVar.songVolumeIcon.classList.replace("fa-volume-high", "fa-volume-xmark");
            myVar.songVolumeIcon.classList.replace("fa-volume-low", "fa-volume-xmark");
            myVar.audio.volume = 0;
        }

        if(likedSongId.length > 0){
            likedSongId.forEach(song => {
                songContents.forEach(songContent => {
                    if(Number(songContent.dataset.index) === song){
                        songContent.querySelector(".fa-heart").classList.add("active", "checked");
                    }
                });
            });
        }

        this.loadCurrentSong();
        this.scrollToSong();
    },

    // Lấy danh sách bài hát
    loadSongList: function () {
        fetch(myVar.songAPI)
            .then(response => {
                return response.json();
            })
            .then(data => {
                localStorage.setItem("songList", JSON.stringify(data));
                myFunc.renderSong(data, myVar.playlist);
                this.loadCurrentSong();
            })
    },

    // Hiển thị bài hát hiện tại
    loadCurrentSong: function (songs = songList || JSON.parse(localStorage.getItem("songList"))) {
        var currentSong = songs[this.currentIndex];
        var songContents = myVar.$$(".song__item-body");

        myVar.audio.load();
        if(this.currentIndex === - 1 || this.currentIndex === songs.length){
            this.currentIndex = 0;
        }

        myVar.$("title").innerHTML = `${currentSong.name}`;
        myVar.$("link[type='image/x-icon']").href = `${currentSong.image}`;

        if(songContents){   
            songContents.forEach(songContent => {
                songContent.classList.remove("active");
            });
            songContents[this.currentIndex].classList.add("active");
        }

        if(this.currentIndex === songs.length-1){
            myVar.nextSong.innerText = `${songs[0].name}`
        }
        else{
            myVar.nextSong.innerText = `${songs[this.currentIndex + 1].name}`
        }

        myVar.currSongName.innerHTML = `${currentSong.name}`;
        myVar.currSinger.innerHTML = `${currentSong.singer}`;
        myVar.currImg.querySelector("img").src = `${currentSong.image}`;
        myVar.audio.src = `${myFunc.convertDriveLink(currentSong.path)}`;
        
        if(currentSong.duration === null){
            myVar.audio.addEventListener("loadedmetadata", () => {
                myVar.end.innerHTML = myFunc.convertToMinute(myVar.audio.duration);
            });
        }
        else{
            myVar.end.innerHTML = myFunc.convertToMinute(currentSong.duration);
        }

        this.saveConfig();
    },

    // Thêm số 0 với số nhỏ hơn 10
    addZeroBefore: myFunc.addZeroBefore,

    // Chuyển sang phút giây
    convertToMinute: myFunc.convertToMinute,

    // Hiển thị thời lượng bài hát
    renderTimeDuration: myFunc.renderTimeDuration,

    // Xử lý âm lượng
    volumeLogic: function () {
        // error: volume < 0
        if(myVar.audio.volume < 0.1){
            myVar.audio.volume = 0;
        }

        // error: volume > 1
        if(myVar.audio.volume > 0.9){
            myVar.audio.volume = 1;
        }

        // medium
        if(myVar.audio.volume > 0 || myVar.audio.volume <= 0.6){
            myVar.songVolumeIcon.classList.remove("fa-volume-high");
            myVar.songVolumeIcon.classList.remove("fa-volume-xmark");
            myVar.songVolumeIcon.classList.add("fa-volume-low");
            myVar.audio.muted = false;
        }

        // high
        if(myVar.audio.volume > 0.6){
            myVar.songVolumeIcon.classList.add("fa-volume-high");
            myVar.songVolumeIcon.classList.remove("fa-volume-xmark");
            myVar.songVolumeIcon.classList.remove("fa-volume-low");
            myVar.audio.muted = false;
        }

        // mute
        if(myVar.audio.volume === 0){
            myVar.songVolumeIcon.classList.remove("fa-volume-high");
            myVar.songVolumeIcon.classList.add("fa-volume-xmark");
            myVar.songVolumeIcon.classList.remove("fa-volume-low");
            myVar.audio.volume = 0;
            myVar.audio.muted = true  
        }
    },

    // Xử lý thời gian tự tăng giảm
    countTimeHandle: function (time, option) {
        switch (option) {
            // Thời gian còn lại
            case true:
                {
                    var duration = parseInt( myVar.audio.duration );
                    var currentTime = parseInt( myVar.audio.currentTime );
                    var timeLeft = duration - currentTime;
                    var s, m;
                
                    s = timeLeft % 60;
                    m = Math.floor( timeLeft / 60 ) % 60;
                    
                    s = s < 10 ? "0"+s : s;
                    m = m < 10 ? "0"+m : m;
                    
                    time.innerHTML = m+":"+s;
                    break;
                }
            // Thời gian chạy
            case false:
                {
                    var s = parseInt(myVar.audio.currentTime % 60);
                    var m = parseInt((myVar.audio.currentTime / 60) % 60);
                    if (s < 10) {
                        time.innerHTML = m + ':0' + s;
                    }
                    else {
                        time.innerHTML = m + ':' + s;
                    }

                    break;
                }
            default:
                break;
        }
    },

    // Tải bài hát tiếp theo
    loadNextSong: function () {
        this.currentIndex += 1;

        if(this.currentIndex >= songList.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        this.scrollToSong();
        myVar.audio.play();
    },

    // Tải bài hát trước đó
    loadBeforeSong: function () {
        this.currentIndex -= 1;
        
        if(this.currentIndex < 0){
            this.currentIndex = songList.length - 1;
        }
        
        this.loadCurrentSong();
        this.scrollToSong();
        myVar.audio.play();
    },

    // Bài nào chạy tự cuộn đến bài đó
    scrollToSong: function () {
        var songContents = myVar.$$(".song__item-body");

        if(this.currentIndex < 0){
            this.currentIndex = songList.length - 1;
        }

        songContents[this.currentIndex].scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    },

    // Phát bài hát ngẫu nhiên không bị trùng bài trước
    playRandom: function () {
        var random = Math.floor(Math.random() * songList.length);
        songedId.push(this.currentIndex);

        this.currentIndex = random;
        while(songedId.includes(random) && songedId.length < songList.length){
            random = Math.floor(Math.random() * songList.length);
        }
        this.currentIndex = random;
        
        if(songedId.length > songList.length){
            random = Math.floor(Math.random() * songList.length);
            songedId = [random];
        }
        this.scrollToSong();
    },

    // Đặt tất cả về mặc định
    setDefault: function () {
        imgAnimate.finish();
        this.isPlaying = false;
        this.currentIndex = 0;
        myVar.progess.value = 0;
        myVar.currSong.classList.remove("playing");
        myVar.start.innerHTML = "00:00";
    },

    // Chuyển sang tab khác
    changeTabHanlde: function (e) {
        var currentSongList = songList;
        var mostlyPlay = e.target.closest(".most-play");
        var liked = e.target.closest(".like-song");
        
        if(myVar.$(".play-with__item.active")){
            myVar.$(".play-with__item.active").classList.remove("active")
        }

        if(liked){
            if(likedSong.length == 0){
                myVar.alertContent.classList.remove("remove");
                currentSongList = [];
                myVar.playlist.innerHTML = "";
                myVar.totalSong.innerHTML = currentSongList.length;
            }
                
            else{
                currentSongList = likedSong;
                this.setDefault();
    
                myVar.$$(".song__content-body").forEach(songContent => {
                    songContent.querySelector(".fa-heart").classList.add("active");
                });
    
                myFunc.renderSong(currentSongList, myVar.playlist);
            }
            liked.classList.add("active");
        }

        if(mostlyPlay){
            this.setDefault();

            myVar.alertContent.classList.add("remove");
            myVar.playlist.classList.remove("remove");
            
            mostlyPlay.classList.add("active");
            myFunc.renderSong(songList, myVar.playlist);
        }

        if(liked && likedSong.length > 0 || mostlyPlay){
            this.loadCurrentSong();
            this.renderConfig();
        }
    },

    // Lấy danh sách bằng Id
    getSongByListId: function (listId) {
        likedSong = [];
        for (let i = 0; i < listId.length; i++) {
            const songId = listId[i];
            
            for (let j = 0; j < songList.length; j++) {
                const song = songList[j];
                
                if(song.id === songId){
                    likedSong.push(song);
                }
            }
        }
    },

    // Xử lý tất cả sự kiện: scroll, click, play, pause....
    handleEvents: function () {
        // Không biết ghi gì :)))
        window.addEventListener("click", (e) => {
            if(!e.target.closest(".change-tab") && !e.target.closest(".fa-bars")){
                myVar.changeTab.classList.add("remove");
            }
        });

        // Cuộn để phóng to thu nhỏ hình ảnh
        window.addEventListener("scroll", function() {
            var newSize = imgSize - this.window.scrollY;
            var opacity = newSize / imgSize;

            if(newSize <= 0){
                newSize = 0;
            }
            
            myVar.currImg.style.width = newSize + "px";
            myVar.currImg.style.height = newSize + "px";
            myVar.currImg.style.opacity = `${opacity}`;
        });

        // Bấm để chạy, dừng bài hát
        myVar.toogleBtn.addEventListener("click", () => {
            if(this.isPlaying){
                myVar.audio.pause();
            }
            else{
                myVar.audio.play();
            }
        });

        // Xử lý khi nhạc được chạy
        myVar.audio.addEventListener("play", () => {
            myVar.currSong.classList.add("playing");
            this.isPlaying = true;
            imgAnimate.play();  
        });

        // Xử lý khi nhạc được dừng
        myVar.audio.addEventListener("pause", () => {
            myVar.currSong.classList.remove("playing");
            this.isPlaying = false;
            imgAnimate.pause();
        });

        // Hiển thị tiến trình bài hát
        myVar.audio.addEventListener("timeupdate", () => {
            if(myVar.audio.duration){
                var timeUpdate = (myVar.audio.currentTime / myVar.audio.duration) * 100;

                myVar.progess.value = timeUpdate;
                this.countTimeHandle(myVar.start, false);
                this.countTimeHandle(myVar.end, true);
            }
        });

        // Khi bài hát được tua
        myVar.progess.addEventListener("input", () => {
            myVar.audio.currentTime = myVar.audio.duration * myVar.progess.value / 100;
        });

        // Khi bài hát kết thúc, xử lý tùy theo (bài kế hoặc lặp lại)
        myVar.audio.addEventListener("ended", () => {
            if(this.isRandom){
                songedId.push(this.currentIndex)
                this.playRandom();
                this.loadCurrentSong();
                myVar.audio.play();
            }

            if(this.isRepeat){
                myVar.audio.play();
            }

            else{
                this.loadNextSong();
            }
        });

        // Bấm để chuyển bài mới
        myVar.forwardBtn.addEventListener("click", () => {
            if(this.isRandom){
                this.playRandom();
                this.loadCurrentSong();
                myVar.audio.play();
            }
            else{
                this.loadNextSong();
            }
        });

        // Bấm để lùi về 1 bài
        myVar.backwardBtn.addEventListener("click", () => {
            if(this.isRandom){
                this.playRandom();
                this.loadCurrentSong();
                myVar.audio.play();
            }
            else{
                this.loadBeforeSong();
            }
        });

        // Bấm để lặp lại 1 bài
        myVar.repeatBtn.addEventListener("click", () => {
            this.isRepeat = !this.isRepeat;
            myVar.repeatBtn.classList.toggle("active");
            this.saveConfig();
        });
        
        // Bấm để phát ngẫu nhiên
        myVar.randomBtn.addEventListener("click", () => {
            this.isRandom = !this.isRandom;
            myVar.randomBtn.classList.toggle("active");
            this.saveConfig();
        });

        // Bấm bài nào hát bài đó và xử lý từng lựa chọn
        myVar.playlist.addEventListener("click", (e) => {
            var song = e.target.closest(".song__item-body:not(.active)");
            var downloadBtn = e.target.closest(".fa-download");
            var likeSong = e.target.closest(".fa-heart");
            var parent = myFunc.getParentElement(e.target, ".song__item-body");
            
            if( song && !downloadBtn && !likeSong){
                myVar.$(".song__item-body").classList.remove(".active");
                this.currentIndex = Number(song.dataset.index-1);
                this.loadCurrentSong();
                this.scrollToSong();
                myVar.audio.play();
            }

            if(downloadBtn){
                window.open(`${parent.querySelector("audio").src}`)
            }

            if(likeSong){
                var index = Number(parent.dataset.index);
                e.target.classList.toggle("active");

                likedSongId.push(index);
                
                likedSongId = likedSongId.filter(song => {
                    return myFunc.countElementTime(likedSongId, song) === 1;
                });

                this.getSongByListId(likedSongId);
            }

            this.saveConfig();
        });

        // Xử lý hiện thanh âm lượng
        myVar.songVolume.addEventListener("mouseover", () => {
            myVar.$(".song__volume input").classList.add("animateIn");
            myVar.$(".song__volume input").classList.replace("animateOut", "animateIn");
        });

        // Xử lý hiện ẩn âm lượng
        myVar.songVolume.addEventListener("mouseout", () => {
            myVar.$(".song__volume input").classList.replace("animateIn", "animateOut");
        });

        // #error
        // Khi tắt thì âm lượng về 0, còn khi bật lại thì âm lượng trả về giá trị trước khi tắt
        // Bật tắt âm lượng
        myVar.songVolumeIcon.addEventListener("click", () => {
            myVar.audio.muted = !myVar.audio.muted;

            if(myVar.audio.muted){
                myVar.audio.volume = 0;
                myVar.songVolumeRange.value = "0";
            }
            else{
                myVar.audio.volume = 1;
                myVar.songVolumeRange.value = "1";
            }

            this.volumeLogic();
            this.saveConfig();
        });

        // Tăng giảm âm lượng
        myVar.songVolumeRange.addEventListener("input", () => {
            myVar.audio.volume = myVar.songVolumeRange.value;
            this.volumeLogic();
            this.saveConfig();
        });

        // Bấm để hiện menu từ tablet trở xuống
        myVar.menuBar.addEventListener("click", (e) => {
            myVar.changeTab.classList.toggle("remove")
        });

        // Bấm để chuyển tab
        myVar.changeTab.addEventListener("click", (e) => {
            this.changeTabHanlde(e);
        });

        // Bấm để chuyển sang bài hát yêu thích trên laptop
        myVar.playWith.addEventListener("click", (e) => {
            this.changeTabHanlde(e);
        });

        // Bấm xuống để thực thi 
        window.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "Space": {
                    if(this.isPlaying){
                        myVar.audio.pause();
                    }
                    else{
                        myVar.audio.play();
                    }
                    e.preventDefault();
                    break;
                }
                case "ArrowRight": {
                    myVar.audio.currentTime += 10;
                    break;
                }
                case "ArrowLeft": {
                    myVar.audio.currentTime -= 10;
                    break;
                }
                // #error: Tăng âm lượng thì cái value của cái input nó chỉ dừng ở 0.5😒
                // chê
                case "ArrowDown": {
                    // myVar.audio.volume -= 0.1;
                    // myVar.songVolumeRange.value -= 0.1;
                    // this.volumeLogic();
                    e.preventDefault();
                    break;
                }
                case "ArrowUp": {
                    // myVar.audio.volume += 0.1;
                    // myVar.songVolumeRange.max = 1;
                    // myVar.songVolumeRange.value += 0.1;
                    // this.volumeLogic();
                    e.preventDefault();
                    break;
                }
                case "AltLeft": 
                case "AltRight": {
                    myVar.keyShortCut.forEach(item => {
                        item.classList.remove("remove");
                    });
                    e.preventDefault();
                    break;
                }
                default:{
                    break;
                }
            }

            if(e.altKey){
                if(e.code === "ArrowRight"){
                    this.loadNextSong();
                }
                if(e.code === "ArrowLeft"){
                    this.loadBeforeSong();
                }
                if(e.code === "KeyN"){
                    this.isRandom = !this.isRandom;
                    myVar.randomBtn.classList.toggle("active");
                }
                if(e.code === "KeyL"){
                    this.isRepeat = !this.isRepeat;
                    myVar.repeatBtn.classList.toggle("active");
                }           
            }

            this.saveConfig();
        });

        // Thả phím để thực thi
        window.addEventListener("keyup", (e) => {
            switch(e.code){
                case "AltLeft":
                case "AltRight": {
                    myVar.keyShortCut.forEach(item => {
                        item.classList.add("remove");
                    });
                    e.preventDefault
                    break;
                }
                default: {
                    break;
                }
            }
        });
    },

    // Thực thi chương trình
    start: function () {
        if(songList){
            myFunc.renderSong(songList, myVar.playlist);
            this.renderConfig();
            this.loadCurrentSong();
        }
        else{
            this.loadSongList();
        }
        this.handleEvents();
    }
};
myApp.start();