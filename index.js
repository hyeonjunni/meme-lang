const Parser = require('./parser')
const lexer = require('./lexer')
const Interpreter = require('./interpreter')
const repl = require('repl')
const replServer = repl.start({
  prompt: '> '
})

let interpreter = new Interpreter()

replServer.defineCommand('calc', {
  action (data) {
    let result = new Parser(lexer(data))
    result = interpreter.run(result)
    this.clearBufferedCommand()
    console.log(result)
    this.displayPrompt()
  }
})
