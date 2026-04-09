const ohm = require("ohm-js");
const toAST = require("ohm-js/extras").toAST;
const grammarString = require("./grammar.js").starlingGrammar;
const actions = require("./syntaxtree.js").actions;
const resolve = require("./syntaxtree.js").resolveReferences;
const transpile = require("./mmgen.js").transpile;
const { shortTest, longTest } = require("./tests.js");

let compile = (string) => {
  let langGrammar = ohm.grammar(grammarString);
  const s = langGrammar.createSemantics().addOperation("makeAST", actions);
  const matchResult = langGrammar.match(string);
  const adapter = s(matchResult).makeAST();
  const ast = resolve(adapter);
  return transpile(ast).toString();
};

console.log(compile(longTest));

module.exports = { compile };
