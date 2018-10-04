// ==UserScript==
// @name            TAU - Better bidding
// @description     Improve the user experience of bidding on courses in TAU's bidding website
// @version         1.0
// @namespace       https://www.github.com/sh0oki/tau-better-bidding
// @source          https://www.github.com/sh0oki/tau-better-bidding
// @include         https://www.ims.tau.ac.il/Bidd/BD/Kursim.aspx*
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
        // Increase max number of rows
        increase_max_rows();
        
        // Gray out FULL courses
        remove_full_courses();
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
    
    main();
};

$(document).ready(function() {
    mainWrapper()
});
