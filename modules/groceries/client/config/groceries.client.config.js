(function () {
  'use strict';

  angular
    .module('groceries')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Grocery List',
      state: 'groceries',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'groceries', {
      title: 'Show Grocery Lists',
      state: 'groceries.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'groceries', {
      title: 'Create Grocery List',
      state: 'groceries.create',
      roles: ['user']
    });
  }
}());
