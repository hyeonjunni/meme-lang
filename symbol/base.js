module.exports = class Symbol {
  constructor (name, type = undefined) {
    this.name = name
    this.type = type
    this.category = undefined
  }
}
