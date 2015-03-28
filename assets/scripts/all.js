/**
 * @fileOverview 共通
 */

'use strict';

var Hello = require('Hello');
var Validator = require('Validator');

var hello     = new Hello();
var validator = new Validator();

document.write(hello.message);
console.log(validator.withinCharacters('withinCharacters', 3, 10));
