'use strict';

const webdriver = require('selenium-webdriver');

const manipulateDom = (element, driver, r, username, password) => {
  switch (element) {
  case 'desk':
    driver.get(r.body.oauthUrl);
    driver.findElement(webdriver.By.id('user_session_email')).sendKeys(username);
    driver.findElement(webdriver.By.id('user_session_password')).sendKeys(password);
    driver.findElement(webdriver.By.id('user_session_submit')).click();
    driver.findElement(webdriver.By.name('commit')).click();
    return driver.getCurrentUrl();
  case 'sfdc':
  case 'sfdcservicecloud':
  case 'sfdcmarketingcloud':
  case 'sfdcdocuments':
    driver.get(r.body.oauthUrl);
    driver.findElement(webdriver.By.id("username")).clear();
    driver.findElement(webdriver.By.id("username")).sendKeys(username);
    driver.findElement(webdriver.By.id("password")).clear();
    driver.findElement(webdriver.By.id("password")).sendKeys(password);
    driver.findElement(webdriver.By.id("Login")).click();
    driver.get(driver.getCurrentUrl()); // have to actually go to it and then it redirects you to your callback
    return driver.getCurrentUrl();
  case 'etsy':
    driver.get(r.body.oauthUrl);
    driver.findElement(webdriver.By.id('username-existing')).sendKeys(username);
    driver.findElement(webdriver.By.id('password-existing')).sendKeys(password);
    driver.findElement(webdriver.By.id('signin_button')).click();
    driver.findElement(webdriver.By.xpath('//*[@id="oauth-submit"]/span/input')).click();
    return driver.getCurrentUrl();
  case 'acton':
    driver.get(r.body.oauthUrl);
    driver.findElement(webdriver.By.id('authorizeLink')).click();
    driver.findElement(webdriver.By.id('oauth_user_name')).sendKeys(username);
    driver.findElement(webdriver.By.id('oauth_user_password')).sendKeys(password);
    driver.findElement(webdriver.By.id('loginBtn')).click();
    return driver.getCurrentUrl();
  case 'box':
    driver.get(r.body.oauthUrl);
    driver.findElement(webdriver.By.name('login')).sendKeys(username);
    driver.findElement(webdriver.By.name('password')).sendKeys(password);
    driver.findElement(webdriver.By.name('login_submit')).click();
    driver.findElement(webdriver.By.name('consent_accept')).click();
    return driver.getCurrentUrl();
  case 'facebooksocial':
    driver.get(r.body.oauthUrl);
    driver.findElement(webdriver.By.id('email')).clear();
    driver.findElement(webdriver.By.id('email')).sendKeys(username);
    driver.findElement(webdriver.By.id('pass')).clear();
    driver.findElement(webdriver.By.id('pass')).sendKeys(password);
    driver.findElement(webdriver.By.id('loginbutton')).click();
    return driver.getCurrentUrl();
  case 'instagram':
    driver.get(r.body.oauthUrl);
    driver.findElement(webdriver.By.id('id_username')).clear();
    driver.findElement(webdriver.By.id('id_username')).sendKeys(username);
    driver.findElement(webdriver.By.id('id_password')).clear();
    driver.findElement(webdriver.By.id('id_password')).sendKeys(password);
    driver.findElement(webdriver.By.className('button-green')).click();
    return driver.getCurrentUrl();
  case 'zendesk':
    driver.get(r.body.oauthUrl);
    const iframe = webdriver.By.tagName('iframe')[0];
    driver.switchTo().frame(iframe);
    driver.findElement(webdriver.By.id('user_email')).sendKeys(username);
    driver.findElement(webdriver.By.id('user_password')).sendKeys(password);
    return driver.getCurrentUrl();
  default:
    console.log('No OAuth callback found for element %s.  Please implement that callback in core/oauth so %s can be provisioned', element, element);
    process.exit(1);
  }
};

module.exports = (element, r, username, password) => {
  const driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();
  const url = manipulateDom(element, driver, r, username, password);
  driver.close();
  return url;
};
