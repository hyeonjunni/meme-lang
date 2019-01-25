const Base = require('./base')

module.exports = class VarSymbol extends Base {
  constructor (name, type = undefined, value = undefined) {
    super(name, type)
    this.varValue = value
    this.value = typeof this.varValue.value !== 'undefined' ? this.varValue.value : this.varValue
  }

  toString () {
    return `[${this.name}]`
  }
}
