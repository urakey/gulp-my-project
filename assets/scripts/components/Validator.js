/**
 * @class Validator
 */
function Validator() {
};
Validator.prototype = {

  isEmpty: function(val) {
    return !Boolean(val);
  },

  isNaturalNumber: function(num) {
    return num.toString().match(/^\d+$/) ? true : false ;
  },

  isEmail: function(num) {
    return email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) ? true : false ;
  },

  isDate: function(y, m, d) {
    var date = new Date(y, m, d);
    return data.toString() != 'Invalid Date' ? true : false ;
  },

  withinCharacters: function(characters, minLength, maxLength) {
    return character.length >= minLength && character.length <= maxLength ? true : false ;
  }
}
module.exports = Hello;
