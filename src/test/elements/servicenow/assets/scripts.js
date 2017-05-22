'use strict';

const webdriver = require('selenium-webdriver');
const props = require('core/props');
const tools = require('core/tools');

module.exports = (element, method) => {
  const b = props.get('browser');
  var wakeUpInstanceUrl = 'https://developer.servicenow.com/app.do#!/instance';
  const config = {
    password: props.getForKey(element, 'dev.password'),
    username: props.getForKey(element, 'dev.username')
  };
  const browser = new webdriver.Builder()
    .forBrowser(b)
    .build();
  switch (method) {
    case 'before':
      // Stay woke
      browser.get(wakeUpInstanceUrl);
      browser.wait(webdriver.until.elementLocated(webdriver.By.id('username')), 10000);
      browser.findElement(webdriver.By.id('username')).clear();
      browser.findElement(webdriver.By.id('username')).sendKeys(config.username);
      browser.sleep(1500);
      browser.findElement(webdriver.By.id('password')).clear();
      browser.findElement(webdriver.By.id('password')).sendKeys(config.password);
      browser.findElement(webdriver.By.id('submitButton')).click();
      browser.sleep(5000);
      browser.get(wakeUpInstanceUrl);
      browser.sleep(5000);
      return browser.wait(() => browser.isElementPresent(webdriver.By.id('instanceWakeUpBtn')), 3000)
        .then(() => {
          return browser.findElement(webdriver.By.id('instanceWakeUpBtn'))
            .then(r => r.click())
            .thenCatch(r => false)
            .then(r => {
              let nth = 0;
              //wait 10 sec, call wakeUpInstanceUrl, see if there is still an overlay
              //if exists, then rerun - else return currentUrl
              const isReloading = (nth) => {
                return browser.isElementPresent(webdriver.By.className('hib-overlay ng-scope'));
              };
              browser.get(wakeUpInstanceUrl);
              browser.sleep(5000)
              .then(() => tools.wait.upTo(1800000).for(() => {
                return new Promise(function(res, rej) {
                  nth+=1
                  isReloading(nth).then(reloading => reloading === true ? res() : rej());
                });
              }));
            })
            .then(r => browser.getCurrentUrl());
        }, () => {
          console.log('not found');
          return browser.getCurrentUrl();
        });

    default:
      return null;
  }
};
