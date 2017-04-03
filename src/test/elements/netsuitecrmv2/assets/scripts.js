const webdriver = require('selenium-webdriver');
const props = require('core/props');
const logger = require('winston');

module.exports = (element, method) => {
  // const config = {
  //   username: props.getForKey(element, 'username'),
  //   password: props.getForKey(element, 'password')
  // };
  const b = props.get('browser');
  const browser = new webdriver.Builder()
    .forBrowser('phantomjs')
    .build();
  switch (method) {
    case 'clearNgrok':
      browser.get('http://127.0.0.1:4040/inspect/http');
      console.log('1');
      browser.sleep(10000)
      browser.findElement(webdriver.By.xpath('//*[@id="content"]/div/div/div/div[1]/div/h4/button'))
      .then(el => el.click(), err => {})
      return browser.quit().then(url => "Cleared");
    case 'checkNgrok':
      browser.get('http://127.0.0.1:4040/inspect/http');
      browser.sleep(1000)
      console.log('2');
      var length;
      return browser.findElements(webdriver.By.css('.round-trip-select tr'))
      .then(reqs => length = reqs.length)
      .then(() => browser.quit())
      .then(() => length)
      // return browser.quit().then(url => "Random words, good work");
    default:
      return Promise.resolve(null);
  }
}
