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
    var menu_expanded = false;
    var last_log_played;

    var build_click_handler = function(datestamp) {
        return function(event) {
            if (audio_list_expanded) {
                collapse_audio_list(event.target, datestamp);
                play_log(datestamp);
                last_log_played = [event.target, datestamp];
            } else {
                expand_audio_list();
                collapse_menu();
            }
        };
    };

    var collapse_audio_list = function(elem, datestamp) {
        if (!audio_list_expanded) {
            return;
        }
        audio_list_expanded = false;
        var idx = get_log_by_date(datestamp)[0];
        var height = typeof elem === "undefined" ? 0 : $(elem).height();
        var relativeTop = $(elem).height() * idx;
        audio_container.animate({height: "50px"}, 500);
        audio_list.animate({scrollTop: relativeTop}, 500);
        $("#logwrapper .arrow").css("visibility", "hidden");
        $("#logwrapper .arrow.flip").css("visibility", "hidden");
        $("#dateslabel").animate({opacity: 0}, 500);
    };

    var expand_audio_list = function() {
        audio_list_expanded = true;
        audio_container.animate({height: "200px"}, 500);
        $("#dateslabel").animate({opacity: 1}, 500);
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
        return [0, audio_logs[0]];
    };

    var play_log = function(datestamp) {
        var filename, entry;
        if (typeof datestamp === "undefined") {
            datestamp = audio_logs[0][0];
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
            $("#logwrapper .arrow").css("visibility", "hidden");
            $("#logwrapper .arrow.flip").css("visibility", "visible");
        } else if(scrollAmount == audio_list.height()) {
            $("#logwrapper .arrow").css("visibility", "visible");
            $("#logwrapper .arrow.flip").css("visibility", "hidden");
        } else {
            $("#logwrapper .arrow").css("visibility", "visible");
            $("#logwrapper .arrow.flip").css("visibility", "visible");
        }
    };

    var set_background = function() {
        var hour = new Date().getHours();
        if (hour > 18) {
            $("body").css("background-image", "url('media/images/LONDON_OCONNOR_2016_SITE_NIGHT.jpg')");
        } else {
            $("body").css("background-image", "url('media/images/LONDON_OCONNOR_2016_SITE_DAY_GRADIENT.jpg')");
        }
    };

    var expand_menu = function() {
        menu_expanded = true;
        $("#menuwrapper").animate({height: "300px"}, 500);
        collapse_audio_list(last_log_played[0], last_log_played[1]);
    };

    var collapse_menu = function() {
        menu_expanded = false;
        $("#menuwrapper").animate({height: "0px"}, 500);
    };

    audio_list.scroll(function() {
        if (!audio_list_expanded) {
            return;
        }
        set_arrow_visibility();
    });

    $("#logo").click(function() {
        if (menu_expanded) {
            collapse_menu();
        } else {
            expand_menu();
        }
    });

    $(document).ready(function() {
        set_background();
        populate_logs();
        play_log();
    });
})();
