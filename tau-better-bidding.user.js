// ==UserScript==
// @name            TAU - Better bidding
// @description     Improve the user experience of bidding on courses in TAU's bidding website
// @version         1.0.1
// @namespace       https://www.github.com/sh0oki/tau-better-bidding
// @source          https://www.github.com/sh0oki/tau-better-bidding
// @include         https://www.ims.tau.ac.il/Bidd/BD/Kursim.aspx*
// @include         https://www.ims.tau.ac.il/tal/TL/Mivchanim_L.aspx*
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// @copyright       2018, sh0oki
// ==/UserScript==

function mainWrapper() {
    var debug = false;
    var US_SHORT_NAME = 'BBD';
    var US_VERSION = 1.0;
    
    function debugLog(msg) {
        if (!debug) return;
        console.log(US_SHORT_NAME + ": " + msg);
    }
    
    function main() {
        if (location.href.includes("Kursim.aspx")) {
            // Increase max number of rows
            increase_max_rows();
            
            // Gray out FULL courses
            remove_full_courses();
        } else if (location.href.includes("Mivchanim_L.aspx")) {
            // Make Test date clickable
            add_to_google_calendar_links();
        }

    }

    function increase_max_rows() {
        max_rows = $('select[name="max_rows"]');
        max_rows.empty();
        max_rows_max_value = 0;
        for (i = 50; i <= 400; i = i * 2) {
            max_rows_max_value = i;
            max_rows.append($('<option/>', { 
                value: max_rows_max_value,
                text : max_rows_max_value
            }));
        }
        max_rows.val(max_rows_max_value);
    }

    function remove_full_courses() {
        tr_selector = $('.tableblds td span b:contains(0)')
            .closest("tr");

        hide_full_courses(tr_selector);
        
        hide_full_courses(tr_selector
            .filter("tr:not(:has(>input[type='checkbox']))")
            .prev());
    }

    function hide_full_courses(selector) {
        selector.css("text-decoration", "line-through")
            .css("background-color", '#AAAFB4');


        selector.find('input[type=checkbox]')
            .attr('disabled', true);
    }

    function link_to_google_calendar(where, date, time, title, description) {
        m = moment(date + " " + time, "DD/MM/YYYY hh:mm").utc();
        m2 = moment(m).add('hours', 2);
        date_range = m.format() + "/" + m2.format();

        url = "http://www.google.com/calendar/event?action=TEMPLATE&text=" + encodeURIComponent(title) + 
                "&dates=" + encodeURIComponent(date_range.replace(/[\:\-]/g, "")) + 
                "&location=" + encodeURIComponent("Tel Aviv University") + 
                "&details=" + encodeURIComponent(description);
        
        $(where).wrapInner("<a target=\"_blank\" href=\"" + url + "\"></a>")
    }
    
    function add_to_google_calendar_links() {
        $.each($("table.table tr:not(.listth)"), function(_, tr) {
            cells = $(tr).find("td");
            if (7 != cells.length) {
                return;
            }

            course_id = cells[0].innerText;
            course_name = cells[2].innerText;
            
            exam_id = cells[3].innerText;
            date = cells[4].innerText;
            time = cells[5].innerText;

            exam_name = "[מבחן] " + course_name + " - מועד " + exam_id;
            link_to_google_calendar(cells[4],
                date, time,
                exam_name, 
                "");
        });
    }

    main();
};

$(document).ready(function() {
    mainWrapper()
});
