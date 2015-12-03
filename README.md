# churros <sub><sup>| Cloud Elements API testing framework </sup></sub>
--------------------------------------------------------------------------------
[![branching](http://img.shields.io/badge/branching-github%20flow-blue.svg)](https://guides.github.com/introduction/flow/)



## setup
If you don't have `node` and `npm` installed, do that first.

Then, clone this repository and run:

```bash
$ npm install
$ npm install --global phantomjs
```

## running
To run against your local machine as the `system` user, you can simply run:

```bash
$ mocha src/churros.js --suite notifications
```

You can also leverage some of the other command-line arguments to run as a different user, run against another environment, etc.  To see these options, run:
```bash
$ mocha src/churros.js --help
```

## contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)
