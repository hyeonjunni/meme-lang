const convert = require('../builtin/convert')

module.exports = {
  random: () => {
    return Math.random()
  },
  randInt: (args, visit) => {
    if (args.length === 1) {
      return convert(Math.floor(Math.random() * Math.floor(visit.visit(args[0]).value)))
    } else if (args.length === 2) {
      return convert(Math.floor((Math.random() * (visit.visit(args[1]).value - visit.visit(args[0]).value) + 1)) + visit.visit(args[0]).value)
    }
  },
  choice: (args, visit) => {
    let a = visit.visit(args[0]).value
    return convert(a[Math.floor(Math.random() * a.length)])
  }
}
