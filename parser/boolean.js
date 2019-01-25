module.exports = class Boolean {
  constructor (token) {
    this.token = token
    this.value = token.value === 'true'
    this.name = 'Boolean'
  }
}
