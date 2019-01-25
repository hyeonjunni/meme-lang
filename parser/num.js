module.exports = class Number {
  constructor (token) {
    this.token = token
    this.value = token.value
    this.type = 'NUMBER'
    this.name = 'Number'
  }
}
