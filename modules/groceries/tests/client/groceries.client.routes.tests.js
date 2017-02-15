(function () {
  'use strict';

  describe('Groceries Route Tests', function () {
    // Initialize global variables
    var $scope,
      GroceriesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _GroceriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      GroceriesService = _GroceriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('groceries');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/groceries');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          GroceriesController,
          mockGrocery;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('groceries.view');
          $templateCache.put('modules/groceries/client/views/view-grocery.client.view.html', '');

          // create mock Grocery
          mockGrocery = new GroceriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Grocery Name'
          });

          // Initialize Controller
          GroceriesController = $controller('GroceriesController as vm', {
            $scope: $scope,
            groceryResolve: mockGrocery
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:groceryId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.groceryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            groceryId: 1
          })).toEqual('/groceries/1');
        }));

        it('should attach an Grocery to the controller scope', function () {
          expect($scope.vm.grocery._id).toBe(mockGrocery._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/groceries/client/views/view-grocery.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          GroceriesController,
          mockGrocery;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('groceries.create');
          $templateCache.put('modules/groceries/client/views/form-grocery.client.view.html', '');

          // create mock Grocery
          mockGrocery = new GroceriesService();

          // Initialize Controller
          GroceriesController = $controller('GroceriesController as vm', {
            $scope: $scope,
            groceryResolve: mockGrocery
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.groceryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/groceries/create');
        }));

        it('should attach an Grocery to the controller scope', function () {
          expect($scope.vm.grocery._id).toBe(mockGrocery._id);
          expect($scope.vm.grocery._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/groceries/client/views/form-grocery.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          GroceriesController,
          mockGrocery;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('groceries.edit');
          $templateCache.put('modules/groceries/client/views/form-grocery.client.view.html', '');

          // create mock Grocery
          mockGrocery = new GroceriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Grocery Name'
          });

          // Initialize Controller
          GroceriesController = $controller('GroceriesController as vm', {
            $scope: $scope,
            groceryResolve: mockGrocery
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:groceryId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.groceryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            groceryId: 1
          })).toEqual('/groceries/1/edit');
        }));

        it('should attach an Grocery to the controller scope', function () {
          expect($scope.vm.grocery._id).toBe(mockGrocery._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/groceries/client/views/form-grocery.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
