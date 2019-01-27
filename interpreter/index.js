module.exports = class Interpreter {
  constructor () {
    this.GLOBALVAR = {}
    this.GLOBALCONST = {}
  }

  visit (node) {
    if (typeof (this[`visit${node.name}`]) !== 'undefined') {
      return this[`visit${node.name}`](node)
    } else {
      throw new Error(`visiter visit${node.name} is not found.`)
    }
  }

  visitBinOp (node) {
    if (node.op.type === '+') {
      return this.visit(node.left) + this.visit(node.right)
    } else if (node.op.type === '-') {
      return this.visit(node.left) - this.visit(node.right)
    } else if (node.op.type === '*') {
      return this.visit(node.left) * this.visit(node.right)
    } else if (node.op.type === '/') {
      return this.visit(node.left) / this.visit(node.right)
    }
  }

  visitUnaryOp (node) {
    let op = node.op.type
    if (op === '+') {
      return +this.visit(node.expr)
    } else if (op === '-') {
      return -this.visit(node.expr)
    }
  }

  visitCompound (node) {
    node.children.forEach(child => {
      this.visit(child)
    })
  }

  visitNoOp (node) {
    return undefined
  }

  visitNumber (node) {
    return node.value
  }

  visitString (node) {
    return node.value
  }

  visitBoolean (node) {
    return node.value
  }

  visitAssign (node) {
    let name = node.left.value
    if (name in this.GLOBALCONST) {
      throw new Error('Error: const cannot be change a value.')
    }
    if (node.op.type === ':=') {
      this.GLOBALCONST[name] = this.visit(node.right)
    } else {
      this.GLOBALVAR[name] = this.visit(node.right)
    }
  }

  visitVar (node) {
    let name = node.value
    let val = this.GLOBALVAR[name] || this.GLOBALCONST[name]
    if (typeof val === 'undefined') {
      throw new Error(`var ${name} not found.`)
    }
    return val
  }
  
  visitFunction (node) {
  }

  visitProgram (node) {
    this.visit(node.block)
  }

  run (parser) {
    this.parser = parser
    let tree = this.parser.parse()
    return this.visit(tree)
  }
}
