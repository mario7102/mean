(function () {
  'use strict';

  angular
    .module('pomodoros')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Pomodoros',
      state: 'pomodoros',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'pomodoros', {
      title: 'List Pomodoros',
      state: 'pomodoros.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'pomodoros', {
      title: 'Create Pomodoro',
      state: 'pomodoros.create',
      roles: ['user']
    });
  }
})();
