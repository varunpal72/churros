'use strict';

const documents = require('../assets/documents');
const dropbox = require('../dropboxv2/search.js');
documents.files();
documents.folders();
documents.storage();
dropbox.search();
