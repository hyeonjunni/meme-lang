module.exports = class varGet {
  constructor (name, get) {
    this.varName = name.value
    this.token = name
    this.get = get
    this.name = 'VarGet'
  }
}
