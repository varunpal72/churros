'use strict';

const util = require('util');
const chakram = require('chakram');
const webdriver = require('selenium-webdriver');
const url = require('url');
const props = require('core/util/properties').prop;
const boxProps = require('core/util/properties').prop.box;

var exports = module.exports = {};

exports.create = function () {
  const apiKey = boxProps['oauth.api.key'];
  const apiSecret = boxProps['oauth.api.secret'];
  const callbackUrl = boxProps['oauth.callback.url'];
  const username = boxProps['username'];
  const password = boxProps['password'];

  const options = {
    qs: {
      apiKey: apiKey,
      apiSecret: apiSecret,
      callbackUrl: callbackUrl
    }
  };

  var driver = new webdriver.Builder()
    .forBrowser('phantomjs')
    .build();

  return chakram.get('/elements/box/oauth/url', options)
    .then((r) => {
      driver.get(r.body.oauthUrl);
      driver.findElement(webdriver.By.name('login')).sendKeys(username);
      driver.findElement(webdriver.By.name('password')).sendKeys(password);
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
        baseUrl: props['url'] + '/elements/api-v2',
        headers: {
          Authorization: util.format('User %s, Organization %s, Element %s', props['user.secret'], props['org.secret'], r.body.token)
        }
      });
      console.log('Created box element instance with ID: ' + r.body.id);
      driver.close();
      return r;
    })
    .catch((r) => {
      console.log('Failed to create an instance of box: ' + r);
      driver.close();
      process.exit(1);
    });
};
