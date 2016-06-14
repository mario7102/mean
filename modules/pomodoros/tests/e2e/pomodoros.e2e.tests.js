'use strict';

describe('Pomodoros E2E Tests:', function () {
  describe('Test Pomodoros page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/pomodoros');
      expect(element.all(by.repeater('pomodoro in pomodoros')).count()).toEqual(0);
    });
  });
});
