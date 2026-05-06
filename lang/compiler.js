import * as ohm from 'ohm-js'
import { starlingGrammar as grammarString } from './grammar.js'
import { actions, resolveReferences as resolve } from './syntaxtree.js'
import { transpile } from './mmgen.js'

/**
 * Takes in a Starling string.
 * Returns array with Starling string AST and Starling string compiled to Metamath.
 * @param {string} star
 * @returns {Array}
 * @example
 *
 *    compile("define 0;")
 */
const compile = (star) => {
  const langGrammar = ohm.grammar(grammarString)
  const s = langGrammar.createSemantics().addOperation('makeAST', actions)
  const matchResult = langGrammar.match(star)
  const adapter = s(matchResult).makeAST()
  const ast = resolve(adapter)
  return [ast, transpile(ast)]
}

export { compile }
