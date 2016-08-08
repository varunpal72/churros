#!/usr/bin/env bash

# hmm....
git config user.name jjwyse
git config user.email josh@cloud-elements.com

git branch -D gh-pages
git push origin :gh-pages
git checkout -b gh-pages
npm run docs
git add docs
git commit -am 'New docs release'
git subtree push --prefix docs origin gh-pages
