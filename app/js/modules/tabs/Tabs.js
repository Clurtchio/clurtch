(function() {
  angular.module('app.modules.tabs', [
    'app.modules.tabs.items',
    'app.modules.tabs.menus',
    'app.modules.tabs.review',
    'app.modules.tabs.list',
    'app.modules.tabs.settings'
  ])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state("tab", {
      url: "/tab",
      abstract: true,
      templateUrl: "js/modules/tabs/tabs.html"
    });

    // $urlRouterProvider.otherwise('/tab/items');
  });

}).call(this);
