//Pomodoros service used to communicate Pomodoros REST endpoints
(function () {
  'use strict';

  angular
    .module('pomodoros')
    .factory('PomodorosService', PomodorosService);

  PomodorosService.$inject = ['$resource'];

  function PomodorosService($resource) {
    return $resource('api/pomodoros/:pomodoroId', {
      pomodoroId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
