const Symbols = require('./symbols')
const VarSymbol = require('./var')
const ScopeSymbols = require('./scopesymbols')
const FunctionSymbol = require('./function')

module.exports = class SymbolTableBuilder {
  constructor () {
    this.symtdb = new Symbols()
    this.currentState = undefined
  }

  visit (node) {
    if (typeof (this[`visit${node.name}`]) !== 'undefined') {
      return this[`visit${node.name}`](node)
    } else {
      throw new Error(`visiter visit${node.name} is not found.`)
    }
  }

  visitProgram (node) {
    console.log('ENTER scope: global')
    this.currentState = new ScopeSymbols('global', 1, this.currentState)
    this.visit(node.block)
    console.log(this.currentState.toString())
    this.currentState = this.currentState.enclosingScope
    console.log('LEAVE scope: global')
  }

  visitBinOp (node) {
    this.visit(node.left)
    this.visit(node.right)
  }

  visitNumber (node) {
  }

  visitString (node) {
  }

  visitBoolean (node) {
  }

  visitUnaryOp (node) {
    this.visit(node.expr)
  }

  visitCompound (node) {
    node.children.forEach(child => {
      this.visit(child)
    })
  }

  visitNoOp (node) {
  }

  visitAssign (node) {
    let varName = node.left.value
    let varSymbol = new VarSymbol(varName)
    this.currentState.define(varSymbol)
    this.visit(node.right)
  }

  visitVar (node) {
    let varName = node.value
    let varSymbol = this.currentState.lookup(varName)
    if (typeof varSymbol === 'undefined') {
      throw new Error(`Variable ${varName} not found.`)
    }
  }

  visitFunction (node) {
    let name = node.funcName
    let symbol = new FunctionSymbol(name)
    this.currentState.define(symbol)
    console.log(`ENTER scope: ${name}`)
    this.currentState = new ScopeSymbols(name, this.currentState.level + 1, this.currentState)

    node.vars.forEach(v => {
      let name = v.value
      let varSymbol = new VarSymbol(name)
      this.currentState.define(varSymbol)
      symbol.params.push(varSymbol)
    })
    this.visit(node.block)
    console.log(this.currentState.toString())
    this.currentState = this.currentState.enclosingScope
    console.log(`LEAVE scope: ${name}`)
  }
}
