#!/usr/bin/env bash

git co gh-pages
git pull origin gh-pages
rm -rf docs
npm run docs
git commit -a -m 'New docs release'
git subtree push --prefix docs origin gh-pages
