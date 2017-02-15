'use strict';

describe('Groceries E2E Tests:', function () {
  describe('Test Groceries page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/groceries');
      expect(element.all(by.repeater('grocery in groceries')).count()).toEqual(0);
    });
  });
});
