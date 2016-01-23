angular.module('app').controller('tabController', function ($scope, TabService) {

  chrome.windows.getCurrent({}, function(window) {
    TabService.init(window.id);
  });

  $scope.saveOpenedTabs = function() {
    TabService.saveOpenedTabs();
  };

  $scope.openSavedTabs = function() {
    TabService.openSavedTabs();
  };

  $scope.sortBy = function(param) {
    TabService.sortBy(param);
  };
});