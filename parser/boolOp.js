module.exports = class BoolOp {
  constructor (left, op, right) {
    this.left = left
    this.op = this.token = op
    this.right = right
    this.name = 'BoolOp'
  }
}
