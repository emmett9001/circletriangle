(function(){
    var audio_logs = [
        ["8/5/2015", "TEST_8_5_15.mp3"],
        ["10/26/2015", "TEST_10_26_15.mp3"],
        ["11/27/2015", "TEST_11_27_15.mp3"],
        ["11/28/2015", "TEST_11_28_15.mp3"],
        ["12/1/2015", "TEST_12_1_15.mp3"],
        ["12/2/2015", "TEST_12_2_15.mp3"],
        ["1/22/2016", "TEST_1_22_16.mp3"]
    ];
    var audio_objects = {};

    var build_click_handler = function(datestamp) {
        return function() {
            play_log(datestamp);
        };
    };

    var populate_logs = function (){
        var list = $("#dates #inner");
        for (var i = 0; i < audio_logs.length; i++) {
            var elem = document.createElement("div");
            elem.className = "date";
            elem.innerHTML = audio_logs[i][0];
            list.append(elem);
            $(elem).click(build_click_handler(audio_logs[i][0]));
        }
    };

    var play_log = function(datestamp) {
        var filename, entry;
        if (typeof datestamp === "undefined") {
            entry = audio_logs[audio_logs.length - 1];
            datestamp = entry[0];
            filename = entry[1];
        }
        for (var i = 0; i < audio_logs.length; i++) {
            if (audio_logs[i][0] === datestamp) {
                entry = audio_logs[i];
                filename = entry[1];
            }
        }
        for (var key in audio_objects) {
            audio_objects[key].pause();
        }
        var audio = new Audio('media/audio/' + filename);
        audio.play();
        audio_objects[datestamp] = audio;
    };

    populate_logs();
    //play_log();
})();
