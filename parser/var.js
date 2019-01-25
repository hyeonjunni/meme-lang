module.exports = class Var {
  constructor (token) {
    this.token = token
    this.value = token.value
    this.name = 'Var'
  }
}
