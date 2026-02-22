const starlingGrammar = ohm.grammar(String.raw`
  Starling {
    database = (space* outermost_scope_stmt space*)+
    outermost_scope_stmt = import_stmt | const | disjoint | to_sub | proof_block | block
    block = "block" space* "{" space* block_content+ space* "}"
    block_content = space* ( disjoint | block | block_to_sub ) space*
    block_inner = variable | axiom | essential_hyp
    block_to_sub = math_symbol whitespace_or "=" whitespace_or block_inner
    proof_block = "proof of " math_symbol space* "{" space* proof_content+ space* "}"
    proof_content = space* ( proof_cell | inner )
    proof_cell = math_symbol whitespace_or ";"
    to_sub = math_symbol whitespace_or "=" whitespace_or inner
    inner = variable | axiom | theorem | essential_hyp
    essential_hyp = "assume " math_space_symbol ":" whitespace_or math_space_symbol ";"
    theorem = math_space_symbol ":" whitespace_or  math_symbol ";"
    axiom = "axiom " math_space_symbol whitespace_or ":" whitespace_or math_symbol whitespace_or ";"
    variable = "fix " math_symbol whitespace_or ":" whitespace_or math_symbol whitespace_or ";"
    disjoint = "distinct " const_char_comb_content whitespace_or math_symbol whitespace_or ";"
    const = "define " const_char_comb_content math_symbol whitespace_or ";"
    const_char_comb_content = const_char_comb_mult*
    const_char_comb_mult = const_char_comb+
    const_char_comb = math_symbol whitespace_or "," whitespace_or
    import_stmt = "import " math_symbol import_alias? ";"
    import_alias = " as " math_symbol
    math_or_space = math_symbol | space
    math_space_symbol = math_or_space+
    math_symbol = const_symbol+
    any_printable_ascii_except_dollar_newline =  "!" | "\"" | "#" | "%" | "&" | "'" | "(" | ")" | "*" | "+" | "," | "-" | "." |
      "/" | digit | ":" | "<" | ">" | "?" | "@" | letter | "{" | "|" |
      "}" | "~"
    const_symbol = "!" | "\"" | "#" | "%" | "&" | "*" | "+" | "-" | "." | "(" | ")" |
      "/" | digit  | "<" | ">" | "?" | "@" | letter | "|" | "~"
    newline = "\n" | "\r \n" | "\r"
    whitespace_or = whitespace_char_except_newline*
    whitespace_char_except_newline = " "
  }`);

testString = `
  define 0, +, equals, implies, <, >, term, formula, provable;

  tt = fix t: term;
  tr = fix r: term;
  ts = fix s: term;
  wp = fix p: formula;
  wq = fix r: formula;


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

console.log(starlingGrammar.match(testString).succeeded());
