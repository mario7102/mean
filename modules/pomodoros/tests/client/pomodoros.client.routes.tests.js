(function () {
  'use strict';

  describe('Pomodoros Route Tests', function () {
    // Initialize global variables
    var $scope,
      PomodorosService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PomodorosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PomodorosService = _PomodorosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('pomodoros');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/pomodoros');
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
          PomodorosController,
          mockPomodoro;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('pomodoros.view');
          $templateCache.put('modules/pomodoros/client/views/view-pomodoro.client.view.html', '');

          // create mock Pomodoro
          mockPomodoro = new PomodorosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Pomodoro Name'
          });

          //Initialize Controller
          PomodorosController = $controller('PomodorosController as vm', {
            $scope: $scope,
            pomodoroResolve: mockPomodoro
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:pomodoroId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.pomodoroResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            pomodoroId: 1
          })).toEqual('/pomodoros/1');
        }));

        it('should attach an Pomodoro to the controller scope', function () {
          expect($scope.vm.pomodoro._id).toBe(mockPomodoro._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/pomodoros/client/views/view-pomodoro.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PomodorosController,
          mockPomodoro;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('pomodoros.create');
          $templateCache.put('modules/pomodoros/client/views/form-pomodoro.client.view.html', '');

          // create mock Pomodoro
          mockPomodoro = new PomodorosService();

          //Initialize Controller
          PomodorosController = $controller('PomodorosController as vm', {
            $scope: $scope,
            pomodoroResolve: mockPomodoro
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.pomodoroResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/pomodoros/create');
        }));

        it('should attach an Pomodoro to the controller scope', function () {
          expect($scope.vm.pomodoro._id).toBe(mockPomodoro._id);
          expect($scope.vm.pomodoro._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/pomodoros/client/views/form-pomodoro.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PomodorosController,
          mockPomodoro;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('pomodoros.edit');
          $templateCache.put('modules/pomodoros/client/views/form-pomodoro.client.view.html', '');

          // create mock Pomodoro
          mockPomodoro = new PomodorosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Pomodoro Name'
          });

          //Initialize Controller
          PomodorosController = $controller('PomodorosController as vm', {
            $scope: $scope,
            pomodoroResolve: mockPomodoro
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:pomodoroId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.pomodoroResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            pomodoroId: 1
          })).toEqual('/pomodoros/1/edit');
        }));

        it('should attach an Pomodoro to the controller scope', function () {
          expect($scope.vm.pomodoro._id).toBe(mockPomodoro._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/pomodoros/client/views/form-pomodoro.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
