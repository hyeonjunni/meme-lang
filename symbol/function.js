const Base = require('./base')
const uuid = require('uuid/v4')

module.exports = class FunctionSymbol extends Base {
  constructor (params = []) {
    super(uuid())
    this.params = params
  }

  toString () {
    return this.name
  }
}
