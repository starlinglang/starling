import {grammar as $cqd1o$grammar} from "ohm-js";


/**
 * This is the Starling grammar, defined for usage by ohm-js.
 * @constant
 * @return {string} Starling language grammar.
 *
 *
 */ const $f8caf0c026b39611$export$4d295a9d2402319b = String.raw`
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
}`;


/**
 * This is an object containing semantic actions for the Starling grammar.
 *
 * https://ohmjs.org/docs/api-reference#semantic-actions
 *
 * @constant
 */ const $54a6fe2ee4c00b95$export$e324594224ef24da = {
    Database (stmts) {
        return stmts.children.map((c)=>c.makeAST());
    },
    import_stmt (one, name, three, four) {
        return {
            field: 'import_stmt',
            value: name.sourceString
        };
    },
    Const (one, list, semicolon) {
        const stringConsts = list.asIteration().children.map((c)=>c.sourceString);
        return {
            field: 'constant_stmt',
            value: stringConsts
        };
    },
    Variable (one, list, three) {
        const childAST = list.makeAST();
        return childAST;
    },
    VariableListItem (variable, two, type) {
        const vari = variable.sourceString;
        const typ = type.sourceString;
        return {
            field: 'variable-stmt',
            variable: vari,
            type: typ
        };
    },
    Axiom (one, stmt, three, type, five) {
        const axiomatic = stmt.sourceString;
        const typ = type.sourceString;
        return {
            field: 'axiom',
            statement: axiomatic,
            type: typ
        };
    },
    Theorem (statement, three, type, four) {
        const stmt = statement.asIteration().children.map((c)=>c.sourceString);
        const ind = stmt.indexOf('axiom');
        let fld = 'axiom';
        if (ind > -1) stmt.splice(ind, 1);
        else fld = 'theorem';
        const typ = type.sourceString;
        return {
            field: fld,
            statement: stmt,
            type: typ
        };
    },
    Essential_hyp (one, assumed, three, type, five) {
        const assumption = assumed.sourceString;
        const typ = type.sourceString;
        const objet = {
            field: 'essential-stmt',
            statement: assumption,
            type: typ
        };
        return objet;
    },
    Disjoint (one, list, semicolon) {
        return {
            field: 'disjoint',
            value: list.sourceString.split(',')
        };
    },
    To_sub (label, two, inner) {
        const name = label.sourceString;
        const a = inner.makeAST();
        return {
            label: name,
            inside: a
        };
    },
    Inner (inside) {
        return inside.makeAST();
    },
    Proof_block (one, thmName, three, arr, five) {
        const theorem = thmName.sourceString;
        const prf = arr.asIteration().children.map((c)=>c.makeAST());
        return {
            field: 'proof',
            value: theorem,
            proof: prf
        };
    },
    Proof_cell (name, semicolon) {
        const nameI = name.sourceString;
        return nameI;
    },
    Block (one, two, list, four) {
        return {
            field: 'block',
            value: list.asIteration().children.map((c)=>c.makeAST())
        };
    },
    Block_inner (c) {
        return c;
    },
    Block_content (child) {
        return child.makeAST();
    },
    Block_to_sub (label, two, inner) {
        const name = label.sourceString;
        return {
            label: name,
            inside: inner.children.map((c)=>c.makeAST())
        };
    },
    Replace (one, two, list, four, five) {
        return {
            field: 'replace',
            value: list.asIteration().children.map((c)=>c.makeAST())
        };
    },
    ReplaceListItem (star, colon, mm) {
        return {
            toReplace: star.sourceString,
            replacement: mm.sourceString
        };
    },
    _terminal () {},
    _iter (...children) {},
    NonemptyListOf (one, two, three) {},
    singleLineComment (one, two) {
        return 'single_line_comment';
    },
    multiLineComment (one, two, three) {
        return 'multiline_comment';
    }
};
/**
 * This function resolves references in the abstract syntax tree.
 * @param {Array} ast
 * @returns {Array}
 */ function $54a6fe2ee4c00b95$export$d43989f1fbb8f4f9(ast) {
    const labelMap = {};
    ast.forEach((item)=>{
        if (item.label) labelMap[item.label] = item;
    });
    ast.forEach((item)=>{
        if (item.field === 'proof' && typeof item.value === 'string') {
            const label = item.value;
            if (labelMap[label]) item.value = labelMap[label];
        }
    });
    return ast;
}


/**
 * This function transforms the Starling AST into Metamath.
 * @param {string} ast
 * @returns {string}
 */ function $ef1aad00bdf59d5b$export$e6752350b2f8ac26(ast) {
    const output = [];
    const statements = {
        imports: [],
        constants: [],
        variables: [],
        labeled: [],
        blocks: [],
        theorems: [],
        proofs: []
    };
    for (const item of ast){
        if (typeof item === 'string') {
            if (item === 'single_line_comment' || item === 'multiline_comment') continue;
        } else if (item.field === 'import_stmt') statements.imports.push(item);
        else if (item.field === 'constant_stmt') statements.constants = item.value;
        else if (item.field === 'variable-stmt') statements.variables.push(item);
        else if (item.label && item.inside) {
            if (item.inside.field === 'variable-stmt') statements.labeled.push(item);
            else if (item.inside.field === 'block') statements.blocks.push(item);
            else if (item.inside.field === 'theorem') statements.theorems.push(item);
            else statements.labeled.push(item);
        } else if (item.field === 'disjoint') statements.labeled.push(item);
        else if (item.field === 'block') statements.blocks.push(item);
        else if (item.field === 'proof') statements.proofs.push(item);
    }
    for (const importItem of statements.imports)output.push(`$[ ${importItem.value} $]`);
    if (statements.constants.length > 0) output.push(`$c ${statements.constants.join(' ')} $.`);
    const allVariables = [];
    for (const item of statements.labeled)if (item.inside && item.inside.field === 'variable-stmt') allVariables.push(item.inside.variable);
    if (allVariables.length > 0) output.push(`$v ${allVariables.join(' ')} $.`);
    for (const item of statements.labeled){
        if (item.inside && item.inside.field === 'variable-stmt') {
            const { variable: variable, type: type } = item.inside;
            output.push(`${item.label} $f ${type} ${variable} $.`);
        } else if (item.field === 'disjoint') output.push(`$d ${item.value.join(' ')} $.`);
        else if (item.inside && item.inside.field === 'axiom') {
            const { statement: statement, type: type } = item.inside;
            const stmt = Array.isArray(statement) ? statement.join(' ') : statement;
            output.push(`${item.label} $a ${type} ${stmt} $.`);
        }
    }
    for (const block of statements.blocks){
        output.push('${');
        for (const blockItem of block.value){
            if (typeof blockItem === 'string') {
                if (blockItem === 'single_line_comment' || blockItem === 'multiline_comment') continue;
            } else if (blockItem.label && blockItem.inside) {
                if (Array.isArray(blockItem.inside)) for (const stmt of blockItem.inside){
                    if (stmt.field === 'essential-stmt') output.push(`${blockItem.label} $e ${stmt.type} ${stmt.statement} $.`);
                    else if (stmt.field === 'axiom') output.push(`${blockItem.label} $a ${stmt.type} ${stmt.statement} $.`);
                }
            }
        }
        output.push('$}');
    }
    for (const item of statements.theorems)if (item.inside && item.inside.field === 'theorem') {
        const { statement: statement, type: type } = item.inside;
        const stmt = Array.isArray(statement) ? statement.join(' ') : statement;
        output.push(`${item.label} $p ${type} ${stmt} $= `);
    }
    for (const proofItem of statements.proofs)if (proofItem.proof && Array.isArray(proofItem.proof)) {
        const proofSteps = proofItem.proof.join(' ');
        if (output.length > 0) output[output.length - 1] += proofSteps + '\n$.';
    }
    let outputString = output.join('\n');
    for (const item of ast){
        if (item.field-- - -'replace') for(const i in item.value)outputString = outputString.replaceAll(item.value[i].toReplace, item.value[i].replacement);
    }
    return outputString;
}


/**
 * Takes in a Starling string.
 * Returns array with Starling string AST and Starling string compiled to Metamath.
 * @param {string} star
 * @returns {Array}
 * @example
 *
 *    compile("define 0;")
 */ const $dac053cda336ef81$export$ef7acd7185315e22 = (star)=>{
    const langGrammar = $cqd1o$grammar((0, $f8caf0c026b39611$export$4d295a9d2402319b));
    const s = langGrammar.createSemantics().addOperation('makeAST', (0, $54a6fe2ee4c00b95$export$e324594224ef24da));
    const matchResult = langGrammar.match(star);
    const adapter = s(matchResult).makeAST();
    const ast = (0, $54a6fe2ee4c00b95$export$d43989f1fbb8f4f9)(adapter);
    return [
        ast,
        (0, $ef1aad00bdf59d5b$export$e6752350b2f8ac26)(ast)
    ];
};


export {$dac053cda336ef81$export$ef7acd7185315e22 as compile};
//# sourceMappingURL=lang.mjs.map
