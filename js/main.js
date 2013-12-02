var HTMLParser;
var exports = exports || {};

require([ 'lib/tagfinder', 'lib/google-search','class/SearchBase/SearchEngine'], function (jquery) {
    $("#search").click(onSearchClick);
    $("#BookInfoClose").click(closeBookInformation);
    /*var record = document.querySelector("#record");

    try{
        if (record) {
            record.onclick = function () {
                var rec = new MozActivity({
                    name: "record" // Possibly capture in future versions
                });

                rec.onsuccess = function () { 
                        var img = document.createElement("img");
                    img.src = window.URL.createObjectURL(this.result.blob);
                    var imagePresenter = document.querySelector("#image-presenter");
                    imagePresenter.appendChild(img);
                    imagePresenter.style.display = "block";
                };

                rec.onerror = function () { 
                        alert("No taken picture returned");
                };
            }
        }
    }catch(e){

    }*/
});
function onSearchClick(e) {
    var search = new Search.SearchEngine();
    search.search($("#input").val(),"www.books.com.tw",callback);
}
function closeBookInformation(e){
    $("#bookInformation").hide();
    $("#KeywordSearch").show();
}
function callback(data) {
    try {
        var parser = exports.decomposeHtml(data.results[0], ["img","strong"]);
        var name = getValue(parser.pieces, ["<h1>"], 500);
        var author = getValue(parser.pieces, ["作者"], 500);
        var data = getValue(parser.pieces, ["出版社"], 500);
        var isbn = OnlyGetValue(parser.pieces, ["ISBN"], 500);
        var piece = getValue(parser.tags,[""],500);
        var img = OnlyGetUrl(parser.tags, [name]);
        img = img.replace("&amp;", "&");
        img = img.replace("&amp;", "&");

        $('#book_img').attr("src", img);
        $("#bookAuthor").text("作者 : "+author);
        $("#bookName").text("書名 : "+name);
        $("#bookPublishing").text("出版社 : "+data);
        $("#bookISBN").text(isbn);
        $("#bookInformation").show();

    } catch (e) {
        alert(e.toString());
    }
}
function getValue(type, result, index) {
    var data = "";
    for (var j = index; j < type.length; j++)
        for (var i = 0; i < result.length; i++) {
            if (type[j].match(result[i])) {
                for (var k = j + 1; k < j + 16; k++) {
                    var r = type[k].indexOf('<', 0);
                    if (type[k] != "" && r == -1 && type[k].indexOf('\n', 0) == -1)
                        return(type[k]);
                }
                return "";
            }
        }
    return data;
}
function OnlyGetValue(type, result, index) {
    var data = "";
    for (var j = index; j < type.length; j++)
        for (var i = 0; i < result.length; i++) {
            if (type[j].match(result[i])) {
                return type[j];
            }
        }
    return data;
}
function OnlyGetUrl(type, result) {
    var data = "";
    for (var j = 0; j < type.length; j++)
        for (var i = 0; i < result.length; i++) {
            if (type[j].a.alt == result[i]) return type[j].a.src;
        }
    return data;
}