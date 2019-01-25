const BuiltinSymbol = require('./builtin')

module.exports = class SymbolTable {
  constructor () {
    this._symbols = {}
    this.define(new BuiltinSymbol('NUMBER'))
    this.define(new BuiltinSymbol('STRING'))
    this.define(new BuiltinSymbol('BOOLEAN'))
  }

  toString () {
    return `Symbols: [${Object.values(this._symbols).join(', ')}]`
  }

  define (symbol) {
    console.log(`define: ${symbol}`)
    this._symbols[symbol.name] = symbol
  }

  lookup (name) {
    console.log(`lookup: ${name}`)
    return this._symbols[name]
  }
}
