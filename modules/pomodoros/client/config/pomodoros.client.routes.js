(function () {
  'use strict';

  angular
    .module('pomodoros')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('pomodoros', {
        abstract: true,
        url: '/pomodoros',
        template: '<ui-view/>'
      })
      .state('pomodoros.list', {
        url: '',
        templateUrl: 'modules/pomodoros/client/views/list-pomodoros.client.view.html',
        controller: 'PomodorosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Pomodoros List'
        }
      })
      .state('pomodoros.create', {
        url: '/create',
        templateUrl: 'modules/pomodoros/client/views/form-pomodoro.client.view.html',
        controller: 'PomodorosController',
        controllerAs: 'vm',
        resolve: {
          pomodoroResolve: newPomodoro
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Pomodoros Create'
        }
      })
      .state('pomodoros.edit', {
        url: '/:pomodoroId/edit',
        templateUrl: 'modules/pomodoros/client/views/form-pomodoro.client.view.html',
        controller: 'PomodorosController',
        controllerAs: 'vm',
        resolve: {
          pomodoroResolve: getPomodoro
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Pomodoro {{ pomodoroResolve.name }}'
        }
      })
      .state('pomodoros.view', {
        url: '/:pomodoroId',
        templateUrl: 'modules/pomodoros/client/views/view-pomodoro.client.view.html',
        controller: 'PomodorosController',
        controllerAs: 'vm',
        resolve: {
          pomodoroResolve: getPomodoro
        },
        data:{
          pageTitle: 'Pomodoro {{ articleResolve.name }}'
        }
      });
  }

  getPomodoro.$inject = ['$stateParams', 'PomodorosService'];

  function getPomodoro($stateParams, PomodorosService) {
    return PomodorosService.get({
      pomodoroId: $stateParams.pomodoroId
    }).$promise;
  }

  newPomodoro.$inject = ['PomodorosService'];

  function newPomodoro(PomodorosService) {
    return new PomodorosService();
  }
})();
