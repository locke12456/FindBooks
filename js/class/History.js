/**
 * Created by L on 2014/1/6.
 */
var History = History || {};
History = Class.extend({
    _historyList:[],
    ctor:function(){
        this._super();
    },
    init:function(){
        if(localStorage.getItem("read_history") == undefined)
            this._saveHistory();

        this._loadHistory();
    },
    add:function(item){
        //if(item !== History.Item)return;
        if(this._historyList.indexOf(item) == -1)
            this._historyList.push(item);
        this._saveHistory();
    },
    _loadHistory:function(){
        var json = localStorage.getItem("read_history");
        var list;
        try{
            list = JSON.parse(json);
        }catch (e){
            list = [];
        }
        this._historyList = list;
    },
    _saveHistory:function(){
        var string = JSON.stringify(this._historyList);
        localStorage.setItem("read_history" , string );
    }
});
History.Item = Class.extend({
    Id:"",
    Name:"",
    Url:"",
    dec:"",
    ctor:function(){
        this._super();
    },
    init:function(id , name ,url, dec){
        this.Id = id;this.Name = name;this.dec = dec;this.Url = url;
    },
    Tag:function(){
        var title = this.Name;
        var Name = '<a id="'+ this.Id + '"_dec' + ' href="#">' + title + '</a>';
        var li = '<li id=id="'+ this.Id + '">' + Name + '</li>';
        return li;
    }
});
History.HISTORY = new History();
History.ShowPage = function(){
    for(var i in History.HISTORY._historyList){
        var obj = History.HISTORY._historyList[i];
        var id = "item"+(new Date().getTime()).toString();
        var item = new History.Item();item.init(id , obj.Name ,obj.Url ,obj.dec);
        $("#List").append(item.Tag());
        $("#"+id).on("click", Search.SearchEngine.loadBookMessageFromItem);
        $("#"+id).attr("name", obj.Name);
        $("#"+id).attr("url", obj.Url);
        $("#"+id).attr("dec", obj.dec);
    }
    $("#List").listview("refresh");
    if (History.HISTORY._historyList.length != 0){
        $("#ListContainer").show();
        $("#KeywordSearch").hide();
    }
}