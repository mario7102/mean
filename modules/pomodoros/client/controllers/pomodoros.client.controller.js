(function () {
  'use strict';

  // Pomodoros controller
  angular
    .module('pomodoros')
    .controller('PomodorosController', PomodorosController);

  PomodorosController.$inject = ['$scope', '$state', 'Authentication', 'pomodoroResolve'];

  function PomodorosController ($scope, $state, Authentication, pomodoro) {
    var vm = this;

    vm.authentication = Authentication;
    vm.pomodoro = pomodoro;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Pomodoro
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.pomodoro.$remove($state.go('pomodoros.list'));
      }
    }

    // Save Pomodoro
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.pomodoroForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.pomodoro._id) {
        vm.pomodoro.$update(successCallback, errorCallback);
      } else {
        vm.pomodoro.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('pomodoros.view', {
          pomodoroId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
