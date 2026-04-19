import * as ohm from 'ohm-js'
import { starlingGrammar as grammarString } from './grammar.js'
import { actions, resolveReferences as resolve } from './syntaxtree.js'
import { transpile } from './mmgen.js'

const compile = (string) => {
  const langGrammar = ohm.grammar(grammarString)
  const s = langGrammar.createSemantics().addOperation('makeAST', actions)
  const matchResult = langGrammar.match(string)
  const adapter = s(matchResult).makeAST()
  const ast = resolve(adapter)
  return [ast, transpile(ast)]
}

export { compile }
