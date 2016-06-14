(function () {
  'use strict';

  angular
    .module('pomodoros')
    .controller('PomodorosListController', PomodorosListController);

  PomodorosListController.$inject = ['PomodorosService'];

  function PomodorosListController(PomodorosService) {
    var vm = this;

    vm.pomodoros = PomodorosService.query();
  }
})();
