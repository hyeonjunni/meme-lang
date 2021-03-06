/* eslint-env mocha */
const L = require('./lexer')
const P = require('./parser')
const S = require('./symbol')

let l = L(`
import random
a = 'asdfasdf'
b := 0
i = 0
while (i < a.length) {
  print(i)
  i = i + 1
}
for (c = 0; c < a.length; c = c + 1) {
  print(c)
}

if ('S'.standsFor('Smile')) {
 print('Smile!')
}

times (i, 10) {
  print(i)
}

c := func () {
  print('YAY')
}

c()

print('YAY'[1])

d := 'asdf'

print(d[1])

e = ['asdf', 2,
  '1234',34
]

e.push('asdfasdf')

print(e)

print(e[0])

print(random.choice(e))

e[2] = 'aswdfasdfadsf'

print(e)

run('print(\\'YAY\\')\\n\\nprint(\\'asdf\\')')

f = {
  'asdfasdf': 'asdf'
}

g := func (asdf, asdff,fd,
  asdfasdf
) {
  print(asdf, asdff, fd, asdfasdf)
}

g('a', 'b', 'c', 'd')

print(f['asdfasdf'])

// This code doesn't work: g = 'asdfasdf'

/* And this too: f.asdfasdf */

`)

let p = new P(l)

let t = p.parse()

let s = new S()

s.visit(t)
