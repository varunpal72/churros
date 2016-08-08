#!/usr/bin/env bash

git co gh-pages
npm run docs
git subtree push --prefix docs origin gh-pages
