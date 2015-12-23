# churros <sub><sup>| Cloud Elements API testing framework </sup></sub>
--------------------------------------------------------------------------------
[![branching](http://img.shields.io/badge/branching-github%20flow-blue.svg)](https://guides.github.com/introduction/flow/)



## setup
If you don't have `node` and `npm` installed, do [that](https://docs.npmjs.com/getting-started/installing-node) first.

Then, clone this repository and run (may have to `sudo` the global installs depending on your environment):

```bash
$ npm install
$ npm install --global phantomjs
$ npm install --global mocha
$ npm install --global gulp
```

## running
To run against your local machine as the `system` user:

Run a single suite's tests:
```bash
$ mocha cli/src/churros.js --suite notifications
```

Run a single test in a given suite:
```bash
$ mocha cli/src/churros.js --suite formulas --grep "should allow cruding a simple formula"
```

Run an element's tests:
```bash
$ mocha cli/src/churros.js --suite elements/box --timeout 10000
```

Run a single test for an element:
```bash
$ mocha cli/src/churros.js --suite elements/box --timeout 10000 --grep "should throw a 404 when trying to find an invalid file"
```

You can also leverage some of the other command-line arguments to run as a different user, run against another environment, etc.  To see these options, run:
```bash
$ mocha cli/src/churros.js --help
```

## contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)
