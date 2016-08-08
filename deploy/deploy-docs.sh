#!/usr/bin/env bash

git co gh-pages
git pull origin gh-pages
rm -rf docs
npm run docs
git subtree push --prefix docs origin gh-pages
