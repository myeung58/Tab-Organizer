angular.module('app').service('TabService', function ($q) {
  _this = this;
  this.tabs = [];

  this.saveOpenedTabs = function() {
    // save to chrome storage

  };

  this.loadSavedTabs = function() {
    // load from chrome storage
  };

  this.byDateTime = function() {
    // sort tabs based on criteria
    // loop through tabs, move them around with new index passed in
  };

  this.resetTabs = function() {
    this.tabs = [];
  };
});
