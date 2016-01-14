# churros <sub><sup>| Cloud Elements API testing framework </sup></sub>

--------------------------------------------------------------------------------

[![version](http://img.shields.io/badge/version-v0.0.0-blue.svg)](#) [![versioning](http://img.shields.io/badge/versioning-semver-blue.svg)](http://semver.org/) [![branching](http://img.shields.io/badge/branching-github%20flow-blue.svg)](https://guides.github.com/introduction/flow/) [![Circle CI](https://circleci.com/gh/cloud-elements/churros.svg?style=shield&circle-token=06ba43ddb954fcb3687b5e41fbdf607f1846bbc0)](https://circleci.com/gh/cloud-elements/churros)

## Installation
If you don't have `node` and `npm` installed, do [that](https://docs.npmjs.com/getting-started/installing-node) first.

> **PROTIP:** `node` version must  be >= `v4.0.0`

Install the node dependencies and initalize churros.

```bash
# Install all necessary npm packages:
$ npm install

# Need phantomjs to be installed globally or somehow available on your $PATH:
$ npm install --global phantomjs

# Puts churros CLI on your $PATH:
$ npm link

# Initialize your churros properties file:
$ churros init
```

> **PROTIP:** May have to `sudo` the global install and `npm link` depending on your environment

## Examples

```bash
# Run the entire formulas suite:
$ churros test formulas

# Run a single file of tests in the formulas suite:
$ churros test formulas --file formulas.triggers

# Run multiple files of tests in the formulas suite:
$ churros test formulas --file formulas.triggers --file formulas.instances

# Run all tests that contain 'should not allow' in the specified files:
$ churros test formulas --file formulas.triggers --file formulas.instances --test `should not allow`
```

> **PROTIP:** Passing a `--user`, `--password` and/or `--url` to `churros test [suite]` overrides the default value that was setup during `churros init`
> **PROTIP:** The --test value will search all tests `describe(...)` and `it(...)` strings to determine which test(s) to run

## Changelog
See [CHANGELOG.md](CHANGELOG.md)

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)

## License
See [LICENSE.md](LICENSE.md)
