(function(){
    var audio_logs = [
        ["1/22/2016", "TEST_1_22_16.mp3"],
        ["12/2/2015", "TEST_12_2_15.mp3"],
        ["12/1/2015", "TEST_12_1_15.mp3"],
        ["11/28/2015", "TEST_11_28_15.mp3"],
        ["11/27/2015", "TEST_11_27_15.mp3"],
        ["10/26/2015", "TEST_10_26_15.mp3"],
        ["8/5/2015", "TEST_8_5_15.mp3"]
    ];
    var audio_objects = {};
    var audio_list = $("#dates #inner");
    var audio_container = $("#dates");
    var audio_list_expanded = false;

    var build_click_handler = function(datestamp) {
        return function(event) {
            if (audio_list_expanded) {
                collapse_audio_list(event.target, datestamp);
                play_log(datestamp);
            } else {
                expand_audio_list();
            }
        };
    };

    var collapse_audio_list = function(elem, datestamp) {
        audio_list_expanded = false;
        var idx = get_log_by_date(datestamp)[0];
        var relativeTop = $(elem).height() * idx;
        audio_container.animate({height: "50px"}, 500);
        audio_list.animate({scrollTop: relativeTop}, 500);
        $("#rightwrapper .arrow").css("visibility", "hidden");
        $("#rightwrapper .arrow.flip").css("visibility", "hidden");
    };

    var expand_audio_list = function() {
        audio_list_expanded = true;
        audio_container.animate({height: "200px"}, 500);
        set_arrow_visibility();
    };

    var populate_logs = function (){
        for (var i = 0; i < audio_logs.length; i++) {
            var elem = document.createElement("div");
            elem.className = "date";
            elem.innerHTML = audio_logs[i][0];
            audio_list.append(elem);
            $(elem).click(build_click_handler(audio_logs[i][0]));
        }
    };

    var get_log_by_date = function(datestamp) {
        for (var i = 0; i < audio_logs.length; i++) {
            if (audio_logs[i][0] === datestamp) {
                return [i, audio_logs[i]];
            }
        }
    };

    var play_log = function(datestamp) {
        var filename, entry;
        if (typeof datestamp === "undefined") {
            entry = audio_logs[audio_logs.length - 1];
            datestamp = entry[0];
        }
        entry = get_log_by_date(datestamp)[1];
        filename = entry[1];
        for (var key in audio_objects) {
            audio_objects[key].pause();
        }
        var audio = new Audio('media/audio/' + filename);
        //audio.play();
        audio_objects[datestamp] = audio;
    };

    var set_arrow_visibility = function() {
        var scrollAmount = audio_list.scrollTop() + audio_list.height();
        if(scrollAmount == audio_list[0].scrollHeight) {
            $("#rightwrapper .arrow").css("visibility", "hidden");
            $("#rightwrapper .arrow.flip").css("visibility", "visible");
        } else if(scrollAmount == audio_list.height()) {
            $("#rightwrapper .arrow").css("visibility", "visible");
            $("#rightwrapper .arrow.flip").css("visibility", "hidden");
        } else {
            $("#rightwrapper .arrow").css("visibility", "visible");
            $("#rightwrapper .arrow.flip").css("visibility", "visible");
        }
    };

    audio_list.scroll(function() {
        if (!audio_list_expanded) {
            return;
        }
        set_arrow_visibility();
    });

    populate_logs();
    play_log();
})();
