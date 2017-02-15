(function () {
  'use strict';

  angular
    .module('groceries')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Groceries',
      state: 'groceries',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'groceries', {
      title: 'List Groceries',
      state: 'groceries.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'groceries', {
      title: 'Create Grocery',
      state: 'groceries.create',
      roles: ['user']
    });
  }
}());
