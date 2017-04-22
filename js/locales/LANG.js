/*!
 * Star Rating <LANG> Translations
 *
 * This file must be loaded after 'star-rating.js'. Patterns in braces '{}', or
 * any HTML markup tags in the messages must not be converted or translated.
 *
 * NOTE: this file must be saved in UTF-8 encoding.
 *
 * @see http://github.com/kartik-v/bootstrap-star-rating
 * @author Kartik Visweswaran <kartikv2@gmail.com>
 */
(function ($) {
    "use strict";
    $.fn.ratingLocales['<LANG>'] = {
        defaultCaption: '{rating}%',
        starCaptions: {
            0.5: 'Half Star',
            1: 'One Star', 
            2: 'Two Stars', 
            3: 'Three Stars', 
            4: 'Four Stars', 
            5: 'Five Stars',
            6: 'Six Stars',
            7: 'Seven Stars',
            8: 'Eight Stars',
            9: 'Nine Stars',
           10: 'Ten stars'
        },
        clearButtonTitle: 'Clear',
        clearCaption: 'Not Rated'
    };
})(window.jQuery);
