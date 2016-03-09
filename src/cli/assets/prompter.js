'use strict';

const inquirer = require('inquirer');

var exports = module.exports = {};

/**
 * Builds a question for inquirer to use
 * @param  {string}   name      the name of the question
 * @param  {string}   type      the type of question (input, confirm, list, rawlist, password)
 * @param  {string}   message   the message to show to the user
 * @param  {function} validate  the validation function
 * @param  {boolean}  isDefault is default (i forget what this does ...)
 * @return {array}               an object that the inquirer can use to prompt the user
 */
exports.buildQuestion = (name, type, message, validate, isDefault) => ({
  name: name,
  type: type,
  message: message,
  validate: validate,
  default: isDefault
});

/**
 * Using the inquirer module, takes the list of questions and prompts the user for each one
 * @param  {array} questions The list of questions to prompt the user
 * @return {Promise}           A promise that when resolved, will have all the answers to each question
 */
exports.askQuestions = (questions) => new Promise((res, rej) => inquirer.prompt(questions, (answers) => res(answers)));
