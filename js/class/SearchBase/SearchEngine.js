/**
 * Created by L on 2013/10/6.
 */
var Search = Search = Search || {};
Search.SearchEngine = Class.extend({
    _searchText: "",
    _tabs: [],
    _callback: null,
    ctor: function () {
        this._super();
    },
    search: function (key, callback) {
        Search.SearchEngine.callback = callback;
        $.googleSearch(key, {
                callback: this._searchCallback
            }
        );
    },
    _searchCallback: function (responseData) {
        try {
            if(responseData.results.length == 0)throw ("search fail");
            var windowWidth = $(window).width(); //retrieve current window width
            var windowHeight = $(window).height(); //retrieve current window height
            windowHeight = windowWidth > windowHeight ? windowHeight / 4 : windowWidth / 4;
            var req = responseData;
            responseData.results = responseData.results = responseData.results || [];

            for (var i = 0; i < responseData.results.length; i++) {
                var url = responseData.results[i].url;
                var https = url.indexOf("https") != -1;
                var basic = url.indexOf("basic") != -1;
                if (!https && basic) {
                    var title = responseData.results[i].title;
                    var name = '<a id=list_tr' + i.toString() + '_dec' + ' href="#">' + title + '</a>';
                    var li = '<li id="list_tr' + i.toString() + '">' + name + '</li>';
                    $("#List").append(li);
                    $("#list_tr" + i).attr("name", url);
                    $("#list_tr" + i).on("click", Search.SearchEngine.loadBookMessage);
                    $("#list_tr" + i).attr("url", url);
                    $("#list_tr" + i).attr("dec", responseData.results[i].content);
                }
            }

            $("#List").listview("refresh");
            if (responseData.results.length != 0)
                $("#ListContainer").show();
            $("#KeywordSearch").hide();
            var callback = this._callback;
        } catch (e) {
            throw ("Search fail");
        }
    }


});
Search.SearchEngine.HeaderReplace = function (name, header) {
    name = name.replace(header, "");
    name = name.replace("-", "");
    return name;
}
Search.SearchEngine.LoadPage = function (url_path, callback) {
    var url = url_path;
    //var callback = Search.SearchEngine.callback;
    $.ajax({
        url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'" + url + "'&format=xml&callback=callback",
        type: 'GET',
        dataType: 'jsonp'
    });
}
Search.SearchEngine.loadBookMessage = function (e) {
    var url = $("#" + e.currentTarget.id).attr("url");
    var dec = $("#" + e.currentTarget.id).attr("dec");
    $("#bookDepiction").empty();
    $("#bookDepiction").append(dec);
    var callback = Search.SearchEngine.callback;
    //var url = url_path;
    //var callback = Search.SearchEngine.callback;
    $.loadPage(url, {callback: callback});
    Search.SearchEngine.clearList();
}
Search.SearchEngine.clearList = function () {
    $("#List").empty();
    $("#ListContainer").hide();
}

Search.Loading = function(){
    $.mobile.loading("show", {
        text: "Loading .. ",
        textVisible: true,
        theme: "b",
        textonly:false,
        html: ""
    });
}
Search.LoadComplete = function(){
    $.mobile.loading( "hide" );
}