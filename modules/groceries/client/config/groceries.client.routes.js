(function () {
  'use strict';

  angular
    .module('groceries')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('groceries', {
        abstract: true,
        url: '/groceries',
        template: '<ui-view/>'
      })
      .state('groceries.list', {
        url: '',
        templateUrl: 'modules/groceries/client/views/list-groceries.client.view.html',
        controller: 'GroceriesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Groceries List'
        }
      })
      .state('groceries.create', {
        url: '/create',
        templateUrl: 'modules/groceries/client/views/form-grocery.client.view.html',
        controller: 'GroceriesController',
        controllerAs: 'vm',
        resolve: {
          groceryResolve: newGrocery
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Groceries Create'
        }
      })
      .state('groceries.edit', {
        url: '/:groceryId/edit',
        templateUrl: 'modules/groceries/client/views/form-grocery.client.view.html',
        controller: 'GroceriesController',
        controllerAs: 'vm',
        resolve: {
          groceryResolve: getGrocery
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Grocery {{ groceryResolve.name }}'
        }
      })
      .state('groceries.view', {
        url: '/:groceryId',
        templateUrl: 'modules/groceries/client/views/view-grocery.client.view.html',
        controller: 'GroceriesController',
        controllerAs: 'vm',
        resolve: {
          groceryResolve: getGrocery
        },
        data: {
          pageTitle: 'Grocery {{ groceryResolve.name }}'
        }
      });
  }

  getGrocery.$inject = ['$stateParams', 'GroceriesService'];

  function getGrocery($stateParams, GroceriesService) {
    return GroceriesService.get({
      groceryId: $stateParams.groceryId
    }).$promise;
  }

  newGrocery.$inject = ['GroceriesService'];

  function newGrocery(GroceriesService) {
    return new GroceriesService();
  }
}());
