/**
 * Created by L on 1/5/14.
 */
var Decoder = Decoder || {} ;
Decoder = Class.extend({

    ctor:function(){
        this._super();
    },
    init:function(url){
    },
    decode:function(img){
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
            var img = new Image();
            img.src = event.target.result;
            setTimeout(function(){
                var barcode = getBarcodeFromImage(img);
                if(!barcode){
                    alert("decode fail");
                }else $("#input").val("9"+barcode);
                Search.LoadComplete();
            },500);

        };
        fileReader.readAsDataURL(img);
    }
});