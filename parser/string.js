module.exports = class String {
  constructor (token) {
    this.token = token
    this.value = token.value
    this.name = 'String'
  }
}
