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
    var phone_backgrounds = [
        ["0A_LOCK_REF.png", "0B_LOCK_REF.png"],
        ["1A_LOCK.png", "1B_HOME.png"],
        ["2A_LOCK.png", "2B_HOME.png"],
        ["3A_LOCK.png", "3B_HOME.png"],
        ["4A_LOCK.png", "4B_HOME.png"],
        ["5A_LOCK.png", "5B_HOME.png"],
        ["6A_LOCK.png", "6B_HOME.png"],
        ["7A_LOCK.png", "7B_HOME.png"],
        ["8A_LOCK.png", "8B_HOME.png"],
        ["9A_LOCK.png", "9B_HOME.png"],
        ["0A_LOCK_IPHONE_5.png"],
        ["1A_LOCK_IPHONE_5.png", "1B_HOME_IPHONE_5.png"],
        ["2A_LOCK_IPHONE_5.png", "2B_HOME_IPHONE_5.png"],
        ["3A_LOCK_IPHONE_5.png", "3B_HOME_IPHONE_5.png"],
        ["4A_LOCK_IPHONE_5.png", "4B_HOME_IPHONE_5.png"],
        ["5A_LOCK_IPHONE_5.png", "5B_HOME_IPHONE_5.png"],
        ["6A_LOCK_IPHONE_5.png", "6B_HOME_IPHONE_5.png"],
        ["7A_LOCK_IPHONE_5.png", "7B_HOME_IPHONE_5.png"],
        ["8A_LOCK_IPHONE_5.png", "8B_HOME_IPHONE_5.png"],
        ["9A_LOCK_IPHONE_5.png", "9B_HOME_IPHONE_5.png"]
    ];
    var audio_objects = {};
    var audio_list = $("#dates #inner");
    var audio_container = $("#dates");
    var audio_list_expanded = false;
    var menu_expanded = false;
    var last_log_played;
    var audio_playing;
    var current_page;
    var current_utilities;
    var utility_slot;
    var loaded_utilities = {};
    var ANIMATION_TIMEOUT = 500,
        MENU_ITEM_HIDDEN_OPACITY = 0,
        UTILITY_WIDTH = "230px";

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

    var utilities_list = $("#utilities #imgwrapper");
    var add_image = function(container, idx, pos) {
        return function(e){
            $(container).append(e.target);
            if (typeof loaded_utilities[idx] === "undefined") {
                loaded_utilities[idx] = {};
            }
            loaded_utilities[idx][pos] = e.target;
        };
    };

    var load_utility = function(index) {
        if (typeof current_utilities !== "undefined") {
            $(current_utilities[1]).css("display", "none");
            $(current_utilities[2]).css("display", "none");
        }
        if (typeof loaded_utilities[index] !== "undefined") {
            $(loaded_utilities[index][0]).css("display", "inline");
            if (typeof loaded_utilities[index][1] !== "undefined") {
                $(loaded_utilities[index][1]).css("display", "inline");
                current_utilities = [index, loaded_utilities[index][0],
                                     loaded_utilities[index][1]];
            } else {
                current_utilities = [index, loaded_utilities[index][0], undefined];
            }
        } else {
            var src = "{{ media_url('images/phones/') }}" + phone_backgrounds[index][0];
            var utility = $('<img src="' + src +'" class="left">');
            utility.width(UTILITY_WIDTH).load(add_image(phoneslot, index, 0));
            if (phone_backgrounds[i].length > 1) {
                src = "{{ media_url('images/phones/') }}" + phone_backgrounds[index][1];
                var utility2 = $('<img src="' + src +'" class="right" >');
                utility2.width(UTILITY_WIDTH).load(add_image(phoneslot, index, 1));
                current_utilities = [index, utility, utility2];
            } else {
                current_utilities = [index, utility, undefined];
            }
        }
        $("#utilities .arrow").css("visibility", "visible");
        if (index === 0) {
            $("#utilities .arrow.flip").css("visibility", "hidden");
        } else if (index === phone_backgrounds.length - 1) {
            $("#utilities .arrow").css("visibility", "hidden");
            $("#utilities .arrow.flip").css("visibility", "visible");
        } else {
            $("#utilities .arrow.flip").css("visibility", "visible");
            $("#utilities .arrow").css("visibility", "visible");
        }
    };

    var populate_utilities = function() {
        phoneslot = document.createElement("div");
        phoneslot.className = "phonepair";
        load_utility(0);
        utilities_list.append(phoneslot);
    };

    $("#utilities .arrow").click(function() {
        if (!$(this).is(':visible')) {
            return;
        }
        if ($(this).hasClass("flip")) {
            load_utility(
                Math.max(current_utilities[0] - 1, 0));
        } else {
            load_utility(
                Math.min(current_utilities[0] + 1, phone_backgrounds.length - 1));
        }
    });

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
            $("body").css("background-image", "url('media/images/LONDON_OCONNOR_2016_SITE_NIGHT.png')");
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

    $("#logo").mouseover(function() {
        if (!menu_expanded) {
            expand_menu();
        }
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
                $(".menuitem." + pages[i]).animate(
                    {opacity: MENU_ITEM_HIDDEN_OPACITY}, ANIMATION_TIMEOUT);
            }
        }
        $(".menuitem.instagram").animate({opacity: MENU_ITEM_HIDDEN_OPACITY},
            ANIMATION_TIMEOUT);
        $(".menuitem.twitter").animate({opacity: MENU_ITEM_HIDDEN_OPACITY},
            ANIMATION_TIMEOUT);
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
            menu_expanded = false;
        };
    };

    for (var i = 0; i < pages.length; i++) {
        $(".menuitem." + pages[i]).click(build_page_click_handler(pages[i]));
    }

    $(document).ready(function() {
        set_background();
        populate_logs();
        populate_utilities();
        play_log();
    });
})();
