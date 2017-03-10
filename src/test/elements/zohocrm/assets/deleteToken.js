'use strict';

module.exports = (method) => {
  switch (method) {
    case deleteTokens:

      break;
    default:
      break;
  }
}

// def delete_tokens(config):
//     driver = webdriver.Firefox()
//     driver.implicitly_wait(10)
//     base_url = "https://accounts.zoho.com/"
//
//     driver.get(base_url)
//     driver.switch_to_frame('zohoiam')
//
//     driver.find_element_by_id('lid').clear()
//     driver.find_element_by_id('lid').send_keys(config['user'])
//
//     pwd = driver.find_element_by_id('pwd')
//     pwd.clear()
//     pwd.send_keys(config['password'])
//     pwd.submit()
//     time.sleep(5)
//     driver.get('https://accounts.zoho.com/u/h#sessions/userauthtoken')
//
//     try:
//         driver.find_element_by_id('apitoken_check_all').click()
//
//     except NoSuchElementException:
//         print "No tokens to delete."
//         driver.quit()
//         sys.exit()
//
//     driver.find_element_by_class_name('dltalltokens').click()
//     driver.find_element_by_id('alertpopupbtn').click()
//
//     driver.quit()
