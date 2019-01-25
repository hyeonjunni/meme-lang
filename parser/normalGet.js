module.exports = class NormalGet {
  constructor (from, get) {
    this.value = from.value
    this.from = from
    this.get = get
    this.name = 'NormalGet'
  }
}
