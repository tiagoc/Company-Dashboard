/// <reference path="../../Angular/angular.js" />
var KltAdmin = angular.module('KltAdmin', ['ui.bootstrap']);

KltAdmin.directive("focus", function () {
    return function (scope, element, attrs) {
        element.bind("mouseenter", function () {
            element.addClass("focus");
            scope.$apply(attrs.focus);
        });
        element.bind("mouseleave", function () {
            element.removeClass("focus");
        });
    }
});
