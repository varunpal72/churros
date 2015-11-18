'use strict';

const sleep = require('sleep');
const Browser = require('zombie');
const chakram = require('chakram');
const expect = chakram.expect;

describe('box apis', () => {
  before((done) => {
    const browser = new Browser();

    var options = {
      qs: {
        apiKey: '52v6ewrxiwxz5fnyzqlu4m5tl73p5i16',
        apiSecret: '2DxBFKLon7NSocJLpqFyeU3CBRKmGtmn',
        callbackUrl: 'https://P3yGfbuTJYfRMCneIJflFnRPX0FjDj.com'
      }
    };
    chakram.get('/elements/box/oauth/url', options)
      .then((r) => {
        var redirect = r.body.oauthUrl;
        console.log('Redirecting to: ' + redirect);
        return browser.visit(redirect);
      })
      .then((r) => {
        console.log('Populating box oauth information');
        browser.fill('login', 'box@cloud-elemenets.com');
        browser.fill('password', 'Cloud3l3m3nts!');
        return browser.pressButton('login_submit');
      })
      .then((r) => {
        sleep.sleep(5);
        console.log('Current url: ' + browser.url);
        return browser.pressButton('consent_accept_button'); // TODO - JJW - not finding this button
      })
      .then((r) => {
        sleep.sleep(5);
        console.log('Current url: ' + browser.url);
        browser.assert.success();
        done();
      })
      .catch((r) => {
        console.log('Error wile trying to OAuth into box: ' + r);
        done();
      });
  });

  it('should allow listing folder contents', () => {
    var url = '/hubs/documents/folders/contents';
    return chakram.get(url + '?path=/').then((r) => {
      expect(r).to.have.status(200);
    });
  });
});
