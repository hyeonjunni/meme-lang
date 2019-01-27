module.exports = class varSet {
  constructor (name, set) {
    this.varName = name.varName
    this.token = name
    this.set = set
    this.name = 'VarSet'
  }
}
