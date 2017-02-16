(function () {
  'use strict';

  angular
    .module('recipes')
    .controller('RecipesListController', RecipesListController);

  RecipesListController.$inject = ['RecipesService', '$window'];

  function RecipesListController(RecipesService, $window) {
    var vm = this;
    vm.user = $window.user;
    vm.recipes = RecipesService.query();
  }
}());
