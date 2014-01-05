var HTMLParser;
var exports = exports || {};

require([ 'lib/tagfinder', 'lib/google-search','lib/get_barcode_from_image', 'class/SearchBase/SearchEngine' , 'class/Decoder'], function (jquery) {
    $("#search").click(onSearchClick);
    $("#BookInfoClose").click(closeBookInformation);
});
function onSearchClick(e) {
    var search = new Search.SearchEngine();
    search.search($("#input").val(), callback);
}
function closeBookInformation(e) {
    $("#bookInformation").hide();
    $("#KeywordSearch").show();
}
function callback(data) {
    try {
        var msg = JSON.parse(data);
        var parser = exports.decomposeHtml(msg.msg, ["span", "a"]);
        var value = findPieces(parser, "#top");

        $('#book_img').attr("src", msg.img);
        //"bookname":"NARUTO\u706b\u5f71\u5fcd\u800552","Author":"\u5cb8\u672c\u9f4a\u53f2","Imprint":"\u51fa\u7248\u793e\uff1a","isbn"
        $("#bookAuthor").text("作者 : " + msg.Author);
        $("#bookName").text("書名 : " + msg.bookname);
        $("#bookPublishing").text("出版社 : " + msg.Imprint);
        $("#bookISBN").text(msg.isbn);
        $("#bookPrice").empty();
        $("#bookPrice").append(value);
       // $("#bookDepiction").text().append(value);
        $("#bookInformation").show();

    } catch (e) {
        alert(e.toString());
    }
}
function findPieces(type, start) {
    var data = "";
    var start_index, end_index, result_index = 0;
    var result = [start_index, end_index];
    for (var j = 0; j < type.tags.length; j++) {
        try {
            if (type.tags[j].a.href.match(start)) {
                result[result_index++] = type.tags[result_index >= result.length ? j : j+1].i;
                if (result_index >= result.length)break;
            }
        } catch (e) {
        }
    }
    for (var k = result[0]; k < result[1]; k++) {
        var r = type.pieces[k];
        data += r;
    }
    return data;
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