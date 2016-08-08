#!/usr/bin/env bash

npm run docs
git commit -am 'New docs release'
git push origin :gh-pages
git subtree push --prefix docs origin gh-pages
