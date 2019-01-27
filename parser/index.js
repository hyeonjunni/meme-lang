const NumParser = require('./num')
const BinOpParser = require('./binop')
const UnaryOpParser = require('./unaryop')
const CompoundParser = require('./compond')
const NoOpParser = require('./none')
const AssignParser = require('./assign')
const VarParser = require('./var')
const FuncParser = require('./function')
const StringParser = require('./string')
const BooleanParser = require('./boolean')
const ProgramParser = require('./program')
const CallParser = require('./call')
const BoolOpParser = require('./boolOp')
const IfParser = require('./if')
const DotParser = require('./dot')
const WhileParser = require('./while')
const ForParser = require('./for')
const TimesParser = require('./times')
const VarGetParser = require('./varGet')
const NormalGetParser = require('./normalGet')
const ArrayParser = require('./array')
const ImportParser = require('./import')
const VarSetParser = require('./varSet')
const NormalSetParser = require('./normalSet')
const DictLR = require('./dictLR')
const DictParser = require('./dict')

const BoolOps = ['==', '!=', '>', '<', '<=', '>=', '||', '&&']

module.exports = class Parser {
  constructor (tokens) {
    this.tokens = tokens
    this.indexToken = 0
  }

  program () {
    let node = this.compoundStatement()
    return new ProgramParser(node)
  }

  compoundStatement () {
    this.checker('{')
    let nodes = this.statementList()
    this.checker('}')

    let root = new CompoundParser()

    nodes.forEach(x => {
      root.children.push(x)
    })

    return root
  }

  statementList () {
    let node = this.statement()

    let results = [node]

    while (this.tokens[this.indexToken].type === ';' || this.tokens[this.indexToken].type === '\n') {
      if (this.tokens[this.indexToken].type === ';') {
        this.indexToken++
      } else if (this.tokens[this.indexToken].type === '\n') {
        this.indexToken++
      } else {
        throw new Error(`Error! Type: ${this.tokens[this.indexToken].type} Expected: ; or \n`)
      }
      results.push(this.statement())
    }

    return results
  }

  statement () {
    let token = this.tokens[this.indexToken]
    let node
    if (token.type === '{') {
      node = this.compoundStatement()
    } else if (token.type === 'ID' && this.tokens[this.indexToken + 1].type === '(') {
      node = this.callStatement()
    } else if (this.tokens[this.indexToken + 1].type === '.') {
      node = this.dotStatement()
    } else if (this.tokens[this.indexToken + 1].type === '[') {
      node = this.assignmentSetStatement()
    } else if (token.type === 'IF') {
      node = this.ifStatement()
    } else if (token.type === 'WHILE') {
      node = this.whileStatement()
    } else if (token.type === 'TIMES') {
      node = this.timesStatement()
    } else if (token.type === 'FOR') {
      node = this.forStatement()
    } else if (token.type === 'ID') {
      node = this.assignmentStatement()
    } else if (token.type === 'IMPORT') {
      node = this.importModule()
    } else {
      node = new NoOpParser()
    }

    return node
  }

  importModule () {
    this.checker('IMPORT')
    let name = this.tokens[this.indexToken].value
    this.checker('ID')
    return new ImportParser(name)
  }

  whileStatement () {
    this.checker('WHILE')
    this.checker('(')
    let whil = this.exce()
    this.checker(')')
    let run = this.compoundStatement()

    return new WhileParser(whil, run)
  }

  timesStatement () {
    this.checker('TIMES')
    this.checker('(')
    let id = this.variable()
    this.checker(',')
    let times = new NumParser(this.tokens[this.indexToken])
    this.checker('NUMBER')
    this.checker(')')
    let run = this.compoundStatement()

    return new TimesParser(id, times, run)
  }

  forStatement () {
    this.checker('FOR')
    this.checker('(')
    let checker = []
    let i = 0
    while (i < 3) {
      checker.push(this.exce())
      if (this.tokens[this.indexToken].type !== ')') {
        if (this.tokens[this.indexToken].type === ';') {
          this.checker(';')
        } else {
          this.checker('\n')
        }
      }
      i++
    }
    this.checker(')')
    let run = this.compoundStatement()

    return new ForParser(checker, run)
  }

  dotStatement () {
    let left = this.getNumber()
    this.checker('.')
    let right
    if (this.tokens[this.indexToken + 1].type !== '(') {
      this.indexToken++
      if (this.tokens[this.indexToken + 1].type === '=') {
        right = this.assignmentStatement()
      } else {
        right = this.variable()
      }
    } else {
      right = this.callStatement()
    }

    return new DotParser(left, right)
  }

  ifStatement () {
    this.checker('IF')
    this.checker('(')
    let when = this.exce()
    this.checker(')')
    let then = this.compoundStatement()
    let Else = this.tokens[this.indexToken].type === 'ELSE'
    if (Else) {
      this.indexToken++
      Else = this.compoundStatement()
    } else {
      Else = undefined
    }

    return new IfParser(when, then, Else)
  }

  FunctionStatement () {
    let vars = []
    this.checker('(')
    while (this.tokens[this.indexToken].type !== ')') {
      vars.push(this.tokens[this.indexToken])
      this.checker('ID')
      if (this.tokens[this.indexToken].type === ',') {
        this.checker(',')
      }
      if (this.tokens[this.indexToken].type === '\n') {
        this.indexToken++
      }
      if (this.tokens[this.indexToken].type === ';') {
        this.indexToken++
      }
    }
    this.checker(')')
    let node = this.compoundStatement()

    return new FuncParser(vars, node)
  }

  assignmentSetStatement () {
    let left = this.exce()
    this.checker('=')
    let right = this.exce()
    if (left.name === 'VarGet') {
      return new VarSetParser(left, right)
    } else {
      return new NormalSetParser(left, right)
    }
  }

  assignmentStatement () {
    let left = this.variable()
    let token = this.tokens[this.indexToken]
    if (!(['=', ':='].includes(this.tokens[this.indexToken].type))) {
      throw new Error(`Error! Type: ${this.tokens[this.indexToken].type} Expected: = or :=`)
    }
    this.indexToken++
    let right = this.exce()
    let node = new AssignParser(left, token, right)
    return node
  }

  callStatement () {
    let name = this.tokens[this.indexToken].value
    this.checker('ID')
    let vars = []
    this.checker('(')
    while (this.tokens[this.indexToken].type !== ')') {
      vars.push(this.exce())
      if (this.tokens[this.indexToken].type === ',') {
        this.checker(',')
      }
      if (this.tokens[this.indexToken].type === '\n') {
        this.indexToken++
      }
      if (this.tokens[this.indexToken].type === ';') {
        this.indexToken++
      }
    }
    this.checker(')')

    return new CallParser(name, vars)
  }

  variable () {
    let node = new VarParser(this.tokens[this.indexToken])
    this.checker('ID')
    return node
  }

  checker (name) {
    if (this.tokens[this.indexToken].type === '\n' && name !== '\n') {
      this.indexToken++
    }
    if (this.tokens[this.indexToken].type === ';' && name !== ';') {
      this.indexToken++
    }
    if (this.tokens[this.indexToken].type === name) {
      this.indexToken++
    } else {
      throw new Error(`Error! Type: ${this.tokens[this.indexToken].type} Expected: ${name}`)
    }
  }

  getNumber () {
    if (this.tokens[this.indexToken].type === '\n') {
      this.indexToken++
    }
    if (this.tokens[this.indexToken].type === ';') {
      this.indexToken++
    }
    let token = this.tokens[this.indexToken]
    if (token.type === 'NUMBER') {
      this.checker('NUMBER')
      return new NumParser(token)
    } else if (token.type === '+') {
      this.checker('+')
      return new UnaryOpParser(token, this.getNumber())
    } else if (token.type === '-') {
      this.checker('-')
      return new UnaryOpParser(token, this.getNumber())
    } else if (token.type === '(') {
      this.checker('(')
      let result = this.exce()
      this.checker(')')
      return result
    } else if (token.type === 'STRING') {
      this.checker('STRING')
      return new StringParser(token)
    } else if (token.type === 'BOOLEAN') {
      this.checker('BOOLEAN')
      return new BooleanParser(token)
    } else if (token.type === 'FUNCTION') {
      this.checker('FUNCTION')
      return this.FunctionStatement()
    } else if (this.tokens[this.indexToken + 1].type === '=') {
      return this.assignmentStatement()
    } else if (token.type === '[') {
      this.checker('[')
      let vars = []
      while (this.tokens[this.indexToken].type !== ']') {
        vars.push(this.exce())
        if (this.tokens[this.indexToken].type === ',') {
          this.checker(',')
        }
        if (this.tokens[this.indexToken].type === '\n') {
          this.indexToken++
        }
        if (this.tokens[this.indexToken].type === ';') {
          this.indexToken++
        }
      }
      this.checker(']')
      return new ArrayParser(vars)
    } else if (token.type === '{') {
      this.checker('{')
      let vars = []
      while (this.tokens[this.indexToken].type !== '}') {
        let left = this.exce()
        this.checker(':')
        let right = this.exce()
        vars.push(new DictLR(left, right))
        if (this.tokens[this.indexToken].type === ',') {
          this.checker(',')
        }
        if (this.tokens[this.indexToken].type === '\n') {
          this.indexToken++
        }
        if (this.tokens[this.indexToken].type === ';') {
          this.indexToken++
        }
      }
      this.checker('}')
      return new DictParser(vars)
    } else {
      return this.variable()
    }
  }

  calcHigh () {
    let result = this.getNumber()

    while (this.tokens[this.indexToken].type === '/' || this.tokens[this.indexToken].type === '*') {
      let token = this.tokens[this.indexToken]
      if (token.type === '*') {
        this.checker('*')
      } else if (token.type === '/') {
        this.checker('/')
      }
      result = new BinOpParser(result, token, this.getNumber())
    }

    return result
  }

  exce () {
    let result = this.calcHigh()

    while (this.tokens[this.indexToken].type === '.') {
      this.checker('.')
      let right
      if (this.tokens[this.indexToken + 1].type !== '(') {
        if (this.tokens[this.indexToken + 1].type === '=') {
          right = this.assignmentStatement()
        } else {
          right = this.variable()
        }
      } else {
        right = this.callStatement()
      }

      result = new DotParser(result, right)
    }

    while (this.tokens[this.indexToken].type === '+' || this.tokens[this.indexToken].type === '-') {
      let token = this.tokens[this.indexToken]
      if (token.type === '+') {
        this.checker('+')
      } else if (token.type === '-') {
        this.checker('-')
      }
      result = new BinOpParser(result, token, this.exce())
    }

    while (BoolOps.includes(this.tokens[this.indexToken].type)) {
      let token = this.tokens[this.indexToken]
      if (token.type === '==') {
        this.checker('==')
      } else if (token.type === '!=') {
        this.checker('!=')
      } else if (token.type === '>=') {
        this.checker('>=')
      } else if (token.type === '<=') {
        this.checker('<=')
      } else if (token.type === '>') {
        this.checker('>')
      } else if (token.type === '<') {
        this.checker('<')
      } else if (token.type === '||') {
        this.checker('||')
      } else if (token.type === '&&') {
        this.checker('&&')
      }
      result = new BoolOpParser(result, token, this.exce())
    }

    while (this.tokens[this.indexToken].type === '[') {
      this.checker('[')
      let a = this.exce()
      this.checker(']')
      if (result.name === 'Var') {
        result = new VarGetParser(result, a)
      } else {
        result = new NormalGetParser(result, a)
      }
    }

    return result
  }

  parse () {
    let node = this.program()

    return node
  }
}
