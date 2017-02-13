(function () {
  'use strict';

  angular
    .module('recipes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Recipes',
      state: 'recipes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'recipes', {
      title: 'List Recipes',
      state: 'recipes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'recipes', {
      title: 'Create Recipe',
      state: 'recipes.create',
      roles: ['user']
    });
  }
}());
