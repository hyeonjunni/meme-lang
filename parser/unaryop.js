module.exports = class UnaryOp {
  constructor (op, expr) {
    this.token = this.op = op
    this.expr = expr
    this.name = 'UnaryOp'
  }
}
