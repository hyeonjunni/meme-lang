module.exports = class Call {
  constructor (name, vars = []) {
    this.name = 'Call'
    this.funcName = name
    this.vars = vars
  }
}
