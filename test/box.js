'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const webdriver = require('selenium-webdriver');
const url = require('url');

describe('box apis', () => {
  before((done) => {
    // const browser = new Browser();
    //const apiKey = '52v6ewrxiwxz5fnyzqlu4m5tl73p5i16';
    //const apiSecret = '2DxBFKLon7NSocJLpqFyeU3CBRKmGtmn';
    //const callbackUrl = 'https://P3yGfbuTJYfRMCneIJflFnRPX0FjDj.com';

    const apiKey = 's1bpue2luhqmv8cbrak2slr1g2xgdhkn';
    const apiSecret = '3f1NnMdrdjaYxghrQodcqpkbNHGNXI7u';
    const callbackUrl = 'https://httpbin.org/get';

    const options = {
      qs: {
        apiKey: apiKey,
        apiSecret: apiSecret,
        callbackUrl: callbackUrl
      }
    };

    var driver = new webdriver.Builder()
                              .forBrowser('phantomjs')
                              .build()

    chakram.get('/elements/box/oauth/url', options)
      .then((r) => {
        driver.get(r.body.oauthUrl);
        driver.findElement(webdriver.By.name('login')).sendKeys('box@cloud-elements.com');
        driver.findElement(webdriver.By.name('password')).sendKeys('Cloud3l3m3nts!');
        driver.findElement(webdriver.By.name('login_submit')).click();
        driver.findElement(webdriver.By.name('consent_accept')).click();
        return driver.getCurrentUrl();
      })
      .then((r) => {
        const query = url.parse(r, true).query;
        const instance = {
          name: 'churros-box-instance',
          element: {
            key: 'box'
          },
          configuration: {
            'oauth.api.key': apiKey,
            'oauth.api.secret': apiSecret,
            'oauth.callback.url': callbackUrl
          },
          providerData: {
            code: query.code
          }
        };
        return chakram.post('/instances', instance);
      })
      .then((r) => {
        chakram.setRequestDefaults({
          baseUrl: process.env.CHURROS_BASE_URL + '/elements/api-v2',
          headers: {
            Authorization: util.format('User %s, Organization %s, Element %s', process.env.CHURROS_USER_SECRET, process.env.CHURROS_ORG_SECRET, r.body.token)
          }
        });
        driver.close();
        done();
      })
      .catch((r) => {
        console.log('Error wile trying to OAuth into box: ' + r);
        driver.close();
        done();
      });
  });

  it('should allow listing folder contents', () => {
    var uri = '/hubs/documents/folders/contents';
    return chakram.get(uri + '?path=/').then((r) => {
      expect(r).to.have.status(200);
    });
  });
});
