module.exports = class If {
  constructor (check, then, Else = undefined) {
    this.check = check
    this.then = then
    this.else = Else
    this.name = 'If'
  }
}
