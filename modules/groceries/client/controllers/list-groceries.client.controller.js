(function () {
  'use strict';

  angular
    .module('groceries')
    .controller('GroceriesListController', GroceriesListController);

  GroceriesListController.$inject = ['GroceriesService'];

  function GroceriesListController(GroceriesService) {
    var vm = this;

    vm.groceries = GroceriesService.query();
  }
}());
