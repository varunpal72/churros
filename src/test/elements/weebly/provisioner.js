'use strict';
const webdriver = require('selenium-webdriver');
const cloud = require('core/cloud');
const props = require('core/props');
const defaults = require('core/defaults');
const b = props.get('browser');
const urlParser = require('url');

var exports = module.exports = {};

exports.create = (config) => {
    const browser = new webdriver.Builder()
      .forBrowser(b)
      .build();

  return browser.get(config.ec['login.url'])
    .then(() => {return browser.findElement(webdriver.By.name('user'));})
    .then(e => {
      e.sendKeys(config.ec.username);
      return browser.findElement(webdriver.By.name('pass'));
    })
    .then(e => {
      e.sendKeys(config.ec.password);
      return browser.findElement(webdriver.By.className('login-btn submit-btn'));
    })
    .then(e => {e.click();})
    .then(() => {
      return browser.wait(webdriver.until.elementLocated(webdriver.By.className('app-title')), 5000);
    })
    .then(() => {
      return browser.get(config.ec['app.install.url'])
      .then(() => {
        return browser.wait(webdriver.until.elementLocated(webdriver.By.className('topbar__action topbar__forward  ')), 3000);
      })
      .then(() => {return browser.findElement(webdriver.By.className('topbar__action topbar__forward  '));})
      .then(e => {e.click();})
      .then(() => {
        return browser.wait(webdriver.until.elementLocated(webdriver.By.className('menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children no-mega-menu')), 5000);
      })
      .then(() => {return browser.getCurrentUrl();})
      .thenCatch(e => {return browser.getCurrentUrl();});
    })
    .then((e) => {
      // parse the authorization_code out of user_login
      const query = urlParser.parse(e, true).query;
      const body = {
        name: config.name,
        element: {
          key:'weebly'
        },
        configuration:{
          'oauth.api.key':config.ec['client.id'],
          'oauth.api.secret': config.ec['client.secret'],
          'site.id': config.ec['site.id']
        },
        providerData: {
          code: query.authorization_code
        }
      };
      return cloud.post(`/instances`, body)
      .then(r => {
        defaults.token(r.body.token);
        return r;
      });
    });

  };
