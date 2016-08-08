#!/usr/bin/env bash

git push origin :gh-pages
git co -b gh-pages
npm run docs
git commit -am 'New docs release'
git subtree push --prefix docs origin gh-pages
