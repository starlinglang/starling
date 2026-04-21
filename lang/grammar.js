/**
 * This is the Starling grammar, defined for usage by ohm-js..
 *
 * @return {string} Starling language grammar.
 *
 */

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
        ReplaceListItem =  math_symbol ":" ReplaceCharacters
        Variable = "fix" VariableListItem  ";"
        VariableListItem = math_symbol  ":" math_symbol
        Disjoint = "distinct" NonemptyListOf<math_symbol, ","> ";"
        Const = "define" NonemptyListOf<math_symbol, ","> ";"
        import_stmt = "import" "\"" importChar+ ";"
        math_symbol = const_symbol+
        ReplaceCharacters = ReplaceCharacter+
        ReplaceCharacter = const_symbol | "=" | "\\" |  "'" |  "[" | "]" | "^" | "_"  
        importChar =  "!"  | "#" | "%" | "&" | "'" | "(" | ")" | "*" | "+" | "," | "-" | "." |
          "/" | alnum | ":" | "<" | ">" | "?" | "@"  | "{" | "|" | "}" | "~"
        const_symbol = "!" | "#" | "%" | "&" | "*" | "+" | "-" | "." | "(" | ")" |  "/" | alnum  | "<" | ">" | "?" | "@"  | "|" | "~"
        comment = multiLineComment | singleLineComment
        lineTerminator = "\n" | "\r" | "\u2028" | "\u2029"
        multiLineComment = "/*" (~"*/" sourceCharacter)* "*/"
        singleLineComment = "//" (~lineTerminator sourceCharacter)*
        sourceCharacter = any
}`

export { starlingGrammar }
