const Base = require('./base')

module.exports = class BuiltinTypeSymbol extends Base {
  toString () {
    return this.name
  }
}