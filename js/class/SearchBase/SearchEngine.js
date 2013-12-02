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
    search: function (key, site, callback) {
        Search.SearchEngine.callback = callback;
        $.googleSearch(key + "+site:" + site, {
                callback: this._searchCallback
            }
        );
    },
    _searchCallback: function (responseData) {
        try {
            var windowWidth = $(window).width(); //retrieve current window width
            var windowHeight = $(window).height(); //retrieve current window height
            windowHeight = windowWidth > windowHeight ? windowHeight / 4 : windowWidth / 4;
            var req = responseData;
            responseData.results = responseData.results = responseData.results || [];

            for (var i = 0; i < responseData.results.length; i++) {
                var td = '<td>' + Search.SearchEngine.HeaderReplace(responseData.results[i].title,"博客來") + '</td>';
                td += '<td  id=list_tr' + i.toString() + '_dec >' + responseData.results[i].content + '</td>';
                var tag = '<tr id=list_tr' + i.toString() + ' class=List' + '>' + td + '</tr>';
                $("#List").append(tag);
                $("#list_tr" + i).attr("height", (windowHeight).toString() + 'px');
                $("#list_tr" + i).attr("width", "100%");
                $("#list_tr" + i).attr("name", responseData.results[i].url);
                $("#list_tr" + i).click(Search.SearchEngine.loadBookMessage);
                $("#list_tr" + i)['url'] = responseData.results[i].url;
            }
            if(responseData.results.length!=0)
            $("#ListContainer").show();
            $("#KeywordSearch").hide();
            var callback = this._callback;
        } catch (e) {
            throw ("Search fail");
        }
    }


});
Search.SearchEngine.HeaderReplace=function(name,header){
    name = name.replace(header,"");
    name = name.replace("-","");
    return name;
}
Search.SearchEngine.LoadPage = function (url_path,callback) {
    var url = url_path;
    //var callback = Search.SearchEngine.callback;
    $.ajax({
        url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'" + url + "'&format=xml&callback=callback",
        type: 'GET',
        dataType: 'jsonp'
    });
}
Search.SearchEngine.loadBookMessage = function (e) {
    var url = $("#" + e.currentTarget.id).attr("name");
    var dec = $("#" + e.currentTarget.id+"_dec").text();
    $("#bookDepiction").text(dec);
    var callback = Search.SearchEngine.callback;
    $.ajax({
        url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'" + url + "'&format=xml&callback=callback",
        type: 'GET',
        dataType: 'jsonp'
    });
    Search.SearchEngine.clearList();
}
Search.SearchEngine.clearList = function () {
    $("#List").empty();
    $("#ListContainer").hide();
}