const Token = require('./Token')

const isDigit = (c) => {
  return (/[0-9]/).test(c)
}

const KEYWORDS = {
  'func': 'FUNCTION',
  'fun': 'FUNCTION',
  'if': 'IF',
  'else': 'ELSE',
  'true': 'BOOLEAN',
  'false': 'BOOLEAN',
  'while': 'WHILE',
  'for': 'FOR',
  'times': 'TIMES',
  'import': 'IMPORT'
}

module.exports = (string) => {
  let i = 0
  let tokens = []
  tokens.push(new Token('{', '{'))
  while (i < string.length) {
    let char = string[i]
    if (char === ' ' || char === '\t' || char === '\n') {
      if (char === '\n') {
        tokens.push(new Token('\n', '\n'))
      }
      while (string[i] === ' ' || string[i] === '\t' || string[i] === '\n') {
        i++
      }
      continue
    }
    if (isDigit(char)) {
      let a = ''
      while (isDigit(string[i])) {
        a += string[i]
        i++
      }
      if (string[i] === '.') {
        a += string[i]
        i++
        while (isDigit(string[i])) {
          a += string[i]
          i++
        }
        tokens.push(new Token('NUMBER', parseFloat(a)))
      } else {
        tokens.push(new Token('NUMBER', parseInt(a)))
      }
      continue
    }
    if (['\'', '"'].includes(char)) {
      i++
      let a = ''
      while (!(['\'', '"'].includes(string[i]) && string[i - 1] !== '\\') || !string[i - 1] === '\n') {
        a += string[i]
        i++
      }
      i++
      if (a.endsWith('\n')) {
        throw new Error('Error: Didn\'t close string.')
      }
      a = a.replace(/\\'/gi, '\'')
      a = a.replace(/\\"/gi, '"')
      a = a.replace(/\\n/gi, '\n')
      tokens.push(new Token('STRING', a))
      continue
    }
    if (/[a-zA-Z]/.test(char)) {
      let a = ''
      while (/[a-zA-Z]/.test(string[i]) || isDigit(string[i]) || string[i] === '_') {
        a += string[i]
        i++
      }
      if (a in KEYWORDS) {
        tokens.push(new Token(KEYWORDS[a], a))
      } else {
        tokens.push(new Token('ID', a))
      }
      continue
    }
    if (char === '/' && string[i + 1] === '/') {
      while (string[i] !== '\n') {
        i++
      }
      continue
    }
    if (char === '/' && string[i + 1] === '*') {
      while (string[i - 2] !== '*' || string[i - 1] !== '/') {
        i++
      }
      continue
    }
    if (char === ':' && string[i + 1] === '=') {
      i++
      i++
      tokens.push(new Token(':=', ':='))
      continue
    }
    if (char === '=' && string[i + 1] === '=') {
      i++
      i++
      tokens.push(new Token('==', '=='))
      continue
    }
    if (char === '>' && string[i + 1] === '=') {
      i++
      i++
      tokens.push(new Token('>=', '>='))
      continue
    }
    if (char === '<' && string[i + 1] === '=') {
      i++
      i++
      tokens.push(new Token('<=', '<='))
      continue
    }
    if (char === '!' && string[i + 1] === '=') {
      i++
      i++
      tokens.push(new Token('!=', '!='))
      continue
    }
    if (char === '|' && string[i + 1] === '|') {
      i++
      i++
      tokens.push(new Token('||', '||'))
      continue
    }
    if (char === '&' && string[i + 1] === '&') {
      i++
      i++
      tokens.push(new Token('&&', '&&'))
      continue
    }
    if (char === '=') {
      tokens.push(new Token('=', char))
      i++
      continue
    }
    if (char === '>') {
      tokens.push(new Token('>', char))
      i++
      continue
    }
    if (char === '<') {
      tokens.push(new Token('<', char))
      i++
      continue
    }
    if (char === '+') {
      tokens.push(new Token('+', char))
      i++
      continue
    }
    if (char === '-') {
      tokens.push(new Token('-', char))
      i++
      continue
    }
    if (char === '*') {
      tokens.push(new Token('*', char))
      i++
      continue
    }
    if (char === '/') {
      tokens.push(new Token('/', char))
      i++
      continue
    }
    if (char === '(') {
      tokens.push(new Token('(', char))
      i++
      continue
    }
    if (char === ')') {
      tokens.push(new Token(')', char))
      i++
      continue
    }
    if (char === '[') {
      tokens.push(new Token('[', char))
      i++
      continue
    }
    if (char === ']') {
      tokens.push(new Token(']', char))
      i++
      continue
    }
    if (char === '{') {
      tokens.push(new Token('{', char))
      i++
      continue
    }
    if (char === '}') {
      tokens.push(new Token('}', char))
      i++
      continue
    }
    if (char === '.') {
      tokens.push(new Token('.', char))
      i++
      continue
    }
    if (char === ',') {
      tokens.push(new Token(',', char))
      i++
      continue
    }
    if (char === ':') {
      tokens.push(new Token(':', char))
      i++
      continue
    }
    if (char === ';'/* || (char === '\n' && string[i - 1] !== '\n') */) {
      tokens.push(new Token(';', char))
      i++
      continue
    }
  }
  tokens.push(new Token('}', '}'))
  tokens.push(new Token('None', undefined))
  return tokens
}
