/**
 * Created by L on 2013/10/6.
 */
var IsLoaded = false;
var init = init ||{};
require(['class/Class'], function () {
    IsLoaded = true;
    init();
});