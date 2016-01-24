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
    var audio_playing;
    var current_page;
    var ANIMATION_TIMEOUT = 500;

    var build_log_click_handler = function(datestamp) {
        return function(event) {
            if (audio_list_expanded) {
                collapse_audio_list(event.target, datestamp);
                var audio = play_log(datestamp);
                last_log_played = [event.target, datestamp, audio];
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
        audio_container.animate({height: "50px"}, ANIMATION_TIMEOUT);
        audio_list.animate({scrollTop: relativeTop}, ANIMATION_TIMEOUT);
        $("#logwrapper .arrow").css("visibility", "hidden");
        $("#logwrapper .arrow.flip").css("visibility", "hidden");
        $("#dateslabel").animate({opacity: 0}, ANIMATION_TIMEOUT);
    };

    var expand_audio_list = function() {
        audio_list_expanded = true;
        audio_container.animate({height: "200px"}, ANIMATION_TIMEOUT);
        $("#dateslabel").animate({opacity: 1}, ANIMATION_TIMEOUT);
        set_arrow_visibility();
    };

    var populate_logs = function (){
        for (var i = 0; i < audio_logs.length; i++) {
            var elem = document.createElement("div");
            elem.className = "date";
            elem.innerHTML = audio_logs[i][0];
            audio_list.append(elem);
            $(elem).click(build_log_click_handler(audio_logs[i][0]));
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
        audio.play();
        audio_objects[datestamp] = audio;
        audio_playing = true;
        last_log_played = [undefined, datestamp, audio];
        return audio;
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
        $("#menuwrapper").animate({height: "300px"}, ANIMATION_TIMEOUT);
        collapse_audio_list(last_log_played[0], last_log_played[1]);
        for (var i = 0; i < pages.length; i++) {
            $(".menuitem." + pages[i]).animate({opacity: '1'}, ANIMATION_TIMEOUT);
        }
        $(".menuitem.instagram").animate({opacity: '1'}, ANIMATION_TIMEOUT);
        $(".menuitem.twitter").animate({opacity: '1'}, ANIMATION_TIMEOUT);
    };

    var collapse_menu = function() {
        menu_expanded = false;
        $("#menuwrapper").animate({height: "0px"}, ANIMATION_TIMEOUT);
        hide_pages(undefined, function(){});
    };

    audio_list.scroll(function() {
        if (!audio_list_expanded) {
            return;
        }
        set_arrow_visibility();
    });

    $("#pause").click(function() {
        if (audio_playing) {
            last_log_played[2].pause();
        } else {
            last_log_played[2].play();
        }
        audio_playing = !audio_playing;
    });

    $("#logo").click(function() {
        if (menu_expanded) {
            collapse_menu();
        } else {
            expand_menu();
        }
        if (typeof current_page !== "undefined") {
            $(current_page).animate({opacity: 0}, ANIMATION_TIMEOUT);
        }
    });

    var pages = ["album", "soundcloud", "utilities"];

    var hide_pages = function(pagename, callback) {
        var hide_page = function(elem) {
            return function() {
                elem.hide();
                callback();
            };
        };
        for (var i = 0; i < pages.length; i++) {
            if (pages[i] !== pagename) {
                $("#" + pages[i]).animate({opacity: 0}, ANIMATION_TIMEOUT, hide_page($("#" + pages[i])));
                $(".menuitem." + pages[i]).animate({opacity: '.4'}, ANIMATION_TIMEOUT);
            }
        }
        $(".menuitem.instagram").animate({opacity: '.4'}, ANIMATION_TIMEOUT);
        $(".menuitem.twitter").animate({opacity: '.4'}, ANIMATION_TIMEOUT);
    };

    var build_page_click_handler = function(pagename) {
        return function() {
            current_page = pagename;
            var show = function() {
                $("#" + current_page).show();
                $("#" + current_page).animate({opacity: 1}, ANIMATION_TIMEOUT);
                $(".menuitem." + current_page).animate({opacity: '1'}, ANIMATION_TIMEOUT);
            };
            hide_pages(current_page, show);
        };
    };

    for (var i = 0; i < pages.length; i++) {
        $(".menuitem." + pages[i]).click(build_page_click_handler(pages[i]));
    }

    $(document).ready(function() {
        set_background();
        populate_logs();
        play_log();
    });
})();
