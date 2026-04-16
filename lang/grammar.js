const ohm = require("ohm-js");

const starlingGrammar = String.raw`
Starling {
        Database = Outermost_scope_stmt+
        Outermost_scope_stmt = import_stmt | Const | Replace | Disjoint | To_sub | Proof_block | Block | comment
        Block_content = Disjoint | Block | Block_to_sub | comment
        Block = "block"  "{" Block_content+  "}"
        Block_to_sub = math_symbol  "="  Block_inner
        Block_inner = Variable | Axiom | Essential_hyp
        Proof_block = "proof of" math_symbol "{"  Proof_unit+  "}"
        Proof_unit = comment | Proof_cell
        Proof_cell = math_symbol  ";"
        To_sub = math_symbol  "="  Inner
        Inner = Variable | Axiom | Theorem | Essential_hyp
        Essential_hyp = "assume" NonemptyListOf<math_symbol, ""> ":"  math_symbol ";"
        Theorem =  NonemptyListOf<math_symbol, "">  ":"   math_symbol ";"
	    Axiom = "axiom" math_symbol  ":"  math_symbol  ";"
	   Replace = "replace" "{" NonemptyListOf<ReplaceListItem, ","> "}" ";"
        ReplaceListItem =  replaceCharacters ":" math_symbol
        Variable = "fix" VariableListItem  ";"
        VariableListItem = math_symbol  ":" math_symbol
        Disjoint = "distinct" NonemptyListOf<math_symbol, ","> ";"
	     Const = "define" NonemptyListOf<math_symbol, ","> ";"
        import_stmt = "import" "\"" any_printable_ascii_except_dollar_newline+ ";"
      	 math_symbol = const_symbol+
        replaceCharacters = replaceCharacter+
        replaceCharacter = any_printable_ascii_except_dollar_newline | "="
        any_printable_ascii_except_dollar_newline =  "!"  | "#" | "%" | "&" | "'" | "(" | ")" | "*" | "+" | "," | "-" | "." |
          "/" | alnum | ":" | "<" | ">" | "?" | "@"  | "{" | "|" | "}" | "~"
        const_symbol = "!" | "#" | "%" | "&" | "*" | "+" | "-" | "." | "(" | ")" |  "/" | alnum  | "<" | ">" | "?" | "@"  | "|" | "~"
        comment = multiLineComment | singleLineComment
        lineTerminator = "\n" | "\r" | "\u2028" | "\u2029"
        multiLineComment = "/*" (~"*/" sourceCharacter)* "*/"
        singleLineComment = "//" (~lineTerminator sourceCharacter)*
        sourceCharacter = any
}`;

module.exports = { starlingGrammar };
