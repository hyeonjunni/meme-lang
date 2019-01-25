const Numberr = require('./number')
const Booleann = require('./boolean')

module.exports = class Stringg {
  constructor (str) {
    this.str = this.value = str
  }

  toString () {
    return this.value
  }

  get length () {
    return new Numberr(this.str.length)
  }

  standsFor (str, visit) {
    return new Booleann((visit.visit(str[0]).value).startsWith(this.str))
  }
}
