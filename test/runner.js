var program = require('commander');
var base = require('./base');

program
  .version('0.0.1')
  .option('-s, --suite [suite]', 'Suite name', '')
  .parse(process.argv);

base.start(program.suite);
