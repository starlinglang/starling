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
       Essential_hyp = "assume" NonemptyListOf<math_symbol, ""> ":"  math_symbol ";"
       Theorem =  NonemptyListOf<math_symbol, "">  ":"   math_symbol ";"
	     Axiom = "axiom" math_symbol  ":"  math_symbol  ";"
       Variable = "fix" VariableListItem  ";"
       VariableListItem = math_symbol  ":" math_symbol
       Disjoint = "distinct" NonemptyListOf<math_symbol, ","> ";"
	     Const = "define" NonemptyListOf<math_symbol, ","> ";"
       import_stmt = "import \"" any_printable_ascii_except_dollar_newline+ "\"" import_alias? ";"
       import_alias = " as " math_symbol
     	 math_symbol = const_symbol+
       any_printable_ascii_except_dollar_newline =  "!"  | "#" | "%" | "&" | "'" | "(" | ")" | "*" | "+" | "," | "-" | "." |
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
  }

`;

let actions = {
  Database(stmts) {
    return stmts.children.map((c) => c.makeAST());
  },

  import_stmt(one, name, three, four, five) {
    return { field: "import_stmt", value: name.sourceString };
  },
  Const(one, list, semicolon) {
    let string_consts = list.asIteration().children.map((c) => c.sourceString);
    return { field: "constant_stmt", value: string_consts };
  },
  Variable(one, list, three) {
    let childAST = list.makeAST();
    return childAST;
  },
  VariableListItem(variable, two, type) {
    let vari = variable.sourceString;
    let typ = type.sourceString;
    return { field: "variable-stmt", variable: vari, type: typ };
  },
  Axiom(one, stmt, three, type, five) {
    let axiomatic = stmt.sourceString;
    let typ = type.sourceString;

    return { field: "axiom", statement: axiomatic, type: typ };
  },
  Theorem(statement, three, type, four) {
    let stmt = statement.asIteration().children.map((c) => c.sourceString);
    let ind = stmt.indexOf("axiom");
    let fld = "axiom";

    if (ind > -1) {
      stmt.splice(ind, 1);
    } else {
      fld = "theorem";
    }
    let typ = type.sourceString;
    return { field: fld, statement: stmt, type: typ };
  },
  Essential_hyp(one, assumed, three, type, five) {
    let assumption = assumed.sourceString;
    let typ = type.sourceString;
    let objet = { field: "essential-stmt", statement: assumption, type: typ };
    return objet;
  },
  Disjoint(one, list, semicolon) {
    return { field: "disjoint", value: list.sourceString.split(",") };
  },
  To_sub(label, two, inner) {
    let name = label.sourceString;
    let a = inner.makeAST();
    return { label: name, inside: a };
  },
  Inner(inside) {
    return inside.makeAST();
  },
  Proof_block(one, thm_name, three, proof_content_array, five) {
    let theorem = thm_name.sourceString;
    let prf = proof_content_array
      .asIteration()
      .children.map((c) => c.makeAST());
    return { field: "proof", thm: theorem, proof: prf };
  },
  Proof_cell(name, semicolon) {
    let name_i = name.sourceString;
    return name_i;
  },
  Block(one, two, list, four) {
    return {
      field: "block",
      value: list.asIteration().children.map((c) => c.makeAST()),
    };
  },
  Block_inner(c) {
    return c;
  },
  Block_content(child) {
    return child.makeAST();
  },
  Block_to_sub(label, two, inner) {
    let name = label.sourceString;
    return {
      label: name,
      inside: inner.children.map((c) => c.makeAST()),
    };
  },
  _terminal() {
    return;
  },
  _iter(...children) {
    return;
  },
  NonemptyListOf(one, two, three) {
    return;
  },
  singleLineComment(one, two) {
    return "single_line_comment";
  },
  multiLineComment(one, two, three) {
    return "multiline_comment";
  },
};
const s = starlingGrammar.createSemantics().addOperation("makeAST", actions);
const matchResult = starlingGrammar.match(testString);
const adapter = s(matchResult).makeAST();

console.dir(adapter, { depth: null });
