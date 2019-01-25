module.exports = (args, symbol) => {
  let a = []
  args.forEach(x => {
    let s = symbol.visit(x)
    a.push(s.value)
  })
  console.log(...a)
}
