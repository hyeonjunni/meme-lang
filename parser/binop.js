module.exports = class BinOp {
  constructor (left, op, right) {
    this.left = left
    this.op = this.token = op
    this.right = right
    this.name = 'BinOp'
  }
}
