module.exports = class NormalGet {
  constructor (from, set) {
    this.value = from.value
    this.from = from
    this.set = set
    this.name = 'NormalSet'
  }
}
