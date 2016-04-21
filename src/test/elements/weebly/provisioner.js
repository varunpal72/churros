'use strict';
const webdriver = require('selenium-webdriver');
const cloud = require('core/cloud');
const props = require('core/props');
const wait = (browser, ms) => browser.wait(() => false, ms);
const b = props.get('browser');
const urlParser = require('url');

var exports = module.exports = {};

exports.create = (config) => {
    const browser = new webdriver.Builder()
      .forBrowser(b)
      .build();

  return browser.get(config['login.url'])
    .then(() => {
      return browser.findElement(webdriver.By.name('user'))
    })
    .then(e => {
      e.sendKeys(config['username']);
      return browser.findElement(webdriver.By.name('pass'))
    })
    .then(e => {
      e.sendKeys(config['password']);
      return browser.findElement(webdriver.By.className('login-btn submit-btn'))
    })
    .then(e => {
      e.click();
    })
    .then(() => {
      return browser.wait(webdriver.until.elementLocated(webdriver.By.className('app-title')), 5000);
    })
    .then(() => {
      return browser.get(config['app.install.url']);
    })
    .then(() => {
      return browser.wait(webdriver.until.elementLocated(webdriver.By.className('topbar__action topbar__forward  ')), 5000);
    })
    .then(() => {
      return browser.findElement(webdriver.By.className('topbar__action topbar__forward  '))
    })
    .then(e => {
      e.click();
    })
    .then(() => {
      return browser.getCurrentUrl();
    })
    .then((e) => {
      // parse the authorization_code out of user_login
      const query = urlParser.parse(e, true).query;

console.log(query);
      const body = {
        name: 'my instance name',
        providerData: {
          code: query.authorization_code
        }
      };
      return cloud.post(`/instances`, body);
    });
    // // return browser.wait(() => {
    // //   return browser.findElement(webdriver.By.xpath('//*[@id=\'permissions\']/form/div/input[1]'))
    // //     .then(r => r.click())
    // //     .then(r => browser.getCurrentUrl())
    // //     .thenCatch(r => false);
    // // }, 7000);
    //
    // var currentURL = browser.getCurrentUrl();
    // console.log(currentURL);
    // return cloud.post('/instances', {});

  }
