const BuiltinSymbol = require('./builtin')

module.exports = class ScopedSymbolTable {
  constructor (name, level, enclosingScope = undefined) {
    this._symbols = {}
    this.name = name
    this.level = level
    this.enclosingScope = enclosingScope
    this.define(new BuiltinSymbol('NUMBER'))
    this.define(new BuiltinSymbol('STRING'))
    this.define(new BuiltinSymbol('BOOLEAN'))
  }

  define (symbol) {
    if (typeof this._symbols[symbol.name] !== 'undefined' && this._symbols[symbol.name].type === ':=') {
      throw new Error('You cannot edit const vars.')
    }
    if (typeof this.enclosingScope !== 'undefined' && typeof this.enclosingScope.lookup(symbol.name) !== 'undefined' && this.enclosingScope.lookup(symbol.name).type === ':=') {
      throw new Error('You cannot edit const vars.')
    }
    this._symbols[symbol.name] = symbol
    if (typeof this.enclosingScope !== 'undefined' && this.enclosingScope.lookup(symbol.name)) {
      this.enclosingScope.define(symbol)
    }
  }

  unsafeDefine (symbol) {
    this._symbols[symbol.name] = symbol
  }

  lookup (name) {
    if (typeof this._symbols[name] !== 'undefined') {
      return this._symbols[name]
    } else {
      if (typeof this.enclosingScope !== 'undefined') {
        return this.enclosingScope.lookup(name)
      }
    }
  }
}
