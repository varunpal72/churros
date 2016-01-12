# churros <sub><sup>| Cloud Elements API testing framework </sup></sub>
--------------------------------------------------------------------------------
[![version](http://img.shields.io/badge/version-v0.0.0-blue.svg)](#)
[![versioning](http://img.shields.io/badge/versioning-semver-blue.svg)](http://semver.org/)
[![branching](http://img.shields.io/badge/branching-github%20flow-blue.svg)](https://guides.github.com/introduction/flow/)
[![Circle CI](https://circleci.com/gh/cloud-elements/churros.svg?style=shield&circle-token=06ba43ddb954fcb3687b5e41fbdf607f1846bbc0)](https://circleci.com/gh/cloud-elements/churros)

## setup
If you don't have `node` and `npm` installed, do [that](https://docs.npmjs.com/getting-started/installing-node) first.

```bash
$ npm install
$ npm install --global phantomjs
$ sudo npm link
```
> Note: May have to `sudo` the global installs depending on your environment

```bash
$ churros init
```

Follow the given prompts where you will be guided through setting the default values that will be used when running tests

## running

```bash
$ churros test formulas
$ churros test formulas --file formulas.triggers
$ churros test formulas --file formulas.triggers --file formulas.instances
$ churros test formulas --file formulas.triggers --file formulas.instances --test \`should not allow\`
```
> Note: Passing a `--user`, `--password` and/or `--url` to `churros test [suite]` overrides the default value setup during `churros init`

## Changelog

See [CHANGELOG.md](CHANGELOG.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

See [LICENSE.md](LICENSE.md)
