const L = require('../lexer')
const P = require('../parser')

module.exports = (args, visit) => {
  let a = visit.visit(args[0])

  let l = L(a.value)
  let p = new P(l)
  visit.visit(p.parse())
}
