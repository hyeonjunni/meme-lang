const Base = require('./base')

module.exports = class FunctionSymbol extends Base {
  constructor (params = []) {
    super('')
    this.params = params
  }

  toString () {
    return this.name
  }
}
