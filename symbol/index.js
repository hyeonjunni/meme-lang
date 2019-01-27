const Builtin = require('../builtin')
const Module = require('../module')
const VarSymbol = require('./var')
const ScopeSymbols = require('./scopesymbols')
const FunctionSymbol = require('./function')

module.exports = class SymbolTableInterpreter {
  constructor () {
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
    this.currentState = new ScopeSymbols('global', 1, this.currentState)
    this.visit(node.block)
    this.currentState = this.currentState.enclosingScope
  }

  visitBinOp (node) {
    let result
    if (node.op.type === '+') {
      result = this.visit(node.left).value + this.visit(node.right).value
    } else if (node.op.type === '-') {
      result = this.visit(node.left).value - this.visit(node.right).value
    } else if (node.op.type === '*') {
      result = this.visit(node.left).value * this.visit(node.right).value
    } else if (node.op.type === '/') {
      result = this.visit(node.left).value / this.visit(node.right).value
    }

    if (typeof result === 'number') {
      return Builtin.convert(result)
    } else if (typeof result === 'boolean') {
      return Builtin.convert(result)
    } else if (typeof result === 'string') {
      return Builtin.convert(result)
    }
  }

  visitNumber (node) {
    return Builtin.convert(node.value)
  }

  visitString (node) {
    return Builtin.convert(node.value)
  }

  visitArray (node) {
    let values = []
    node.values.forEach(x => {
      values.push(this.visit(x))
    })
    return Builtin.convert(values)
  }

  visitBoolean (node) {
    return Builtin.convert(node.value)
  }

  visitDict (node) {
    let value = {}
    node.values.forEach(x => {
      value[this.visit(x.left).value] = this.visit(x.right).value
    })
    return Builtin.convert(value)
  }

  visitUnaryOp (node) {
    let op = node.op.type
    if (op === '+') {
      return Builtin.convert(+(this.visit(node.expr).value))
    } else if (op === '-') {
      return Builtin.convert(-(this.visit(node.expr).value))
    }
  }

  visitBoolOp (node) {
    let left = this.visit(node.left)
    let op = node.op.type
    let right = this.visit(node.right)
    if (op === '==') {
      return Builtin.convert(left.value === right.value)
    } else if (op === '!=') {
      return Builtin.convert(left.value !== right.value)
    } else if (op === '>') {
      return Builtin.convert(left.value > right.value)
    } else if (op === '<') {
      return Builtin.convert(left.value < right.value)
    } else if (op === '>=') {
      return Builtin.convert(left.value >= right.value)
    } else if (op === '<=') {
      return Builtin.convert(left.value <= right.value)
    } else if (op === '||') {
      return Builtin.convert(left.value || right.value)
    } else if (op === '&&') {
      return Builtin.convert(left.value && right.value)
    }
  }

  visitIf (node) {
    let when = this.visit(node.check)
    let then = node.then
    let Else = node.else
    if (when) {
      this.currentState = new ScopeSymbols('IF', this.currentState.level + 1, this.currentState)
      this.visit(then)
      this.currentState = this.currentState.enclosingScope
    } else {
      if (Else) {
        this.currentState = new ScopeSymbols('ELSE', this.currentState.level + 1, this.currentState)
        this.visit(Else)
        this.currentState = this.currentState.enclosingScope
      }
    }
  }

  visitImport (node) {
    if (typeof Module[node.moduleName] === 'undefined') {
      throw new Error(`Module ${node.moduleName} not found.`)
    }
    this.currentState.unsafeDefine(new VarSymbol(node.moduleName, ':=', Module[node.moduleName]))
  }

  visitCompound (node) {
    node.children.forEach(child => {
      this.visit(child)
    })
  }

  visitNoOp (node) {
  }

  visitFor (node) {
    this.currentState = new ScopeSymbols('FOR', this.currentState.level + 1, this.currentState)
    let asss = this.visit(node.check[0])
    if (typeof asss !== 'undefined') {
      let varSymbol = new VarSymbol(node.check[0].value, undefined, (typeof asss.varValue !== 'undefined') ? asss.varValue : asss)
      this.currentState.define(varSymbol)
    }
    while (this.visit(node.check[1]).value) {
      this.visit(node.run)
      this.visit(node.check[2])
    }
    this.currentState = this.currentState.enclosingScope
  }

  visitWhile (node) {
    this.currentState = new ScopeSymbols('WHILE', this.currentState.level + 1, this.currentState)
    while (this.visit(node.whil).value) {
      this.visit(node.run)
    }
    this.currentState = this.currentState.enclosingScope
  }

  visitTimes (node) {
    this.currentState = new ScopeSymbols('TIMES', this.currentState.level + 1, this.currentState)
    this.currentState.unsafeDefine(new VarSymbol(node.id.value, undefined, 0))
    while (this.visit(node.times).value > this.currentState.lookup(node.id.value).value) {
      this.visit(node.run)
      this.currentState.unsafeDefine(new VarSymbol(node.id.value, undefined, this.currentState.lookup(node.id.value).value + 1))
    }
    this.currentState = this.currentState.enclosingScope
  }

  visitDot (node) {
    let left = this.visit(node.left)
    if (typeof left.varValue !== 'undefined') {
      left = left.varValue
    }
    let right = node.right
    if (!(right.value in left) && !(right.funcName in left) && (right.left ? !(right.left.value in left) : true)) {
      throw new Error(`${right.funcName || right.value || right.left.value} not found in type ${left}.`)
    } else {
      if (right.name === 'Call') {
        return left[right.funcName](right.vars, this)
      } else if (right.name === 'Var') {
        return left[right.value]
      } else if (right.name === 'Assign') {
        left[right.left.value] = this.visit(right.right)
      } else if (right.name === 'VarGet') {
        return (left[right.value]).value[this.visit(right.get)]
      }
    }
  }

  visitVarGet (node) {
    let varName = node.varName
    let varSymbol = this.currentState.lookup(varName) || Builtin[varName]
    if (typeof varSymbol === 'undefined') {
      throw new Error(`Variable ${varName} not found.`)
    }
    return Builtin.convert(varSymbol.value[this.visit(node.get).value])
  }

  visitNormalGet (node) {
    return Builtin.convert(this.visit(node.from).value[this.visit(node.get).value])
  }

  visitVarSet (node) {
    let varName = node.varName
    let varSymbol = this.currentState.lookup(varName) || Builtin[varName]
    if (typeof varSymbol === 'undefined') {
      throw new Error(`Variable ${varName} not found.`)
    }
    varSymbol.value[this.visit(node.token.get).value] = this.visit(node.set).value
  }

  visitNormalSet (node) {
    this.visit(node.from.from).value[this.visit(node.from.get).value] = this.visit(node.set).value
  }

  visitCall (node) {
    let name = node.funcName
    let symbol = this.currentState.lookup(name) || Builtin[name]
    if (typeof symbol === 'undefined') {
      throw new Error(`Variable ${name} not found.`)
    }
    if (typeof symbol.varValue !== 'undefined') {
      symbol.varValue(node.vars, this)
    } else {
      symbol(node.vars, this)
    }
  }

  visitAssign (node) {
    let varName = node.left.value
    let varSymbol = new VarSymbol(varName, node.token.type, this.visit(node.right))
    this.currentState.define(varSymbol)
  }

  visitVar (node) {
    let varName = node.value
    let varSymbol = this.currentState.lookup(varName) || Builtin[varName]
    if (typeof varSymbol === 'undefined') {
      throw new Error(`Variable ${varName} not found.`)
    }
    return varSymbol
  }

  visitFunction (node) {
    const a = (args, _) => {
      let name = node.funcName
      let symbol = new FunctionSymbol(name)
      this.currentState = new ScopeSymbols(name, this.currentState.level + 1, this.currentState)
      node.vars.forEach((v, i) => {
        let name = v.value
        let as = this.visit(args[i])
        let varSymbol = new VarSymbol(name, undefined, (typeof as.varValue !== 'undefined') ? as.varValue : as)
        this.currentState.unsafeDefine(varSymbol)
        symbol.params.push(varSymbol)
      })
      this.visit(node.block)
      this.currentState = this.currentState.enclosingScope
    }
    return a
  }
}
