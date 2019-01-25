const Numberr = require('./number')
const Stringg = require('./string')

module.exports = class Arrayy {
  constructor (array) {
    this.array = this.value = []
    array.forEach(x => {
      this.array.push(x.value)
    })
  }

  toString () {
    let a = this.array.map(x => {
      return x.toString()
    })
    return `[ ${'\n' + a.join(',\n')} ]`
  }

  indexOf (a, visit) {
    return new Numberr(this.array.indexOf(visit.visit(a[0])))
  }

  push (a, visit) {
    let aa = this.array.push(visit.visit(a[0]).value)
    if (typeof aa === 'number') {
      return new Numberr(aa)
    } else if (typeof aa === 'string') {
      return new Stringg(aa)
    }
  }

  pop () {
    let a = this.array.pop()
    if (typeof a === 'number') {
      return new Numberr(a)
    } else if (typeof a === 'string') {
      return new Stringg(a)
    }
  }

  remove (a, visit) {
    delete this.array[visit.visit(a[0])]
  }

  delete (a, visit) {
    let i = this.array.indexOf(visit.visit(a[0]))
    delete this.array[i]
  }
}
