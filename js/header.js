/**
 * Created by L on 2013/10/6.
 */
var IsLoaded = false;
var init = init ||{};
jQuery.fn.center = function (parent, topShift, leftShift) {
    if (!topShift) topShift = 0;
    if (!leftShift) leftShift = 0;
    if (parent) {
        parent = this.parent();
    } else {
        parent = window;
    }
    this.css({
        "position": "absolute",
        "top": ((($(parent).height() - this.outerHeight()) / 2 + topShift) + $(parent).scrollTop() + "px"),
        "left": ((($(parent).width() - this.outerWidth()) / 2 + leftShift) + $(parent).scrollLeft() + "px")
    });
    return this;
}
jQuery.fn.down = function (parent, topShift, leftShift) {
    if (!topShift) topShift = 0;
    if (!leftShift) leftShift = 0;
    if (parent) {
        parent = this.parent();
    } else {
        parent = window;
    }
    this.css({
        "position": "fixed",
        "top": ((($(parent).height() - this.outerHeight() ) + topShift) + $(parent).scrollTop() + "px"),
        "left": ((($(parent).width() - this.outerWidth()) / 2 + leftShift) + $(parent).scrollLeft() + "px")
    });
    return this;
}
require(['class/Class'], function () {
    IsLoaded = true;

    init();
});