(function () {
  'use strict';

  angular
    .module('groceries')
    .controller('GroceriesListController', GroceriesListController);

  GroceriesListController.$inject = ['GroceriesService', '$window'];

  function GroceriesListController(GroceriesService, $window) {
    var vm = this;
    vm.user = $window.user;
    vm.groceries = GroceriesService.query();
  }
}());
