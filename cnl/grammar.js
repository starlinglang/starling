const ohm = require("ohm-js");
const extras = require("ohm-js/extras");
const toAST = require("ohm-js/extras").toAST;

const starlingGrammar = ohm.grammar(String.raw`
  Starling {
       Database = Outermost_scope_stmt+
       Outermost_scope_stmt = import_stmt | Const | Disjoint | To_sub | Proof_block | Block | comment
       Block_content = Disjoint | Block | Block_to_sub | comment
       Block = "block"  "{" Block_content+  "}"
       Block_to_sub = math_symbol  "="  Block_inner
       Block_inner = Variable | Axiom | Essential_hyp
       Proof_block = "proof of " math_symbol "{"  Proof_unit+  "}"
       Proof_unit = comment | Proof_cell
       Proof_cell = math_symbol  ";"
       To_sub = math_symbol  "="  Inner
       Inner = Variable | Axiom | Theorem | Essential_hyp
       Essential_hyp = "assume " NonemptyListOf<math_symbol, ""> ":"  NonemptyListOf<math_symbol, ""> ";"
       Theorem =  NonemptyListOf<math_symbol, "">  ":"   math_symbol ";"
	    Axiom = "axiom " math_symbol  ":"  math_symbol  ";"
       Variable = "fix " NonemptyListOf<VariableListItem, ",">  ";"
       VariableListItem = math_symbol  ":" math_symbol
       Disjoint = "distinct " NonemptyListOf<math_symbol, ","> ";"
	   Const = "define " NonemptyListOf<math_symbol, ","> ";"
       import_stmt = "import " any_printable_ascii_except_dollar_newline+ import_alias? ";"
       import_alias = " as " math_symbol
     	math_symbol = const_symbol+
       any_printable_ascii_except_dollar_newline =  "!" | "\"" | "#" | "%" | "&" | "'" | "(" | ")" | "*" | "+" | "," | "-" | "." |
         "/" | alnum | ":" | "<" | ">" | "?" | "@"  | "{" | "|" | "}" | "~"
       const_symbol = "!" | "#" | "%" | "&" | "*" | "+" | "-" | "." | "(" | ")" |  "/" | alnum  | "<" | ">" | "?" | "@"  | "|" | "~"
       comment = multiLineComment | singleLineComment
	     sourceCharacter = any
       lineTerminator = "\n" | "\r" | "\u2028" | "\u2029"
       multiLineComment = "/*" (~"*/" sourceCharacter)* "*/"
       singleLineComment = "//" (~lineTerminator sourceCharacter)*
   }`);

testString = `

  import "set.mm";

  define 0, +, equals, implies, <, >, term, formula, provable;

  // outermost scope comment

  /*
  A
  multiLine
  comment.
  */

  tt = fix t: term;
  tr = fix r: term;
  ts = fix s: term;
  wp = fix p: formula;
  wq = fix r: formula;

  distinct wp, wq;

  tze = axiom 0: term;
  tpl = axiom <t + r>: term;
  weq = axiom t - r: term;
  wim = axiom <P implies Q>: term;


  a1 =  axiom <t equals r implies <t equals s implies r equals s >>: provable;
  a2 =  axiom <t+0>: provable;

  block {
	min = assume P: provable;
	maj = assume <P implies Q>: provable;
	mp = axiom Q: provable;
	// comment inside block
  }

  th1 = t equals t: provable;


  proof of th1 {
	tt;
	tze;
	tpl;
	tt;
	weq;
	tt;
	tt;
	weq;
	tt;
	a2;
	tt;
	tze;
	tpl;
	tt;
	weq;
	tt;
	tze;
	tpl;
	tt;
	weq;
	tt;
	tt;
	weq;
	wim;
	tt;
	a2;
	tt;
	tze;
	tpl;
	tt;
	tt;
	a1;
	mp;
	mp;
	//comment inside proof
  }
`;

let matched = starlingGrammar.match(testString, "Database");

const ast = toAST(matched);

let filename_imports = [];
let constants = [];
let disjoint = [];

let fixed_variables = [];
let variables = [];
let variable_template = { label: "", math_symbol: "", type: "" };
let essential_hypotheses = [];
let axioms = [];
let proof_body_template = [];

let unlabeled_array_count = 0;

for (let i = 0; i < ast.length; i++) {
  const entry = ast[i];

  switch (true) {
    // Handle import statements
    case typeof entry === "string" && entry.includes("import"):
      const match = entry.match(/"([^"]+)"/);
      if (match) {
        filename_imports.push(match[1]);
      }
      break;

    // Handle unlabeled arrays (constants or disjoint)
    case Array.isArray(entry) &&
      !entry.some((item) => typeof item === "object" && item.type):
      if (unlabeled_array_count === 0) {
        constants = Array.isArray(entry) ? entry.join(" ") : entry;
      } else if (unlabeled_array_count === 1) {
        disjoint = Array.isArray(entry) ? entry.join(" ") : entry;
      }
      unlabeled_array_count++;
      break;

    default:
      break;
  }
}

console.log(disjoint);
