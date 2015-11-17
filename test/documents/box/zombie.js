const Browser = require('zombie');

describe('User visits signup page', function () {

  const browser = new Browser();

  before(function (done) {
    browser.visit('http://httpbin.org/forms/post', done);
  });

  describe('Submits form', function () {

    before(function (done) {
      browser
        .fill('custemail', 'zombie@underworld.dead')
        .fill('custname', 'Zombie')
        .pressButton('Submit order', done);
    });

    it('should be successful', function () {
      browser.assert.success();
    });
  });
});
