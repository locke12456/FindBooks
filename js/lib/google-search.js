(function ($) {
    /**
     * Simple wrapper around the Google AJAX Search API.
     *
     * This is the simplest usage:
     *
     *     $.googleSearch('my search', {
     *       callback: function(responseData) {
     *         // your code here
     *       }
     *     })
     *
     *  responseData passed to your callback is more or less the raw
     *  response data you get back from Google. For details on its structure, see:
     *     http://code.google.com/apis/ajaxsearch/documentation/reference.html#_fonje_response
     *
     * callback is the only required option. Others possible ones are:
     *  - version: API version, defaults to 1.0 (the only allowed one)
     *  - type: the type of search to do, defaults to 'web'. Possible values are:
     *    - web
     *    - local
     *    - video
     *    - blogs
     *    - news
     *    - books
     *    - images
     *    - patent
     *    - See http://code.google.com/apis/ajaxsearch/documentation/reference.html#_fonje_urlbase for latest available searches
     *  - urlParams: an object containing extra parameters to pass to the API.
     *    - For standard parameters across all searches, see:
     *      http://code.google.com/apis/ajaxsearch/documentation/reference.html#_fonje_args
     *    - For search type specific parameters, see:
     *      http://code.google.com/apis/ajaxsearch/documentation/reference.html#_fonje_web
     */
    var _search_queue = [];
    $.googleSearch = function (query, options) {
        /*   */
        var settings = $.extend({
            version: "1.0",
            type: "web",
            query: query
        }, options);

        var urlParams = $.extend({
            v: settings.version,
            q: settings.query
        }, settings.urlParams)

        //var url = "http://ajax.googleapis.com/ajax/services/search/" + settings.type + "?callback=?&";

        var callback = function (response) {
            response = JSON.parse(response);
            settings.callback(response.responseData);
        };

        var url = "FindBookApi/search.php";
        //$.getJSON(url, callback);
        //alert(url);
        $.ajax({
            type: "GET",
            url: url,
            data: { keyword: query },
            success: function(msg) {
                callback(msg);
                Search.LoadComplete();
            }
        });
        Search.Loading();
    };

    $.loadPage = function (target , options) {
        var settings = $.extend({
            version: "1.0",
            type: "web",
            query: target
        }, options);
        var callback = function (response) {
            settings.callback(response);
        };
        var url = "FindBookApi/load.php";
        $.ajax({
            type: "GET",
            url: url,
            data: { url: target },
            success: function(msg) {
                callback(msg);
                Search.LoadComplete();
            }
        });
        Search.Loading();
    };
    $.addToQueue = function (query, options) {
        _search_queue.push(
            $.extend({
                version: "1.0",
                type: "web",
                query: query
            }, options)
        );
    };
})(jQuery);