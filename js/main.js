var HTMLParser;
var exports = exports || {};

require([ 'lib/tagfinder', 'lib/google-search','lib/get_barcode_from_image', 'class/SearchBase/SearchEngine' , 'class/Decoder' , 'class/History'], function (jquery) {
    $("#search").click(onSearchClick);
    $("#BookInfoClose").click(closeBookInformation);

    $("#ScanISBN").on("click", function () {
        Search.Loading();
        var pick = new MozActivity({
            name: "pick",
            data: {
                type: ["image/png", "image/jpg", "image/jpeg"]
            }
        });
        pick.onsuccess = function () { 
            // Create image and set the returned blob as the src
            if (!this.result.blob)
                return;
            reader = new Decoder();
            reader.decode(this.result.blob);
        };
        pick.onerror = function () { 
            // If an error occurred or the user canceled the activity
            alert("Can't view the image!");
            Search.LoadComplete();
        };
    });
    $("#History").on("click", function () {
        Search.SearchEngine.callback = callback;
        History.ShowPage();
    });
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
        $("#bookAuthor").text("作者 : " + msg.Author);
        $("#bookName").text("書名 : " + msg.bookname);
        $("#bookPublishing").text("出版社 : " + msg.Imprint);
        $("#bookISBN").text(msg.isbn);
        $("#bookPrice").empty();
        $("#bookPrice").append(value);
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