function $parcel$export (e, n, v, s) {
  Object.defineProperty(e, n, {
    get: v,
    set: s,
    enumerable: true,
    configurable: true
  })
}
/**
 * This is the Starling grammar, defined for usage by ohm-js.
 * @constant
 * @return {string} Starling language grammar.
 *
 *
 */ const $c85bf9ccc162a34d$export$4d295a9d2402319b = String.raw`
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

/**
 * This is an object containing semantic actions for the Starling grammar.
 *
 * https://ohmjs.org/docs/api-reference#semantic-actions
 *
 * @constant
 */ const $4e84020b840855f3$export$e324594224ef24da = {
  Database (stmts) {
    return stmts.children.map((c) => c.makeAST())
  },
  import_stmt (one, name, three, four) {
    return {
      field: 'import_stmt',
      value: name.sourceString
    }
  },
  Const (one, list, semicolon) {
    const stringConsts = list.asIteration().children.map((c) => c.sourceString)
    return {
      field: 'constant_stmt',
      value: stringConsts
    }
  },
  Variable (one, list, three) {
    const childAST = list.makeAST()
    return childAST
  },
  VariableListItem (variable, two, type) {
    const vari = variable.sourceString
    const typ = type.sourceString
    return {
      field: 'variable-stmt',
      variable: vari,
      type: typ
    }
  },
  Axiom (one, stmt, three, type, five) {
    const axiomatic = stmt.sourceString
    const typ = type.sourceString
    return {
      field: 'axiom',
      statement: axiomatic,
      type: typ
    }
  },
  Theorem (statement, three, type, four) {
    const stmt = statement.asIteration().children.map((c) => c.sourceString)
    const ind = stmt.indexOf('axiom')
    let fld = 'axiom'
    if (ind > -1) stmt.splice(ind, 1)
    else fld = 'theorem'
    const typ = type.sourceString
    return {
      field: fld,
      statement: stmt,
      type: typ
    }
  },
  Essential_hyp (one, assumed, three, type, five) {
    const assumption = assumed.sourceString
    const typ = type.sourceString
    const objet = {
      field: 'essential-stmt',
      statement: assumption,
      type: typ
    }
    return objet
  },
  Disjoint (one, list, semicolon) {
    return {
      field: 'disjoint',
      value: list.sourceString.split(',')
    }
  },
  To_sub (label, two, inner) {
    const name = label.sourceString
    const a = inner.makeAST()
    return {
      label: name,
      inside: a
    }
  },
  Inner (inside) {
    return inside.makeAST()
  },
  Proof_block (one, thmName, three, arr, five) {
    const theorem = thmName.sourceString
    const prf = arr.asIteration().children.map((c) => c.makeAST())
    return {
      field: 'proof',
      value: theorem,
      proof: prf
    }
  },
  Proof_cell (name, semicolon) {
    const nameI = name.sourceString
    return nameI
  },
  Block (one, two, list, four) {
    return {
      field: 'block',
      value: list.asIteration().children.map((c) => c.makeAST())
    }
  },
  Block_inner (c) {
    return c
  },
  Block_content (child) {
    return child.makeAST()
  },
  Block_to_sub (label, two, inner) {
    const name = label.sourceString
    return {
      label: name,
      inside: inner.children.map((c) => c.makeAST())
    }
  },
  Replace (one, two, list, four, five) {
    return {
      field: 'replace',
      value: list.asIteration().children.map((c) => c.makeAST())
    }
  },
  ReplaceListItem (star, colon, mm) {
    return {
      toReplace: star.sourceString,
      replacement: mm.sourceString
    }
  },
  _terminal () {},
  _iter (...children) {},
  NonemptyListOf (one, two, three) {},
  singleLineComment (one, two) {
    return 'single_line_comment'
  },
  multiLineComment (one, two, three) {
    return 'multiline_comment'
  }
}
/**
 * This function resolves references in the abstract syntax tree.
 * @param {Array} ast
 * @returns {Array}
 */ function $4e84020b840855f3$export$d43989f1fbb8f4f9 (ast) {
  const labelMap = {}
  ast.forEach((item) => {
    if (item.label) labelMap[item.label] = item
  })
  ast.forEach((item) => {
    if (item.field === 'proof' && typeof item.value === 'string') {
      const label = item.value
      if (labelMap[label]) item.value = labelMap[label]
    }
  })
  return ast
}

/**
 * This function transforms the Starling AST into Metamath.
 * @param {string} ast
 * @returns {string}
 */ function $db8e6816c5249ddb$export$e6752350b2f8ac26 (ast) {
  const output = []
  const statements = {
    imports: [],
    constants: [],
    variables: [],
    labeled: [],
    blocks: [],
    theorems: [],
    proofs: []
  }
  for (const item of ast) {
    if (typeof item === 'string') {
      if (item === 'single_line_comment' || item === 'multiline_comment') { continue }
    } else if (item.field === 'import_stmt') statements.imports.push(item)
    else if (item.field === 'constant_stmt') statements.constants = item.value
    else if (item.field === 'variable-stmt') statements.variables.push(item)
    else if (item.label && item.inside) {
      if (item.inside.field === 'variable-stmt') statements.labeled.push(item)
      else if (item.inside.field === 'block') statements.blocks.push(item)
      else if (item.inside.field === 'theorem') statements.theorems.push(item)
      else statements.labeled.push(item)
    } else if (item.field === 'disjoint') statements.labeled.push(item)
    else if (item.field === 'block') statements.blocks.push(item)
    else if (item.field === 'proof') statements.proofs.push(item)
  }
  for (const importItem of statements.imports) { output.push(`$[ ${importItem.value} $]`) }
  if (statements.constants.length > 0) { output.push(`$c ${statements.constants.join(' ')} $.`) }
  const allVariables = []
  for (const item of statements.labeled) {
    if (item.inside && item.inside.field === 'variable-stmt') { allVariables.push(item.inside.variable) }
  }
  if (allVariables.length > 0) output.push(`$v ${allVariables.join(' ')} $.`)
  for (const item of statements.labeled) {
    if (item.inside && item.inside.field === 'variable-stmt') {
      const { variable, type } = item.inside
      output.push(`${item.label} $f ${type} ${variable} $.`)
    } else if (item.field === 'disjoint') { output.push(`$d ${item.value.join(' ')} $.`) } else if (item.inside && item.inside.field === 'axiom') {
      const { statement, type } = item.inside
      const stmt = Array.isArray(statement) ? statement.join(' ') : statement
      output.push(`${item.label} $a ${type} ${stmt} $.`)
    }
  }
  for (const block of statements.blocks) {
    output.push('${')
    for (const blockItem of block.value) {
      if (typeof blockItem === 'string') {
        if (
          blockItem === 'single_line_comment' ||
          blockItem === 'multiline_comment'
        ) { continue }
      } else if (blockItem.label && blockItem.inside) {
        if (Array.isArray(blockItem.inside)) {
          for (const stmt of blockItem.inside) {
            if (stmt.field === 'essential-stmt') {
              output.push(
                `${blockItem.label} $e ${stmt.type} ${stmt.statement} $.`
              )
            } else if (stmt.field === 'axiom') {
              output.push(
                `${blockItem.label} $a ${stmt.type} ${stmt.statement} $.`
              )
            }
          }
        }
      }
    }
    output.push('$}')
  }
  for (const item of statements.theorems) {
    if (item.inside && item.inside.field === 'theorem') {
      const { statement, type } = item.inside
      const stmt = Array.isArray(statement) ? statement.join(' ') : statement
      output.push(`${item.label} $p ${type} ${stmt} $= `)
    }
  }
  for (const proofItem of statements.proofs) {
    if (proofItem.proof && Array.isArray(proofItem.proof)) {
      const proofSteps = proofItem.proof.join(' ')
      if (output.length > 0) output[output.length - 1] += proofSteps + '\n$.'
    }
  }
  let outputString = output.join('\n')
  for (const item of ast) {
    if (item.field-- - -'replace') {
      for (const i in item.value) {
        outputString = outputString.replaceAll(
          item.value[i].toReplace,
          item.value[i].replacement
        )
      }
    }
  }
  return outputString
}

const $e2c0af47b6882e74$exports = {}

$parcel$export(
  $e2c0af47b6882e74$exports,
  'abstract',
  () => $e2c0af47b6882e74$export$817eb92a8194bab0
)
$parcel$export(
  $e2c0af47b6882e74$exports,
  'assert',
  () => $e2c0af47b6882e74$export$a7a9523472993e97
)
$parcel$export(
  $e2c0af47b6882e74$exports,
  'defineLazyProperty',
  () => $e2c0af47b6882e74$export$1eb31d8ccbbbc638
)
$parcel$export(
  $e2c0af47b6882e74$exports,
  'clone',
  () => $e2c0af47b6882e74$export$9cd59f9826255e47
)
$parcel$export(
  $e2c0af47b6882e74$exports,
  'repeatFn',
  () => $e2c0af47b6882e74$export$8f8128772e09cd81
)
$parcel$export(
  $e2c0af47b6882e74$exports,
  'repeatStr',
  () => $e2c0af47b6882e74$export$d6a6a8e48e4bad63
)
$parcel$export(
  $e2c0af47b6882e74$exports,
  'repeat',
  () => $e2c0af47b6882e74$export$76d90c956114f2c2
)
$parcel$export(
  $e2c0af47b6882e74$exports,
  'getDuplicates',
  () => $e2c0af47b6882e74$export$1a47093b60e54e96
)
$parcel$export(
  $e2c0af47b6882e74$exports,
  'copyWithoutDuplicates',
  () => $e2c0af47b6882e74$export$8c70279880500ad3
)
$parcel$export(
  $e2c0af47b6882e74$exports,
  'isSyntactic',
  () => $e2c0af47b6882e74$export$41fdc1de1da6ab9b
)
$parcel$export(
  $e2c0af47b6882e74$exports,
  'isLexical',
  () => $e2c0af47b6882e74$export$f9f4599cdf73f828
)
$parcel$export(
  $e2c0af47b6882e74$exports,
  'padLeft',
  () => $e2c0af47b6882e74$export$bc3bea8325045070
)
$parcel$export(
  $e2c0af47b6882e74$exports,
  'StringBuffer',
  () => $e2c0af47b6882e74$export$83347051c3437dc9
)
$parcel$export(
  $e2c0af47b6882e74$exports,
  'unescapeCodePoint',
  () => $e2c0af47b6882e74$export$bbcbd90d9a366220
)
$parcel$export(
  $e2c0af47b6882e74$exports,
  'unexpectedObjToString',
  () => $e2c0af47b6882e74$export$81c9cb19ca23770e
)
$parcel$export(
  $e2c0af47b6882e74$exports,
  'checkNotNull',
  () => $e2c0af47b6882e74$export$bae73f3645afb2fd
)
// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------
// Helpers
const $e2c0af47b6882e74$var$escapeStringFor = {}
for (let c = 0; c < 128; c++) { $e2c0af47b6882e74$var$escapeStringFor[c] = String.fromCharCode(c) }
$e2c0af47b6882e74$var$escapeStringFor["'".charCodeAt(0)] = "\\'"
$e2c0af47b6882e74$var$escapeStringFor['"'.charCodeAt(0)] = '\\"'
$e2c0af47b6882e74$var$escapeStringFor['\\'.charCodeAt(0)] = '\\\\'
$e2c0af47b6882e74$var$escapeStringFor['\b'.charCodeAt(0)] = '\\b'
$e2c0af47b6882e74$var$escapeStringFor['\f'.charCodeAt(0)] = '\\f'
$e2c0af47b6882e74$var$escapeStringFor['\n'.charCodeAt(0)] = '\\n'
$e2c0af47b6882e74$var$escapeStringFor['\r'.charCodeAt(0)] = '\\r'
$e2c0af47b6882e74$var$escapeStringFor['\t'.charCodeAt(0)] = '\\t'
$e2c0af47b6882e74$var$escapeStringFor['\u000b'.charCodeAt(0)] = '\\v'
function $e2c0af47b6882e74$export$817eb92a8194bab0 (optMethodName) {
  const methodName = optMethodName || ''
  return function () {
    throw new Error(
      'this method ' +
        methodName +
        ' is abstract! ' +
        '(it has no implementation in class ' +
        this.constructor.name +
        ')'
    )
  }
}
function $e2c0af47b6882e74$export$a7a9523472993e97 (cond, message) {
  if (!cond) throw new Error(message || 'Assertion failed')
}
function $e2c0af47b6882e74$export$1eb31d8ccbbbc638 (obj, propName, getterFn) {
  let memo
  Object.defineProperty(obj, propName, {
    get () {
      if (!memo) memo = getterFn.call(this)
      return memo
    }
  })
}
function $e2c0af47b6882e74$export$9cd59f9826255e47 (obj) {
  if (obj) return Object.assign({}, obj)
  return obj
}
function $e2c0af47b6882e74$export$8f8128772e09cd81 (fn, n) {
  const arr = []
  while (n-- > 0) arr.push(fn())
  return arr
}
function $e2c0af47b6882e74$export$d6a6a8e48e4bad63 (str, n) {
  return new Array(n + 1).join(str)
}
function $e2c0af47b6882e74$export$76d90c956114f2c2 (x, n) {
  return $e2c0af47b6882e74$export$8f8128772e09cd81(() => x, n)
}
function $e2c0af47b6882e74$export$1a47093b60e54e96 (array) {
  const duplicates = []
  for (let idx = 0; idx < array.length; idx++) {
    const x = array[idx]
    if (array.lastIndexOf(x) !== idx && duplicates.indexOf(x) < 0) { duplicates.push(x) }
  }
  return duplicates
}
function $e2c0af47b6882e74$export$8c70279880500ad3 (array) {
  const noDuplicates = []
  array.forEach((entry) => {
    if (noDuplicates.indexOf(entry) < 0) noDuplicates.push(entry)
  })
  return noDuplicates
}
function $e2c0af47b6882e74$export$41fdc1de1da6ab9b (ruleName) {
  const firstChar = ruleName[0]
  return firstChar === firstChar.toUpperCase()
}
function $e2c0af47b6882e74$export$f9f4599cdf73f828 (ruleName) {
  return !$e2c0af47b6882e74$export$41fdc1de1da6ab9b(ruleName)
}
function $e2c0af47b6882e74$export$bc3bea8325045070 (str, len, optChar) {
  const ch = optChar || ' '
  if (str.length < len) {
    return (
      $e2c0af47b6882e74$export$d6a6a8e48e4bad63(ch, len - str.length) + str
    )
  }
  return str
}
function $e2c0af47b6882e74$export$83347051c3437dc9 () {
  this.strings = []
}
$e2c0af47b6882e74$export$83347051c3437dc9.prototype.append = function (str) {
  this.strings.push(str)
}
$e2c0af47b6882e74$export$83347051c3437dc9.prototype.contents = function () {
  return this.strings.join('')
}
const $e2c0af47b6882e74$var$escapeUnicode = (str) =>
  String.fromCodePoint(parseInt(str, 16))
function $e2c0af47b6882e74$export$bbcbd90d9a366220 (s) {
  if (s.charAt(0) === '\\') {
    switch (s.charAt(1)) {
      case 'b':
        return '\b'
      case 'f':
        return '\f'
      case 'n':
        return '\n'
      case 'r':
        return '\r'
      case 't':
        return '\t'
      case 'v':
        return '\v'
      case 'x':
        return $e2c0af47b6882e74$var$escapeUnicode(s.slice(2, 4))
      case 'u':
        return s.charAt(2) === '{'
          ? $e2c0af47b6882e74$var$escapeUnicode(s.slice(3, -1))
          : $e2c0af47b6882e74$var$escapeUnicode(s.slice(2, 6))
      default:
        return s.charAt(1)
    }
  } else return s
}
function $e2c0af47b6882e74$export$81c9cb19ca23770e (obj) {
  if (obj == null) return String(obj)
  const baseToString = Object.prototype.toString.call(obj)
  try {
    let typeName
    if (obj.constructor && obj.constructor.name) { typeName = obj.constructor.name } else if (baseToString.indexOf('[object ') === 0) { typeName = baseToString.slice(8, -1) } // Extract e.g. "Array" from "[object Array]".
    else typeName = typeof obj
    return typeName + ': ' + JSON.stringify(String(obj))
  } catch {
    return baseToString
  }
}
function $e2c0af47b6882e74$export$bae73f3645afb2fd (
  obj,
  message = 'unexpected null value'
) {
  if (obj == null) throw new Error(message)
  return obj
}

// The full list of categories from:
// https://www.unicode.org/Public/UCD/latest/ucd/extracted/DerivedGeneralCategory.txt.
const $74c786741626432e$var$toRegExp = (val) =>
  new RegExp(String.raw`\p{${val}}`, 'u')
const $74c786741626432e$export$e33954a138fbcec0 = Object.fromEntries(
  [
    'Cc',
    'Cf',
    'Cn',
    'Co',
    'Cs',
    'Ll',
    'Lm',
    'Lo',
    'Lt',
    'Lu',
    'Mc',
    'Me',
    'Mn',
    'Nd',
    'Nl',
    'No',
    'Pc',
    'Pd',
    'Pe',
    'Pf',
    'Pi',
    'Po',
    'Ps',
    'Sc',
    'Sk',
    'Sm',
    'So',
    'Zl',
    'Zp',
    'Zs'
  ].map((cat) => [cat, $74c786741626432e$var$toRegExp(cat)])
)
$74c786741626432e$export$e33954a138fbcec0.Ltmo = /\p{Lt}|\p{Lm}|\p{Lo}/u
const $74c786741626432e$export$cab2ad3970d24e63 = Object.fromEntries(
  ['XID_Start', 'XID_Continue', 'White_Space'].map((prop) => [
    prop,
    $74c786741626432e$var$toRegExp(prop)
  ])
)

class $b477363445c611b4$export$f1bb6ea3bbab87ba {
  constructor () {
    if (this.constructor === $b477363445c611b4$export$f1bb6ea3bbab87ba) { throw new Error("PExpr cannot be instantiated -- it's abstract") }
  }

  // Set the `source` property to the interval containing the source for this expression.
  withSource (interval) {
    if (interval) this.source = interval.trimmed()
    return this
  }
}
const $b477363445c611b4$export$4154a199d7d90455 = Object.create(
  $b477363445c611b4$export$f1bb6ea3bbab87ba.prototype
)
const $b477363445c611b4$export$bd5df0f255a350f8 = Object.create(
  $b477363445c611b4$export$f1bb6ea3bbab87ba.prototype
)
class $b477363445c611b4$export$8dd80f06eb58bfe1 extends $b477363445c611b4$export$f1bb6ea3bbab87ba {
  constructor (obj) {
    super()
    this.obj = obj
  }
}
class $b477363445c611b4$export$9a58ef0d7ad3278c extends $b477363445c611b4$export$f1bb6ea3bbab87ba {
  constructor (from, to) {
    super()
    this.from = from
    this.to = to
    // If either `from` or `to` is made up of multiple code units, then
    // the range should consume a full code point, not a single code unit.
    this.matchCodePoint = from.length > 1 || to.length > 1
  }
}
class $b477363445c611b4$export$1ca45c9a47aec42c extends $b477363445c611b4$export$f1bb6ea3bbab87ba {
  constructor (index) {
    super()
    this.index = index
  }
}
class $b477363445c611b4$export$25ba4469a069167 extends $b477363445c611b4$export$f1bb6ea3bbab87ba {
  constructor (terms) {
    super()
    this.terms = terms
  }
}
class $b477363445c611b4$export$5b5dd0e212d2a5bc extends $b477363445c611b4$export$25ba4469a069167 {
  constructor (superGrammar, name, body) {
    const origBody = superGrammar.rules[name].body
    super([body, origBody])
    this.superGrammar = superGrammar
    this.name = name
    this.body = body
  }
}
class $b477363445c611b4$export$ceb3ee475cfd64d1 extends $b477363445c611b4$export$25ba4469a069167 {
  constructor (superGrammar, ruleName, beforeTerms, afterTerms) {
    const origBody = superGrammar.rules[ruleName].body
    super([...beforeTerms, origBody, ...afterTerms])
    this.superGrammar = superGrammar
    this.ruleName = ruleName
    this.expansionPos = beforeTerms.length
  }
}
class $b477363445c611b4$export$4802c350533dc67e extends $b477363445c611b4$export$f1bb6ea3bbab87ba {
  constructor (factors) {
    super()
    this.factors = factors
  }
}
class $b477363445c611b4$export$ffbe1b4f1e592c3a extends $b477363445c611b4$export$f1bb6ea3bbab87ba {
  constructor (expr) {
    super()
    this.expr = expr
  }
}
class $b477363445c611b4$export$1644ba17714857f1 extends $b477363445c611b4$export$ffbe1b4f1e592c3a {}
class $b477363445c611b4$export$2d9ac7aa84f97a08 extends $b477363445c611b4$export$ffbe1b4f1e592c3a {}
class $b477363445c611b4$export$a76800b3cc430f35 extends $b477363445c611b4$export$ffbe1b4f1e592c3a {}
$b477363445c611b4$export$1644ba17714857f1.prototype.operator = '*'
$b477363445c611b4$export$2d9ac7aa84f97a08.prototype.operator = '+'
$b477363445c611b4$export$a76800b3cc430f35.prototype.operator = '?'
$b477363445c611b4$export$1644ba17714857f1.prototype.minNumMatches = 0
$b477363445c611b4$export$2d9ac7aa84f97a08.prototype.minNumMatches = 1
$b477363445c611b4$export$a76800b3cc430f35.prototype.minNumMatches = 0
$b477363445c611b4$export$1644ba17714857f1.prototype.maxNumMatches =
  Number.POSITIVE_INFINITY
$b477363445c611b4$export$2d9ac7aa84f97a08.prototype.maxNumMatches =
  Number.POSITIVE_INFINITY
$b477363445c611b4$export$a76800b3cc430f35.prototype.maxNumMatches = 1
class $b477363445c611b4$export$8c5a605c8776de77 extends $b477363445c611b4$export$f1bb6ea3bbab87ba {
  constructor (expr) {
    super()
    this.expr = expr
  }
}
class $b477363445c611b4$export$580268a9119fd710 extends $b477363445c611b4$export$f1bb6ea3bbab87ba {
  constructor (expr) {
    super()
    this.expr = expr
  }
}
class $b477363445c611b4$export$43a76c134e83307c extends $b477363445c611b4$export$f1bb6ea3bbab87ba {
  constructor (expr) {
    super()
    this.expr = expr
  }
}
class $b477363445c611b4$export$efc21ddc6aeb363d extends $b477363445c611b4$export$f1bb6ea3bbab87ba {
  constructor (ruleName, args = []) {
    super()
    this.ruleName = ruleName
    this.args = args
  }

  isSyntactic () {
    return $e2c0af47b6882e74$export$41fdc1de1da6ab9b(this.ruleName)
  }

  // This method just caches the result of `this.toString()` in a non-enumerable property.
  toMemoKey () {
    if (!this._memoKey) {
      Object.defineProperty(this, '_memoKey', {
        value: this.toString()
      })
    }
    return this._memoKey
  }
}
class $b477363445c611b4$export$82f2f2b3ec52904 extends $b477363445c611b4$export$f1bb6ea3bbab87ba {
  constructor (categoryOrProp) {
    super()
    this.categoryOrProp = categoryOrProp
    if (categoryOrProp in (0, $74c786741626432e$export$e33954a138fbcec0)) {
      this.pattern = (0, $74c786741626432e$export$e33954a138fbcec0)[
        categoryOrProp
      ]
    } else if (categoryOrProp in (0, $74c786741626432e$export$cab2ad3970d24e63)) {
      this.pattern = (0, $74c786741626432e$export$cab2ad3970d24e63)[
        categoryOrProp
      ]
    } else {
      throw new Error(
        `Invalid Unicode category or property name: ${JSON.stringify(categoryOrProp)}`
      )
    }
  }
}

function $a0b00490599d0190$export$c8c8fcba3f9476cc (message, optInterval) {
  let e
  if (optInterval) {
    e = new Error(optInterval.getLineAndColumnMessage() + message)
    e.shortMessage = message
    e.interval = optInterval
  } else e = new Error(message)
  return e
}
function $a0b00490599d0190$export$68dc3f53d11d8b67 () {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    "Interval sources don't match"
  )
}
function $a0b00490599d0190$export$aa4e38829b7a0199 (matchFailure) {
  const e = new Error()
  Object.defineProperty(e, 'message', {
    enumerable: true,
    get () {
      return matchFailure.message
    }
  })
  Object.defineProperty(e, 'shortMessage', {
    enumerable: true,
    get () {
      return 'Expected ' + matchFailure.getExpectedText()
    }
  })
  e.interval = matchFailure.getInterval()
  return e
}
function $a0b00490599d0190$export$851b7305dcf6b4fb (
  grammarName,
  namespace,
  interval
) {
  const message = namespace
    ? `Grammar ${grammarName} is not declared in namespace '${namespace}'`
    : 'Undeclared grammar ' + grammarName
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(message, interval)
}
function $a0b00490599d0190$export$211c0e3ff69bb868 (grammar, namespace) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    'Grammar ' + grammar.name + ' is already declared in this namespace'
  )
}
function $a0b00490599d0190$export$31c51bb6bc9944eb (grammar) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    `Grammar '${grammar.name}' does not support incremental parsing`
  )
}
function $a0b00490599d0190$export$236a821bc395e911 (
  ruleName,
  grammarName,
  optInterval
) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    'Rule ' + ruleName + ' is not declared in grammar ' + grammarName,
    optInterval
  )
}
function $a0b00490599d0190$export$1e0aabfcd98d36cb (
  ruleName,
  grammarName,
  optSource
) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    'Cannot override rule ' +
      ruleName +
      ' because it is not declared in ' +
      grammarName,
    optSource
  )
}
function $a0b00490599d0190$export$d6f61fa3efbad9d1 (
  ruleName,
  grammarName,
  optSource
) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    'Cannot extend rule ' +
      ruleName +
      ' because it is not declared in ' +
      grammarName,
    optSource
  )
}
function $a0b00490599d0190$export$9bfb44bf175cf0b5 (
  ruleName,
  grammarName,
  declGrammarName,
  optSource
) {
  let message =
    "Duplicate declaration for rule '" +
    ruleName +
    "' in grammar '" +
    grammarName +
    "'"
  if (grammarName !== declGrammarName) { message += " (originally declared in '" + declGrammarName + "')" }
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(message, optSource)
}
function $a0b00490599d0190$export$2cb7f8a72c9f798b (
  ruleName,
  expected,
  actual,
  source
) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    'Wrong number of parameters for rule ' +
      ruleName +
      ' (expected ' +
      expected +
      ', got ' +
      actual +
      ')',
    source
  )
}
function $a0b00490599d0190$export$db93ea0a5f667d85 (
  ruleName,
  expected,
  actual,
  expr
) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    'Wrong number of arguments for rule ' +
      ruleName +
      ' (expected ' +
      expected +
      ', got ' +
      actual +
      ')',
    expr
  )
}
function $a0b00490599d0190$export$7060ae4b85bc6c61 (
  ruleName,
  duplicates,
  source
) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    'Duplicate parameter names in rule ' +
      ruleName +
      ': ' +
      duplicates.join(', '),
    source
  )
}
function $a0b00490599d0190$export$4765636db8d9fa0d (ruleName, expr) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    'Invalid parameter to rule ' +
      ruleName +
      ': ' +
      expr +
      ' has arity ' +
      expr.getArity() +
      ', but parameter expressions must have arity 1',
    expr.source
  )
}
// Application of syntactic rule from lexical rule
const $a0b00490599d0190$var$syntacticVsLexicalNote =
  'NOTE: A _syntactic rule_ is a rule whose name begins with a capital letter. See https://ohmjs.org/d/svl for more details.'
function $a0b00490599d0190$export$3a1a59318109f6db (ruleName, applyExpr) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    'Cannot apply syntactic rule ' +
      ruleName +
      ' from here (inside a lexical context)',
    applyExpr.source
  )
}
function $a0b00490599d0190$export$75459b41d402b976 (applyExpr) {
  const { ruleName } = applyExpr
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    `applySyntactic is for syntactic rules, but '${ruleName}' is a lexical rule. ` +
      $a0b00490599d0190$var$syntacticVsLexicalNote,
    applyExpr.source
  )
}
function $a0b00490599d0190$export$24e1d8383f2e12bf (applyExpr) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    'applySyntactic is not required here (in a syntactic context)',
    applyExpr.source
  )
}
function $a0b00490599d0190$export$7caadacba53a21e6 (expectedType, expr) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    'Incorrect argument type: expected ' + expectedType,
    expr.source
  )
}
function $a0b00490599d0190$export$21a2fba0ab980a76 (expr) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    "'...' can appear at most once in a rule body",
    expr.source
  )
}
function $a0b00490599d0190$export$fcc474965e836039 (applyWrapper) {
  const node = applyWrapper._node;
  (0, $e2c0af47b6882e74$export$a7a9523472993e97)(
    node &&
      node.isNonterminal() &&
      node.ctorName === 'escapeChar_unicodeCodePoint'
  )
  // Get an interval that covers all of the hex digits.
  const digitIntervals = applyWrapper.children
    .slice(1, -1)
    .map((d) => d.source)
  const fullInterval = digitIntervals[0].coverageWith(
    ...digitIntervals.slice(1)
  )
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    `U+${fullInterval.contents} is not a valid Unicode code point`,
    fullInterval
  )
}
function $a0b00490599d0190$export$e762ece12d580fc1 (
  kleeneExpr,
  applicationStack
) {
  const actuals =
    applicationStack.length > 0
      ? applicationStack[applicationStack.length - 1].args
      : []
  const expr = kleeneExpr.expr.substituteParams(actuals)
  let message =
    'Nullable expression ' +
    expr +
    " is not allowed inside '" +
    kleeneExpr.operator +
    "' (possible infinite loop)"
  if (applicationStack.length > 0) {
    const stackTrace = applicationStack
      .map(
        (app) =>
          new $b477363445c611b4$export$efc21ddc6aeb363d(app.ruleName, app.args)
      )
      .join('\n')
    message +=
      '\nApplication stack (most recent application last):\n' + stackTrace
  }
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    message,
    kleeneExpr.expr.source
  )
}
function $a0b00490599d0190$export$bf2ec6b36c93abc4 (
  ruleName,
  expected,
  actual,
  expr
) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    'Rule ' +
      ruleName +
      ' involves an alternation which has inconsistent arity ' +
      '(expected ' +
      expected +
      ', got ' +
      actual +
      ')',
    expr.source
  )
}
function $a0b00490599d0190$export$157ffe85f162c1fc (duplicates) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    'Object pattern has duplicate property names: ' + duplicates.join(', ')
  )
}
function $a0b00490599d0190$export$59a1170e7bf2bdbd (
  grammar,
  ctorName,
  children
) {
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    'Attempt to invoke constructor ' +
      ctorName +
      ' with invalid or unexpected arguments'
  )
}
function $a0b00490599d0190$export$ec0af2917eb15fe1 (errors) {
  const messages = errors.map((e) => e.message)
  return $a0b00490599d0190$export$c8c8fcba3f9476cc(
    ['Errors:'].concat(messages).join('\n- '),
    errors[0].interval
  )
}
function $a0b00490599d0190$export$1ce65c1570ed7bac (
  ctorName,
  name,
  type,
  stack
) {
  let stackTrace = stack
    .slice(0, -1)
    .map((info) => {
      const ans = '  ' + info[0].name + ' > ' + info[1]
      return info.length === 3 ? ans + " for '" + info[2] + "'" : ans
    })
    .join('\n')
  stackTrace += '\n  ' + name + ' > ' + ctorName
  let moreInfo = ''
  if (ctorName === '_iter') {
    moreInfo = [
      '\nNOTE: as of Ohm v16, there is no default action for iteration nodes \u2014 see ',
      '  https://ohmjs.org/d/dsa for details.'
    ].join('\n')
  }
  const message = [
    `Missing semantic action for '${ctorName}' in ${type} '${name}'.${moreInfo}`,
    'Action stack (most recent call last):',
    stackTrace
  ].join('\n')
  const e = $a0b00490599d0190$export$c8c8fcba3f9476cc(message)
  e.name = 'missingSemanticAction'
  return e
}
function $a0b00490599d0190$export$85b9972f25847cb (errors) {
  if (errors.length === 1) throw errors[0]
  if (errors.length > 1) { throw $a0b00490599d0190$export$ec0af2917eb15fe1(errors) }
}

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
// Given an array of numbers `arr`, return an array of the numbers as strings,
// right-justified and padded to the same length.
function $ceddbabc7a573b89$var$padNumbersToEqualLength (arr) {
  let maxLen = 0
  const strings = arr.map((n) => {
    const str = n.toString()
    maxLen = Math.max(maxLen, str.length)
    return str
  })
  return strings.map((s) => $e2c0af47b6882e74$exports.padLeft(s, maxLen))
}
// Produce a new string that would be the result of copying the contents
// of the string `src` onto `dest` at offset `offest`.
function $ceddbabc7a573b89$var$strcpy (dest, src, offset) {
  const origDestLen = dest.length
  const start = dest.slice(0, offset)
  const end = dest.slice(offset + src.length)
  return (start + src + end).substr(0, origDestLen)
}
// Casts the underlying lineAndCol object to a formatted message string,
// highlighting `ranges`.
function $ceddbabc7a573b89$var$lineAndColumnToMessage (...ranges) {
  const lineAndCol = this
  const { offset } = lineAndCol
  const { repeatStr } = $e2c0af47b6882e74$exports
  const sb = new $e2c0af47b6882e74$exports.StringBuffer()
  sb.append(
    'Line ' + lineAndCol.lineNum + ', col ' + lineAndCol.colNum + ':\n'
  )
  // An array of the previous, current, and next line numbers as strings of equal length.
  const lineNumbers = $ceddbabc7a573b89$var$padNumbersToEqualLength([
    lineAndCol.prevLine == null ? 0 : lineAndCol.lineNum - 1,
    lineAndCol.lineNum,
    lineAndCol.nextLine == null ? 0 : lineAndCol.lineNum + 1
  ])
  // Helper for appending formatting input lines to the buffer.
  const appendLine = (num, content, prefix) => {
    sb.append(prefix + lineNumbers[num] + ' | ' + content + '\n')
  }
  // Include the previous line for context if possible.
  if (lineAndCol.prevLine != null) appendLine(0, lineAndCol.prevLine, '  ')
  // Line that the error occurred on.
  appendLine(1, lineAndCol.line, '> ')
  // Build up the line that points to the offset and possible indicates one or more ranges.
  // Start with a blank line, and indicate each range by overlaying a string of `~` chars.
  const lineLen = lineAndCol.line.length
  let indicationLine = repeatStr(' ', lineLen + 1)
  for (let i = 0; i < ranges.length; ++i) {
    let startIdx = ranges[i][0]
    let endIdx = ranges[i][1]
    $e2c0af47b6882e74$exports.assert(
      startIdx >= 0 && startIdx <= endIdx,
      'range start must be >= 0 and <= end'
    )
    const lineStartOffset = offset - lineAndCol.colNum + 1
    startIdx = Math.max(0, startIdx - lineStartOffset)
    endIdx = Math.min(endIdx - lineStartOffset, lineLen)
    indicationLine = $ceddbabc7a573b89$var$strcpy(
      indicationLine,
      repeatStr('~', endIdx - startIdx),
      startIdx
    )
  }
  const gutterWidth = 2 + lineNumbers[1].length + 3
  sb.append(repeatStr(' ', gutterWidth))
  indicationLine = $ceddbabc7a573b89$var$strcpy(
    indicationLine,
    '^',
    lineAndCol.colNum - 1
  )
  sb.append(indicationLine.replace(/ +$/, '') + '\n')
  // Include the next line for context if possible.
  if (lineAndCol.nextLine != null) appendLine(2, lineAndCol.nextLine, '  ')
  return sb.contents()
}
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
let $ceddbabc7a573b89$var$builtInRulesCallbacks = []
function $ceddbabc7a573b89$export$1781a71bf0bc728d (cb) {
  $ceddbabc7a573b89$var$builtInRulesCallbacks.push(cb)
}
function $ceddbabc7a573b89$export$be176d47c2921f22 (grammar) {
  $ceddbabc7a573b89$var$builtInRulesCallbacks.forEach((cb) => {
    cb(grammar)
  })
  $ceddbabc7a573b89$var$builtInRulesCallbacks = null
}
function $ceddbabc7a573b89$export$e25e9b0111c8d659 (str, offset) {
  let lineNum = 1
  let colNum = 1
  let currOffset = 0
  let lineStartOffset = 0
  let nextLine = null
  let prevLine = null
  let prevLineStartOffset = -1
  while (currOffset < offset) {
    const c = str.charAt(currOffset++)
    if (c === '\n') {
      lineNum++
      colNum = 1
      prevLineStartOffset = lineStartOffset
      lineStartOffset = currOffset
    } else if (c !== '\r') colNum++
  }
  // Find the end of the target line.
  let lineEndOffset = str.indexOf('\n', lineStartOffset)
  if (lineEndOffset === -1) lineEndOffset = str.length
  else {
    // Get the next line.
    const nextLineEndOffset = str.indexOf('\n', lineEndOffset + 1)
    nextLine =
      nextLineEndOffset === -1
        ? str.slice(lineEndOffset)
        : str.slice(lineEndOffset, nextLineEndOffset)
    // Strip leading and trailing EOL char(s).
    nextLine = nextLine.replace(/^\r?\n/, '').replace(/\r$/, '')
  }
  // Get the previous line.
  if (prevLineStartOffset >= 0) // Strip trailing EOL char(s).
  {
    prevLine = str
      .slice(prevLineStartOffset, lineStartOffset)
      .replace(/\r?\n$/, '')
  }
  // Get the target line, stripping a trailing carriage return if necessary.
  const line = str.slice(lineStartOffset, lineEndOffset).replace(/\r$/, '')
  return {
    offset,
    lineNum,
    colNum,
    line,
    prevLine,
    nextLine,
    toString: $ceddbabc7a573b89$var$lineAndColumnToMessage
  }
}
function $ceddbabc7a573b89$export$c5fbb07c01caabdd (str, offset, ...ranges) {
  return $ceddbabc7a573b89$export$e25e9b0111c8d659(str, offset).toString(
    ...ranges
  )
}
const $ceddbabc7a573b89$export$8b15d37bc3f197d4 = (() => {
  let idCounter = 0
  return (prefix) => '' + prefix + idCounter++
})()

class $3db72bc0c30219de$export$e659c2681d58d45b {
  constructor (sourceString, startIdx, endIdx) {
    // Store the full source in a non-enumerable property, so that when
    // grammars and other objects are printed in the REPL, it's not
    // cluttered with multiple copies of the same long string.
    Object.defineProperty(this, '_sourceString', {
      value: sourceString,
      configurable: false,
      enumerable: false,
      writable: false
    })
    this.startIdx = startIdx
    this.endIdx = endIdx
  }

  get sourceString () {
    return this._sourceString
  }

  get contents () {
    if (this._contents === undefined) { this._contents = this.sourceString.slice(this.startIdx, this.endIdx) }
    return this._contents
  }

  get length () {
    return this.endIdx - this.startIdx
  }

  coverageWith (...intervals) {
    return $3db72bc0c30219de$export$e659c2681d58d45b.coverage(
      ...intervals,
      this
    )
  }

  collapsedLeft () {
    return new $3db72bc0c30219de$export$e659c2681d58d45b(
      this.sourceString,
      this.startIdx,
      this.startIdx
    )
  }

  collapsedRight () {
    return new $3db72bc0c30219de$export$e659c2681d58d45b(
      this.sourceString,
      this.endIdx,
      this.endIdx
    )
  }

  getLineAndColumn () {
    return $ceddbabc7a573b89$export$e25e9b0111c8d659(
      this.sourceString,
      this.startIdx
    )
  }

  getLineAndColumnMessage () {
    const range = [this.startIdx, this.endIdx]
    return $ceddbabc7a573b89$export$c5fbb07c01caabdd(
      this.sourceString,
      this.startIdx,
      range
    )
  }

  // Returns an array of 0, 1, or 2 intervals that represents the result of the
  // interval difference operation.
  minus (that) {
    if (this.sourceString !== that.sourceString) { throw $a0b00490599d0190$export$68dc3f53d11d8b67() } else if (
      this.startIdx === that.startIdx &&
      this.endIdx === that.endIdx
    ) // `this` and `that` are the same interval!
    {
      return []
    } else if (
      this.startIdx < that.startIdx &&
      that.endIdx < this.endIdx
    ) // `that` splits `this` into two intervals
    {
      return [
        new $3db72bc0c30219de$export$e659c2681d58d45b(
          this.sourceString,
          this.startIdx,
          that.startIdx
        ),
        new $3db72bc0c30219de$export$e659c2681d58d45b(
          this.sourceString,
          that.endIdx,
          this.endIdx
        )
      ]
    } else if (
      this.startIdx < that.endIdx &&
      that.endIdx < this.endIdx
    ) // `that` contains a prefix of `this`
    {
      return [
        new $3db72bc0c30219de$export$e659c2681d58d45b(
          this.sourceString,
          that.endIdx,
          this.endIdx
        )
      ]
    } else if (
      this.startIdx < that.startIdx &&
      that.startIdx < this.endIdx
    ) // `that` contains a suffix of `this`
    {
      return [
        new $3db72bc0c30219de$export$e659c2681d58d45b(
          this.sourceString,
          this.startIdx,
          that.startIdx
        )
      ]
    } else // `that` and `this` do not overlap
    {
      return [this]
    }
  }

  // Returns a new Interval that has the same extent as this one, but which is relative
  // to `that`, an Interval that fully covers this one.
  relativeTo (that) {
    if (this.sourceString !== that.sourceString) { throw $a0b00490599d0190$export$68dc3f53d11d8b67() }
    (0, $e2c0af47b6882e74$export$a7a9523472993e97)(
      this.startIdx >= that.startIdx && this.endIdx <= that.endIdx,
      'other interval does not cover this one'
    )
    return new $3db72bc0c30219de$export$e659c2681d58d45b(
      this.sourceString,
      this.startIdx - that.startIdx,
      this.endIdx - that.startIdx
    )
  }

  // Returns a new Interval which contains the same contents as this one,
  // but with whitespace trimmed from both ends.
  trimmed () {
    const { contents } = this
    const startIdx = this.startIdx + contents.match(/^\s*/)[0].length
    const endIdx = this.endIdx - contents.match(/\s*$/)[0].length
    return new $3db72bc0c30219de$export$e659c2681d58d45b(
      this.sourceString,
      startIdx,
      endIdx
    )
  }

  subInterval (offset, len) {
    const newStartIdx = this.startIdx + offset
    return new $3db72bc0c30219de$export$e659c2681d58d45b(
      this.sourceString,
      newStartIdx,
      newStartIdx + len
    )
  }
}
$3db72bc0c30219de$export$e659c2681d58d45b.coverage = function (
  firstInterval,
  ...intervals
) {
  let { startIdx, endIdx } = firstInterval
  for (const interval of intervals) {
    if (interval.sourceString !== firstInterval.sourceString) { throw $a0b00490599d0190$export$68dc3f53d11d8b67() } else {
      startIdx = Math.min(startIdx, interval.startIdx)
      endIdx = Math.max(endIdx, interval.endIdx)
    }
  }
  return new $3db72bc0c30219de$export$e659c2681d58d45b(
    firstInterval.sourceString,
    startIdx,
    endIdx
  )
}

const $304351f7f091c097$var$MAX_CHAR_CODE = 0xffff
const $304351f7f091c097$export$fa8d654f18234ae6 = 0x10ffff
class $304351f7f091c097$export$f22294a9362415e4 {
  constructor (source) {
    this.source = source
    this.pos = 0
    this.examinedLength = 0
  }

  atEnd () {
    const ans = this.pos >= this.source.length
    this.examinedLength = Math.max(this.examinedLength, this.pos + 1)
    return ans
  }

  next () {
    const ans = this.source[this.pos++]
    this.examinedLength = Math.max(this.examinedLength, this.pos)
    return ans
  }

  nextCharCode () {
    const nextChar = this.next()
    return nextChar && nextChar.charCodeAt(0)
  }

  nextCodePoint () {
    const cp = this.source.slice(this.pos++).codePointAt(0)
    // If the code point is beyond plane 0, it takes up two characters.
    if (cp > $304351f7f091c097$var$MAX_CHAR_CODE) this.pos += 1
    this.examinedLength = Math.max(this.examinedLength, this.pos)
    return cp
  }

  matchString (s, optIgnoreCase) {
    let idx
    if (optIgnoreCase) {
      /*
        Case-insensitive comparison is a tricky business. Some notable gotchas include the
        "Turkish I" problem (http://www.i18nguy.com/unicode/turkish-i18n.html) and the fact
        that the German Esszet (ß) turns into "SS" in upper case.

        This is intended to be a locale-invariant comparison, which means it may not obey
        locale-specific expectations (e.g. "i" => "İ").

        See also https://unicode.org/faq/casemap_charprop.html#casemap
       */ for (idx = 0; idx < s.length; idx++) {
        const actual = this.next()
        const expected = s[idx]
        if (actual == null || actual.toUpperCase() !== expected.toUpperCase()) { return false }
      }
      return true
    }
    // Default is case-sensitive comparison.
    for (idx = 0; idx < s.length; idx++) {
      if (this.next() !== s[idx]) return false
    }
    return true
  }

  sourceSlice (startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx)
  }

  interval (startIdx, optEndIdx) {
    return new (0, $3db72bc0c30219de$export$e659c2681d58d45b)(
      this.source,
      startIdx,
      optEndIdx || this.pos
    )
  }
}

class $b22cd105760b2b49$export$4fb32c2662f214d4 {
  constructor (
    matcher,
    input,
    startExpr,
    cst,
    cstOffset,
    rightmostFailurePosition,
    optRecordedFailures
  ) {
    this.matcher = matcher
    this.input = input
    this.startExpr = startExpr
    this._cst = cst
    this._cstOffset = cstOffset
    this._rightmostFailurePosition = rightmostFailurePosition
    this._rightmostFailures = optRecordedFailures
    if (this.failed()) {
      $e2c0af47b6882e74$export$1eb31d8ccbbbc638(this, 'message', function () {
        const detail = 'Expected ' + this.getExpectedText()
        return (
          $ceddbabc7a573b89$export$c5fbb07c01caabdd(
            this.input,
            this.getRightmostFailurePosition()
          ) + detail
        )
      })
      $e2c0af47b6882e74$export$1eb31d8ccbbbc638(
        this,
        'shortMessage',
        function () {
          const detail = 'expected ' + this.getExpectedText()
          const errorInfo = $ceddbabc7a573b89$export$e25e9b0111c8d659(
            this.input,
            this.getRightmostFailurePosition()
          )
          return (
            'Line ' +
            errorInfo.lineNum +
            ', col ' +
            errorInfo.colNum +
            ': ' +
            detail
          )
        }
      )
    }
  }

  succeeded () {
    return !!this._cst
  }

  failed () {
    return !this.succeeded()
  }

  getRightmostFailurePosition () {
    return this._rightmostFailurePosition
  }

  getRightmostFailures () {
    if (!this._rightmostFailures) {
      this.matcher.setInput(this.input)
      const matchResultWithFailures = this.matcher._match(this.startExpr, {
        tracing: false,
        positionToRecordFailures: this.getRightmostFailurePosition()
      })
      this._rightmostFailures = matchResultWithFailures.getRightmostFailures()
    }
    return this._rightmostFailures
  }

  toString () {
    return this.succeeded()
      ? '[match succeeded]'
      : '[match failed at position ' + this.getRightmostFailurePosition() + ']'
  }

  // Return a string summarizing the expected contents of the input stream when
  // the match failure occurred.
  getExpectedText () {
    if (this.succeeded()) { throw new Error('cannot get expected text of a successful MatchResult') }
    const sb = new $e2c0af47b6882e74$export$83347051c3437dc9()
    let failures = this.getRightmostFailures()
    // Filter out the fluffy failures to make the default error messages more useful
    failures = failures.filter((failure) => !failure.isFluffy())
    for (let idx = 0; idx < failures.length; idx++) {
      if (idx > 0) {
        if (idx === failures.length - 1) { sb.append(failures.length > 2 ? ', or ' : ' or ') } else sb.append(', ')
      }
      sb.append(failures[idx].toString())
    }
    return sb.contents()
  }

  getInterval () {
    const pos = this.getRightmostFailurePosition()
    return new (0, $3db72bc0c30219de$export$e659c2681d58d45b)(
      this.input,
      pos,
      pos
    )
  }
}

class $0ef2abddc6aeb433$export$3f64ba660e699daf {
  constructor () {
    this.applicationMemoKeyStack = [] // active applications at this position
    this.memo = {}
    this.maxExaminedLength = 0
    this.maxRightmostFailureOffset = -1
    this.currentLeftRecursion = undefined
  }

  isActive (application) {
    return this.applicationMemoKeyStack.indexOf(application.toMemoKey()) >= 0
  }

  enter (application) {
    this.applicationMemoKeyStack.push(application.toMemoKey())
  }

  exit () {
    this.applicationMemoKeyStack.pop()
  }

  startLeftRecursion (headApplication, memoRec) {
    memoRec.isLeftRecursion = true
    memoRec.headApplication = headApplication
    memoRec.nextLeftRecursion = this.currentLeftRecursion
    this.currentLeftRecursion = memoRec
    const { applicationMemoKeyStack } = this
    const indexOfFirstInvolvedRule =
      applicationMemoKeyStack.indexOf(headApplication.toMemoKey()) + 1
    const involvedApplicationMemoKeys = applicationMemoKeyStack.slice(
      indexOfFirstInvolvedRule
    )
    memoRec.isInvolved = function (applicationMemoKey) {
      return involvedApplicationMemoKeys.indexOf(applicationMemoKey) >= 0
    }
    memoRec.updateInvolvedApplicationMemoKeys = function () {
      for (
        let idx = indexOfFirstInvolvedRule;
        idx < applicationMemoKeyStack.length;
        idx++
      ) {
        const applicationMemoKey = applicationMemoKeyStack[idx]
        if (!this.isInvolved(applicationMemoKey)) { involvedApplicationMemoKeys.push(applicationMemoKey) }
      }
    }
  }

  endLeftRecursion () {
    this.currentLeftRecursion = this.currentLeftRecursion.nextLeftRecursion
  }

  // Note: this method doesn't get called for the "head" of a left recursion -- for LR heads,
  // the memoized result (which starts out being a failure) is always used.
  shouldUseMemoizedResult (memoRec) {
    if (!memoRec.isLeftRecursion) return true
    const { applicationMemoKeyStack } = this
    for (let idx = 0; idx < applicationMemoKeyStack.length; idx++) {
      const applicationMemoKey = applicationMemoKeyStack[idx]
      if (memoRec.isInvolved(applicationMemoKey)) return false
    }
    return true
  }

  memoize (memoKey, memoRec) {
    this.memo[memoKey] = memoRec
    this.maxExaminedLength = Math.max(
      this.maxExaminedLength,
      memoRec.examinedLength
    )
    this.maxRightmostFailureOffset = Math.max(
      this.maxRightmostFailureOffset,
      memoRec.rightmostFailureOffset
    )
    return memoRec
  }

  clearObsoleteEntries (pos, invalidatedIdx) {
    if (
      pos + this.maxExaminedLength <=
      invalidatedIdx
    ) // Optimization: none of the rule applications that were memoized here examined the
    // interval of the input that changed, so nothing has to be invalidated.
    {
      return
    }
    const { memo } = this
    this.maxExaminedLength = 0
    this.maxRightmostFailureOffset = -1
    Object.keys(memo).forEach((k) => {
      const memoRec = memo[k]
      if (pos + memoRec.examinedLength > invalidatedIdx) delete memo[k]
      else {
        this.maxExaminedLength = Math.max(
          this.maxExaminedLength,
          memoRec.examinedLength
        )
        this.maxRightmostFailureOffset = Math.max(
          this.maxRightmostFailureOffset,
          memoRec.rightmostFailureOffset
        )
      }
    })
  }
}

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
// Unicode characters that are used in the `toString` output.
const $414ad3ef19e16be4$var$BALLOT_X = '\u2717'
const $414ad3ef19e16be4$var$CHECK_MARK = '\u2713'
const $414ad3ef19e16be4$var$DOT_OPERATOR = '\u22C5'
const $414ad3ef19e16be4$var$RIGHTWARDS_DOUBLE_ARROW = '\u21D2'
const $414ad3ef19e16be4$var$SYMBOL_FOR_HORIZONTAL_TABULATION = '\u2409'
const $414ad3ef19e16be4$var$SYMBOL_FOR_LINE_FEED = '\u240A'
const $414ad3ef19e16be4$var$SYMBOL_FOR_CARRIAGE_RETURN = '\u240D'
const $414ad3ef19e16be4$var$Flags = {
  succeeded: 1,
  isRootNode: 2,
  isImplicitSpaces: 4,
  isMemoized: 8,
  isHeadOfLeftRecursion: 16,
  terminatesLR: 32
}
function $414ad3ef19e16be4$var$spaces (n) {
  return $e2c0af47b6882e74$export$76d90c956114f2c2(' ', n).join('')
}
// Return a string representation of a portion of `input` at offset `pos`.
// The result will contain exactly `len` characters.
function $414ad3ef19e16be4$var$getInputExcerpt (input, pos, len) {
  const excerpt = $414ad3ef19e16be4$var$asEscapedString(
    input.slice(pos, pos + len)
  )
  // Pad the output if necessary.
  if (excerpt.length < len) {
    return (
      excerpt +
      $e2c0af47b6882e74$export$76d90c956114f2c2(' ', len - excerpt.length).join(
        ''
      )
    )
  }
  return excerpt
}
function $414ad3ef19e16be4$var$asEscapedString (obj) {
  if (
    typeof obj === 'string'
  ) // Replace non-printable characters with visible symbols.
  {
    return obj
      .replace(/ /g, $414ad3ef19e16be4$var$DOT_OPERATOR)
      .replace(/\t/g, $414ad3ef19e16be4$var$SYMBOL_FOR_HORIZONTAL_TABULATION)
      .replace(/\n/g, $414ad3ef19e16be4$var$SYMBOL_FOR_LINE_FEED)
      .replace(/\r/g, $414ad3ef19e16be4$var$SYMBOL_FOR_CARRIAGE_RETURN)
  }
  return String(obj)
}
class $414ad3ef19e16be4$export$78e1bea9036f120f {
  constructor (input, pos1, pos2, expr, succeeded, bindings, optChildren) {
    this.input = input
    this.pos = this.pos1 = pos1
    this.pos2 = pos2
    this.source = new (0, $3db72bc0c30219de$export$e659c2681d58d45b)(
      input,
      pos1,
      pos2
    )
    this.expr = expr
    this.bindings = bindings
    this.children = optChildren || []
    this.terminatingLREntry = null
    this._flags = succeeded ? $414ad3ef19e16be4$var$Flags.succeeded : 0
  }

  get displayString () {
    return this.expr.toDisplayString()
  }

  clone () {
    return this.cloneWithExpr(this.expr)
  }

  cloneWithExpr (expr) {
    const ans = new $414ad3ef19e16be4$export$78e1bea9036f120f(
      this.input,
      this.pos,
      this.pos2,
      expr,
      this.succeeded,
      this.bindings,
      this.children
    )
    ans.isHeadOfLeftRecursion = this.isHeadOfLeftRecursion
    ans.isImplicitSpaces = this.isImplicitSpaces
    ans.isMemoized = this.isMemoized
    ans.isRootNode = this.isRootNode
    ans.terminatesLR = this.terminatesLR
    ans.terminatingLREntry = this.terminatingLREntry
    return ans
  }

  // Record the trace information for the terminating condition of the LR loop.
  recordLRTermination (ruleBodyTrace, value) {
    this.terminatingLREntry = new $414ad3ef19e16be4$export$78e1bea9036f120f(
      this.input,
      this.pos,
      this.pos2,
      this.expr,
      false,
      [value],
      [ruleBodyTrace]
    )
    this.terminatingLREntry.terminatesLR = true
  }

  // Recursively traverse this trace node and all its descendents, calling a visitor function
  // for each node that is visited. If `vistorObjOrFn` is an object, then its 'enter' property
  // is a function to call before visiting the children of a node, and its 'exit' property is
  // a function to call afterwards. If `visitorObjOrFn` is a function, it represents the 'enter'
  // function.
  //
  // The functions are called with three arguments: the Trace node, its parent Trace, and a number
  // representing the depth of the node in the tree. (The root node has depth 0.) `optThisArg`, if
  // specified, is the value to use for `this` when executing the visitor functions.
  walk (visitorObjOrFn, optThisArg) {
    let visitor = visitorObjOrFn
    if (typeof visitor === 'function') {
      visitor = {
        enter: visitor
      }
    }
    function _walk (node, parent, depth) {
      let recurse = true
      if (visitor.enter) {
        if (
          visitor.enter.call(optThisArg, node, parent, depth) ===
          $414ad3ef19e16be4$export$78e1bea9036f120f.prototype.SKIP
        ) { recurse = false }
      }
      if (recurse) {
        node.children.forEach((child) => {
          _walk(child, node, depth + 1)
        })
        if (visitor.exit) visitor.exit.call(optThisArg, node, parent, depth)
      }
    }
    if (this.isRootNode) // Don't visit the root node itself, only its children.
    {
      this.children.forEach((c) => {
        _walk(c, null, 0)
      })
    } else _walk(this, null, 0)
  }

  // Return a string representation of the trace.
  // Sample:
  //     12⋅+⋅2⋅*⋅3 ✓ exp ⇒  "12"
  //     12⋅+⋅2⋅*⋅3   ✓ addExp (LR) ⇒  "12"
  //     12⋅+⋅2⋅*⋅3       ✗ addExp_plus
  toString () {
    const sb = new $e2c0af47b6882e74$export$83347051c3437dc9()
    this.walk((node, parent, depth) => {
      if (!node) return this.SKIP
      const ctorName = node.expr.constructor.name
      // Don't print anything for Alt nodes.
      if (ctorName === 'Alt') return
      sb.append(
        $414ad3ef19e16be4$var$getInputExcerpt(node.input, node.pos, 10) +
          $414ad3ef19e16be4$var$spaces(depth * 2 + 1)
      )
      sb.append(
        (node.succeeded
          ? $414ad3ef19e16be4$var$CHECK_MARK
          : $414ad3ef19e16be4$var$BALLOT_X) +
          ' ' +
          node.displayString
      )
      if (node.isHeadOfLeftRecursion) sb.append(' (LR)')
      if (node.succeeded) {
        const contents = $414ad3ef19e16be4$var$asEscapedString(
          node.source.contents
        )
        sb.append(' ' + $414ad3ef19e16be4$var$RIGHTWARDS_DOUBLE_ARROW + '  ')
        sb.append(
          typeof contents === 'string' ? '"' + contents + '"' : contents
        )
      }
      sb.append('\n')
    })
    return sb.contents()
  }
}
// A value that can be returned from visitor functions to indicate that a
// node should not be recursed into.
$414ad3ef19e16be4$export$78e1bea9036f120f.prototype.SKIP = {}
// For convenience, create a getter and setter for the boolean flags in `Flags`.
Object.keys($414ad3ef19e16be4$var$Flags).forEach((name) => {
  const mask = $414ad3ef19e16be4$var$Flags[name]
  Object.defineProperty(
    $414ad3ef19e16be4$export$78e1bea9036f120f.prototype,
    name,
    {
      get () {
        return (this._flags & mask) !== 0
      },
      set (val) {
        if (val) this._flags |= mask
        else this._flags &= ~mask
      }
    }
  )
})

// --------------------------------------------------------------------
// Extensions
// --------------------------------------------------------------------

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
/*
  Return true if we should skip spaces preceding this expression in a syntactic context.
*/ $b477363445c611b4$export$f1bb6ea3bbab87ba.prototype.allowsSkippingPrecedingSpace =
  (0, $e2c0af47b6882e74$export$817eb92a8194bab0)(
    'allowsSkippingPrecedingSpace'
  )
/*
  Generally, these are all first-order expressions and (with the exception of Apply)
  directly read from the input stream.
*/ $b477363445c611b4$export$4154a199d7d90455.allowsSkippingPrecedingSpace =
  $b477363445c611b4$export$bd5df0f255a350f8.allowsSkippingPrecedingSpace =
  $b477363445c611b4$export$efc21ddc6aeb363d.prototype.allowsSkippingPrecedingSpace =
  $b477363445c611b4$export$8dd80f06eb58bfe1.prototype.allowsSkippingPrecedingSpace =
  $b477363445c611b4$export$9a58ef0d7ad3278c.prototype.allowsSkippingPrecedingSpace =
  $b477363445c611b4$export$82f2f2b3ec52904.prototype.allowsSkippingPrecedingSpace =
    function () {
      return true
    }
/*
  Higher-order expressions that don't directly consume input.
*/ $b477363445c611b4$export$25ba4469a069167.prototype.allowsSkippingPrecedingSpace =
  $b477363445c611b4$export$ffbe1b4f1e592c3a.prototype.allowsSkippingPrecedingSpace =
  $b477363445c611b4$export$43a76c134e83307c.prototype.allowsSkippingPrecedingSpace =
  $b477363445c611b4$export$580268a9119fd710.prototype.allowsSkippingPrecedingSpace =
  $b477363445c611b4$export$8c5a605c8776de77.prototype.allowsSkippingPrecedingSpace =
  $b477363445c611b4$export$1ca45c9a47aec42c.prototype.allowsSkippingPrecedingSpace =
  $b477363445c611b4$export$4802c350533dc67e.prototype.allowsSkippingPrecedingSpace =
    function () {
      return false
    }

let $7deeb689207d1422$var$BuiltInRules
$ceddbabc7a573b89$export$1781a71bf0bc728d((g) => {
  $7deeb689207d1422$var$BuiltInRules = g
})
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
let $7deeb689207d1422$var$lexifyCount
$b477363445c611b4$export$f1bb6ea3bbab87ba.prototype.assertAllApplicationsAreValid =
  function (ruleName, grammar) {
    $7deeb689207d1422$var$lexifyCount = 0
    this._assertAllApplicationsAreValid(ruleName, grammar)
  }
$b477363445c611b4$export$f1bb6ea3bbab87ba.prototype._assertAllApplicationsAreValid =
  (0, $e2c0af47b6882e74$export$817eb92a8194bab0)(
    '_assertAllApplicationsAreValid'
  )
$b477363445c611b4$export$4154a199d7d90455._assertAllApplicationsAreValid =
  $b477363445c611b4$export$bd5df0f255a350f8._assertAllApplicationsAreValid =
  $b477363445c611b4$export$8dd80f06eb58bfe1.prototype._assertAllApplicationsAreValid =
  $b477363445c611b4$export$9a58ef0d7ad3278c.prototype._assertAllApplicationsAreValid =
  $b477363445c611b4$export$1ca45c9a47aec42c.prototype._assertAllApplicationsAreValid =
  $b477363445c611b4$export$82f2f2b3ec52904.prototype._assertAllApplicationsAreValid =
    function (ruleName, grammar) {
      // no-op
    }
$b477363445c611b4$export$43a76c134e83307c.prototype._assertAllApplicationsAreValid =
  function (ruleName, grammar) {
    $7deeb689207d1422$var$lexifyCount++
    this.expr._assertAllApplicationsAreValid(ruleName, grammar)
    $7deeb689207d1422$var$lexifyCount--
  }
$b477363445c611b4$export$25ba4469a069167.prototype._assertAllApplicationsAreValid =
  function (ruleName, grammar) {
    for (let idx = 0; idx < this.terms.length; idx++) { this.terms[idx]._assertAllApplicationsAreValid(ruleName, grammar) }
  }
$b477363445c611b4$export$4802c350533dc67e.prototype._assertAllApplicationsAreValid =
  function (ruleName, grammar) {
    for (let idx = 0; idx < this.factors.length; idx++) { this.factors[idx]._assertAllApplicationsAreValid(ruleName, grammar) }
  }
$b477363445c611b4$export$ffbe1b4f1e592c3a.prototype._assertAllApplicationsAreValid =
  $b477363445c611b4$export$8c5a605c8776de77.prototype._assertAllApplicationsAreValid =
  $b477363445c611b4$export$580268a9119fd710.prototype._assertAllApplicationsAreValid =
    function (ruleName, grammar) {
      this.expr._assertAllApplicationsAreValid(ruleName, grammar)
    }
$b477363445c611b4$export$efc21ddc6aeb363d.prototype._assertAllApplicationsAreValid =
  function (ruleName, grammar, skipSyntacticCheck = false) {
    const ruleInfo = grammar.rules[this.ruleName]
    const isContextSyntactic =
      (0, $e2c0af47b6882e74$export$41fdc1de1da6ab9b)(ruleName) &&
      $7deeb689207d1422$var$lexifyCount === 0
    // Make sure that the rule exists...
    if (!ruleInfo) {
      throw $a0b00490599d0190$export$236a821bc395e911(
        this.ruleName,
        grammar.name,
        this.source
      )
    }
    // ...and that this application is allowed
    if (
      !skipSyntacticCheck &&
      (0, $e2c0af47b6882e74$export$41fdc1de1da6ab9b)(this.ruleName) &&
      !isContextSyntactic
    ) { throw $a0b00490599d0190$export$3a1a59318109f6db(this.ruleName, this) }
    // ...and that this application has the correct number of arguments.
    const actual = this.args.length
    const expected = ruleInfo.formals.length
    if (actual !== expected) {
      throw $a0b00490599d0190$export$db93ea0a5f667d85(
        this.ruleName,
        expected,
        actual,
        this.source
      )
    }
    const isBuiltInApplySyntactic =
      $7deeb689207d1422$var$BuiltInRules &&
      ruleInfo === $7deeb689207d1422$var$BuiltInRules.rules.applySyntactic
    const isBuiltInCaseInsensitive =
      $7deeb689207d1422$var$BuiltInRules &&
      ruleInfo === $7deeb689207d1422$var$BuiltInRules.rules.caseInsensitive
    // If it's an application of 'caseInsensitive', ensure that the argument is a Terminal.
    if (isBuiltInCaseInsensitive) {
      if (!(this.args[0] instanceof $b477363445c611b4$export$8dd80f06eb58bfe1)) {
        throw $a0b00490599d0190$export$7caadacba53a21e6(
          'a Terminal (e.g. "abc")',
          this.args[0]
        )
      }
    }
    if (isBuiltInApplySyntactic) {
      const arg = this.args[0]
      if (!(arg instanceof $b477363445c611b4$export$efc21ddc6aeb363d)) {
        throw $a0b00490599d0190$export$7caadacba53a21e6(
          'a syntactic rule application',
          arg
        )
      }
      if (!(0, $e2c0af47b6882e74$export$41fdc1de1da6ab9b)(arg.ruleName)) { throw $a0b00490599d0190$export$75459b41d402b976(arg) }
      if (isContextSyntactic) { throw $a0b00490599d0190$export$24e1d8383f2e12bf(this) }
    }
    // ...and that all of the argument expressions only have valid applications and have arity 1.
    // If `this` is an application of the built-in applySyntactic rule, then its arg is
    // allowed (and expected) to be a syntactic rule, even if we're in a lexical context.
    this.args.forEach((arg) => {
      arg._assertAllApplicationsAreValid(
        ruleName,
        grammar,
        isBuiltInApplySyntactic
      )
      if (arg.getArity() !== 1) { throw $a0b00490599d0190$export$4765636db8d9fa0d(this.ruleName, arg) }
    })
  }

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
$b477363445c611b4$export$f1bb6ea3bbab87ba.prototype.assertChoicesHaveUniformArity =
  (0, $e2c0af47b6882e74$export$817eb92a8194bab0)(
    'assertChoicesHaveUniformArity'
  )
$b477363445c611b4$export$4154a199d7d90455.assertChoicesHaveUniformArity =
  $b477363445c611b4$export$bd5df0f255a350f8.assertChoicesHaveUniformArity =
  $b477363445c611b4$export$8dd80f06eb58bfe1.prototype.assertChoicesHaveUniformArity =
  $b477363445c611b4$export$9a58ef0d7ad3278c.prototype.assertChoicesHaveUniformArity =
  $b477363445c611b4$export$1ca45c9a47aec42c.prototype.assertChoicesHaveUniformArity =
  $b477363445c611b4$export$43a76c134e83307c.prototype.assertChoicesHaveUniformArity =
  $b477363445c611b4$export$82f2f2b3ec52904.prototype.assertChoicesHaveUniformArity =
    function (ruleName) {
      // no-op
    }
$b477363445c611b4$export$25ba4469a069167.prototype.assertChoicesHaveUniformArity =
  function (ruleName) {
    if (this.terms.length === 0) return
    const arity = this.terms[0].getArity()
    for (let idx = 0; idx < this.terms.length; idx++) {
      const term = this.terms[idx]
      term.assertChoicesHaveUniformArity()
      const otherArity = term.getArity()
      if (arity !== otherArity) {
        throw $a0b00490599d0190$export$bf2ec6b36c93abc4(
          ruleName,
          arity,
          otherArity,
          term
        )
      }
    }
  }
$b477363445c611b4$export$5b5dd0e212d2a5bc.prototype.assertChoicesHaveUniformArity =
  function (ruleName) {
    // Extend is a special case of Alt that's guaranteed to have exactly two
    // cases: [extensions, origBody].
    const actualArity = this.terms[0].getArity()
    const expectedArity = this.terms[1].getArity()
    if (actualArity !== expectedArity) {
      throw $a0b00490599d0190$export$bf2ec6b36c93abc4(
        ruleName,
        expectedArity,
        actualArity,
        this.terms[0]
      )
    }
  }
$b477363445c611b4$export$4802c350533dc67e.prototype.assertChoicesHaveUniformArity =
  function (ruleName) {
    for (let idx = 0; idx < this.factors.length; idx++) { this.factors[idx].assertChoicesHaveUniformArity(ruleName) }
  }
$b477363445c611b4$export$ffbe1b4f1e592c3a.prototype.assertChoicesHaveUniformArity =
  function (ruleName) {
    this.expr.assertChoicesHaveUniformArity(ruleName)
  }
$b477363445c611b4$export$8c5a605c8776de77.prototype.assertChoicesHaveUniformArity =
  function (ruleName) {
    // no-op (not required b/c the nested expr doesn't show up in the CST)
  }
$b477363445c611b4$export$580268a9119fd710.prototype.assertChoicesHaveUniformArity =
  function (ruleName) {
    this.expr.assertChoicesHaveUniformArity(ruleName)
  }
$b477363445c611b4$export$efc21ddc6aeb363d.prototype.assertChoicesHaveUniformArity =
  function (ruleName) {
    // The arities of the parameter expressions is required to be 1 by
    // `assertAllApplicationsAreValid()`.
  }

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
$b477363445c611b4$export$f1bb6ea3bbab87ba.prototype.assertIteratedExprsAreNotNullable =
  (0, $e2c0af47b6882e74$export$817eb92a8194bab0)(
    'assertIteratedExprsAreNotNullable'
  )
$b477363445c611b4$export$4154a199d7d90455.assertIteratedExprsAreNotNullable =
  $b477363445c611b4$export$bd5df0f255a350f8.assertIteratedExprsAreNotNullable =
  $b477363445c611b4$export$8dd80f06eb58bfe1.prototype.assertIteratedExprsAreNotNullable =
  $b477363445c611b4$export$9a58ef0d7ad3278c.prototype.assertIteratedExprsAreNotNullable =
  $b477363445c611b4$export$1ca45c9a47aec42c.prototype.assertIteratedExprsAreNotNullable =
  $b477363445c611b4$export$82f2f2b3ec52904.prototype.assertIteratedExprsAreNotNullable =
    function (grammar) {
      // no-op
    }
$b477363445c611b4$export$25ba4469a069167.prototype.assertIteratedExprsAreNotNullable =
  function (grammar) {
    for (let idx = 0; idx < this.terms.length; idx++) { this.terms[idx].assertIteratedExprsAreNotNullable(grammar) }
  }
$b477363445c611b4$export$4802c350533dc67e.prototype.assertIteratedExprsAreNotNullable =
  function (grammar) {
    for (let idx = 0; idx < this.factors.length; idx++) { this.factors[idx].assertIteratedExprsAreNotNullable(grammar) }
  }
$b477363445c611b4$export$ffbe1b4f1e592c3a.prototype.assertIteratedExprsAreNotNullable =
  function (grammar) {
    // Note: this is the implementation of this method for `Star` and `Plus` expressions.
    // It is overridden for `Opt` below.
    this.expr.assertIteratedExprsAreNotNullable(grammar)
    if (this.expr.isNullable(grammar)) { throw $a0b00490599d0190$export$e762ece12d580fc1(this, []) }
  }
$b477363445c611b4$export$a76800b3cc430f35.prototype.assertIteratedExprsAreNotNullable =
  $b477363445c611b4$export$8c5a605c8776de77.prototype.assertIteratedExprsAreNotNullable =
  $b477363445c611b4$export$580268a9119fd710.prototype.assertIteratedExprsAreNotNullable =
  $b477363445c611b4$export$43a76c134e83307c.prototype.assertIteratedExprsAreNotNullable =
    function (grammar) {
      this.expr.assertIteratedExprsAreNotNullable(grammar)
    }
$b477363445c611b4$export$efc21ddc6aeb363d.prototype.assertIteratedExprsAreNotNullable =
  function (grammar) {
    this.args.forEach((arg) => {
      arg.assertIteratedExprsAreNotNullable(grammar)
    })
  }

class $a8ee6022e9bbdc31$export$85c928794f8d04d4 {
  constructor (matchLength) {
    this.matchLength = matchLength
  }

  get ctorName () {
    throw new Error('subclass responsibility')
  }

  numChildren () {
    return this.children ? this.children.length : 0
  }

  childAt (idx) {
    if (this.children) return this.children[idx]
  }

  indexOfChild (arg) {
    return this.children.indexOf(arg)
  }

  hasChildren () {
    return this.numChildren() > 0
  }

  hasNoChildren () {
    return !this.hasChildren()
  }

  onlyChild () {
    if (this.numChildren() !== 1) {
      throw new Error(
        'cannot get only child of a node of type ' +
          this.ctorName +
          ' (it has ' +
          this.numChildren() +
          ' children)'
      )
    } else return this.firstChild()
  }

  firstChild () {
    if (this.hasNoChildren()) {
      throw new Error(
        'cannot get first child of a ' +
          this.ctorName +
          ' node, which has no children'
      )
    } else return this.childAt(0)
  }

  lastChild () {
    if (this.hasNoChildren()) {
      throw new Error(
        'cannot get last child of a ' +
          this.ctorName +
          ' node, which has no children'
      )
    } else return this.childAt(this.numChildren() - 1)
  }

  childBefore (child) {
    const childIdx = this.indexOfChild(child)
    if (childIdx < 0) {
      throw new Error(
        'Node.childBefore() called w/ an argument that is not a child'
      )
    } else if (childIdx === 0) { throw new Error('cannot get child before first child') } else return this.childAt(childIdx - 1)
  }

  childAfter (child) {
    const childIdx = this.indexOfChild(child)
    if (childIdx < 0) {
      throw new Error(
        'Node.childAfter() called w/ an argument that is not a child'
      )
    } else if (childIdx === this.numChildren() - 1) { throw new Error('cannot get child after last child') } else return this.childAt(childIdx + 1)
  }

  isTerminal () {
    return false
  }

  isNonterminal () {
    return false
  }

  isIteration () {
    return false
  }

  isOptional () {
    return false
  }
}
class $a8ee6022e9bbdc31$export$f6a002739fa43001 extends $a8ee6022e9bbdc31$export$85c928794f8d04d4 {
  get ctorName () {
    return '_terminal'
  }

  isTerminal () {
    return true
  }

  get primitiveValue () {
    throw new Error('The `primitiveValue` property was removed in Ohm v17.')
  }
}
class $a8ee6022e9bbdc31$export$4b0554e1f88185de extends $a8ee6022e9bbdc31$export$85c928794f8d04d4 {
  constructor (ruleName, children, childOffsets, matchLength) {
    super(matchLength)
    this.ruleName = ruleName
    this.children = children
    this.childOffsets = childOffsets
  }

  get ctorName () {
    return this.ruleName
  }

  isNonterminal () {
    return true
  }

  isLexical () {
    return $e2c0af47b6882e74$export$f9f4599cdf73f828(this.ctorName)
  }

  isSyntactic () {
    return $e2c0af47b6882e74$export$41fdc1de1da6ab9b(this.ctorName)
  }
}
class $a8ee6022e9bbdc31$export$ebfccf4095ba179 extends $a8ee6022e9bbdc31$export$85c928794f8d04d4 {
  constructor (children, childOffsets, matchLength, isOptional) {
    super(matchLength)
    this.children = children
    this.childOffsets = childOffsets
    this.optional = isOptional
  }

  get ctorName () {
    return '_iter'
  }

  isIteration () {
    return true
  }

  isOptional () {
    return this.optional
  }
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
/*
  Evaluate the expression and return `true` if it succeeds, `false` otherwise. This method should
  only be called directly by `State.prototype.eval(expr)`, which also updates the data structures
  that are used for tracing. (Making those updates in a method of `State` enables the trace-specific
  data structures to be "secrets" of that class, which is good for modularity.)

  The contract of this method is as follows:
  * When the return value is `true`,
    - the state object will have `expr.getArity()` more bindings than it did before the call.
  * When the return value is `false`,
    - the state object may have more bindings than it did before the call, and
    - its input stream's position may be anywhere.

  Note that `State.prototype.eval(expr)`, unlike this method, guarantees that neither the state
  object's bindings nor its input stream's position will change if the expression fails to match.
*/ $b477363445c611b4$export$f1bb6ea3bbab87ba.prototype.eval =
  $e2c0af47b6882e74$export$817eb92a8194bab0('eval') // function(state) { ... }
$b477363445c611b4$export$4154a199d7d90455.eval = function (state) {
  const { inputStream } = state
  const origPos = inputStream.pos
  const cp = inputStream.nextCodePoint()
  if (cp !== undefined) {
    state.pushBinding(
      new (0, $a8ee6022e9bbdc31$export$f6a002739fa43001)(
        String.fromCodePoint(cp).length
      ),
      origPos
    )
    return true
  } else {
    state.processFailure(origPos, this)
    return false
  }
}
$b477363445c611b4$export$bd5df0f255a350f8.eval = function (state) {
  const { inputStream } = state
  const origPos = inputStream.pos
  if (inputStream.atEnd()) {
    state.pushBinding(
      new (0, $a8ee6022e9bbdc31$export$f6a002739fa43001)(0),
      origPos
    )
    return true
  } else {
    state.processFailure(origPos, this)
    return false
  }
}
$b477363445c611b4$export$8dd80f06eb58bfe1.prototype.eval = function (state) {
  const { inputStream } = state
  const origPos = inputStream.pos
  if (!inputStream.matchString(this.obj)) {
    state.processFailure(origPos, this)
    return false
  } else {
    state.pushBinding(
      new (0, $a8ee6022e9bbdc31$export$f6a002739fa43001)(this.obj.length),
      origPos
    )
    return true
  }
}
$b477363445c611b4$export$9a58ef0d7ad3278c.prototype.eval = function (state) {
  const { inputStream } = state
  const origPos = inputStream.pos
  // A range can operate in one of two modes: matching a single, 16-bit _code unit_,
  // or matching a _code point_. (Code points over 0xFFFF take up two 16-bit code units.)
  const cp = this.matchCodePoint
    ? inputStream.nextCodePoint()
    : inputStream.nextCharCode()
  // Always compare by code point value to get the correct result in all scenarios.
  // Note that for strings of length 1, codePointAt(0) and charPointAt(0) are equivalent.
  if (
    cp !== undefined &&
    this.from.codePointAt(0) <= cp &&
    cp <= this.to.codePointAt(0)
  ) {
    state.pushBinding(
      new (0, $a8ee6022e9bbdc31$export$f6a002739fa43001)(
        String.fromCodePoint(cp).length
      ),
      origPos
    )
    return true
  } else {
    state.processFailure(origPos, this)
    return false
  }
}
$b477363445c611b4$export$1ca45c9a47aec42c.prototype.eval = function (state) {
  return state.eval(state.currentApplication().args[this.index])
}
$b477363445c611b4$export$43a76c134e83307c.prototype.eval = function (state) {
  state.enterLexifiedContext()
  const ans = state.eval(this.expr)
  state.exitLexifiedContext()
  return ans
}
$b477363445c611b4$export$25ba4469a069167.prototype.eval = function (state) {
  for (let idx = 0; idx < this.terms.length; idx++) {
    if (state.eval(this.terms[idx])) return true
  }
  return false
}
$b477363445c611b4$export$4802c350533dc67e.prototype.eval = function (state) {
  for (let idx = 0; idx < this.factors.length; idx++) {
    const factor = this.factors[idx]
    if (!state.eval(factor)) return false
  }
  return true
}
$b477363445c611b4$export$ffbe1b4f1e592c3a.prototype.eval = function (state) {
  const { inputStream } = state
  const origPos = inputStream.pos
  const arity = this.getArity()
  const cols = []
  const colOffsets = []
  while (cols.length < arity) {
    cols.push([])
    colOffsets.push([])
  }
  let numMatches = 0
  let prevPos = origPos
  let idx
  while (numMatches < this.maxNumMatches && state.eval(this.expr)) {
    if (inputStream.pos === prevPos) {
      throw $a0b00490599d0190$export$e762ece12d580fc1(
        this,
        state._applicationStack
      )
    }
    prevPos = inputStream.pos
    numMatches++
    const row = state._bindings.splice(state._bindings.length - arity, arity)
    const rowOffsets = state._bindingOffsets.splice(
      state._bindingOffsets.length - arity,
      arity
    )
    for (idx = 0; idx < row.length; idx++) {
      cols[idx].push(row[idx])
      colOffsets[idx].push(rowOffsets[idx])
    }
  }
  if (numMatches < this.minNumMatches) return false
  let offset = state.posToOffset(origPos)
  let matchLength = 0
  if (numMatches > 0) {
    const lastCol = cols[arity - 1]
    const lastColOffsets = colOffsets[arity - 1]
    const endOffset =
      lastColOffsets[lastColOffsets.length - 1] +
      lastCol[lastCol.length - 1].matchLength
    offset = colOffsets[0][0]
    matchLength = endOffset - offset
  }
  const isOptional = this instanceof $b477363445c611b4$export$a76800b3cc430f35
  for (idx = 0; idx < cols.length; idx++) {
    state._bindings.push(
      new (0, $a8ee6022e9bbdc31$export$ebfccf4095ba179)(
        cols[idx],
        colOffsets[idx],
        matchLength,
        isOptional
      )
    )
    state._bindingOffsets.push(offset)
  }
  return true
}
$b477363445c611b4$export$8c5a605c8776de77.prototype.eval = function (state) {
  /*
    TODO:
    - Right now we're just throwing away all of the failures that happen inside a `not`, and
      recording `this` as a failed expression.
    - Double negation should be equivalent to lookahead, but that's not the case right now wrt
      failures. E.g., ~~'foo' produces a failure for ~~'foo', but maybe it should produce
      a failure for 'foo' instead.
  */ const { inputStream } = state
  const origPos = inputStream.pos
  state.pushFailuresInfo()
  const ans = state.eval(this.expr)
  state.popFailuresInfo()
  if (ans) {
    state.processFailure(origPos, this)
    return false
  }
  inputStream.pos = origPos
  return true
}
$b477363445c611b4$export$580268a9119fd710.prototype.eval = function (state) {
  const { inputStream } = state
  const origPos = inputStream.pos
  if (state.eval(this.expr)) {
    inputStream.pos = origPos
    return true
  } else return false
}
$b477363445c611b4$export$efc21ddc6aeb363d.prototype.eval = function (state) {
  const caller = state.currentApplication()
  const actuals = caller ? caller.args : []
  const app = this.substituteParams(actuals)
  const posInfo = state.getCurrentPosInfo()
  if (
    posInfo.isActive(app)
  ) // This rule is already active at this position, i.e., it is left-recursive.
  {
    return app.handleCycle(state)
  }
  const memoKey = app.toMemoKey()
  const memoRec = posInfo.memo[memoKey]
  if (memoRec && posInfo.shouldUseMemoizedResult(memoRec)) {
    if (state.hasNecessaryInfo(memoRec)) { return state.useMemoizedResult(state.inputStream.pos, memoRec) }
    delete posInfo.memo[memoKey]
  }
  return app.reallyEval(state)
}
$b477363445c611b4$export$efc21ddc6aeb363d.prototype.handleCycle = function (
  state
) {
  const posInfo = state.getCurrentPosInfo()
  const { currentLeftRecursion } = posInfo
  const memoKey = this.toMemoKey()
  let memoRec = posInfo.memo[memoKey]
  if (
    currentLeftRecursion &&
    currentLeftRecursion.headApplication.toMemoKey() === memoKey
  ) // We already know about this left recursion, but it's possible there are "involved
  // applications" that we don't already know about, so...
  {
    memoRec.updateInvolvedApplicationMemoKeys()
  } else if (!memoRec) {
    // New left recursion detected! Memoize a failure to try to get a seed parse.
    memoRec = posInfo.memoize(memoKey, {
      matchLength: 0,
      examinedLength: 0,
      value: false,
      rightmostFailureOffset: -1
    })
    posInfo.startLeftRecursion(this, memoRec)
  }
  return state.useMemoizedResult(state.inputStream.pos, memoRec)
}
$b477363445c611b4$export$efc21ddc6aeb363d.prototype.reallyEval = function (
  state
) {
  const { inputStream } = state
  const origPos = inputStream.pos
  const origPosInfo = state.getCurrentPosInfo()
  const ruleInfo = state.grammar.rules[this.ruleName]
  const { body } = ruleInfo
  const { description } = ruleInfo
  state.enterApplication(origPosInfo, this)
  if (description) state.pushFailuresInfo()
  // Reset the input stream's examinedLength property so that we can track
  // the examined length of this particular application.
  const origInputStreamExaminedLength = inputStream.examinedLength
  inputStream.examinedLength = 0
  let value = this.evalOnce(body, state)
  const currentLR = origPosInfo.currentLeftRecursion
  const memoKey = this.toMemoKey()
  const isHeadOfLeftRecursion =
    currentLR && currentLR.headApplication.toMemoKey() === memoKey
  let memoRec
  if (state.doNotMemoize) state.doNotMemoize = false
  else if (isHeadOfLeftRecursion) {
    value = this.growSeedResult(body, state, origPos, currentLR, value)
    origPosInfo.endLeftRecursion()
    memoRec = currentLR
    memoRec.examinedLength = inputStream.examinedLength - origPos
    memoRec.rightmostFailureOffset = state._getRightmostFailureOffset()
    origPosInfo.memoize(memoKey, memoRec) // updates origPosInfo's maxExaminedLength
  } else if (
    !currentLR ||
    !currentLR.isInvolved(memoKey)
  ) // This application is not involved in left recursion, so it's ok to memoize it.
  {
    memoRec = origPosInfo.memoize(memoKey, {
      matchLength: inputStream.pos - origPos,
      examinedLength: inputStream.examinedLength - origPos,
      value,
      failuresAtRightmostPosition: state.cloneRecordedFailures(),
      rightmostFailureOffset: state._getRightmostFailureOffset()
    })
  }
  const succeeded = !!value
  if (description) {
    state.popFailuresInfo()
    if (!succeeded) state.processFailure(origPos, this)
    if (memoRec) {
      memoRec.failuresAtRightmostPosition = state.cloneRecordedFailures()
      memoRec.rightmostFailureOffset = state._getRightmostFailureOffset()
    }
  }
  // Record trace information in the memo table, so that it is available if the memoized result
  // is used later.
  if (state.isTracing() && memoRec) {
    const entry = state.getTraceEntry(
      origPos,
      this,
      succeeded,
      succeeded ? [value] : []
    )
    if (isHeadOfLeftRecursion) {
      $e2c0af47b6882e74$export$a7a9523472993e97(
        entry.terminatingLREntry != null || !succeeded
      )
      entry.isHeadOfLeftRecursion = true
    }
    memoRec.traceEntry = entry
  }
  // Fix the input stream's examinedLength -- it should be the maximum examined length
  // across all applications, not just this one.
  inputStream.examinedLength = Math.max(
    inputStream.examinedLength,
    origInputStreamExaminedLength
  )
  state.exitApplication(origPosInfo, value)
  return succeeded
}
$b477363445c611b4$export$efc21ddc6aeb363d.prototype.evalOnce = function (
  expr,
  state
) {
  const { inputStream } = state
  const origPos = inputStream.pos
  if (state.eval(expr)) {
    const arity = expr.getArity()
    const bindings = state._bindings.splice(
      state._bindings.length - arity,
      arity
    )
    const offsets = state._bindingOffsets.splice(
      state._bindingOffsets.length - arity,
      arity
    )
    const matchLength = inputStream.pos - origPos
    return new (0, $a8ee6022e9bbdc31$export$4b0554e1f88185de)(
      this.ruleName,
      bindings,
      offsets,
      matchLength
    )
  } else return false
}
$b477363445c611b4$export$efc21ddc6aeb363d.prototype.growSeedResult = function (
  body,
  state,
  origPos,
  lrMemoRec,
  newValue
) {
  if (!newValue) return false
  const { inputStream } = state
  while (true) {
    lrMemoRec.matchLength = inputStream.pos - origPos
    lrMemoRec.value = newValue
    lrMemoRec.failuresAtRightmostPosition = state.cloneRecordedFailures()
    if (state.isTracing()) {
      // Before evaluating the body again, add a trace node for this application to the memo entry.
      // Its only child is a copy of the trace node from `newValue`, which will always be the last
      // element in `state.trace`.
      const seedTrace = state.trace[state.trace.length - 1]
      lrMemoRec.traceEntry = new (0, $414ad3ef19e16be4$export$78e1bea9036f120f)(
        state.input,
        origPos,
        inputStream.pos,
        this,
        true,
        [newValue],
        [seedTrace.clone()]
      )
    }
    inputStream.pos = origPos
    newValue = this.evalOnce(body, state)
    if (inputStream.pos - origPos <= lrMemoRec.matchLength) break
    if (state.isTracing()) state.trace.splice(-2, 1) // Drop the trace for the old seed.
  }
  if (
    state.isTracing()
  ) // The last entry is for an unused result -- pop it and save it in the "real" entry.
  {
    lrMemoRec.traceEntry.recordLRTermination(state.trace.pop(), newValue)
  }
  inputStream.pos = origPos + lrMemoRec.matchLength
  return lrMemoRec.value
}
$b477363445c611b4$export$82f2f2b3ec52904.prototype.eval = function (state) {
  const { inputStream } = state
  const origPos = inputStream.pos
  const cp = inputStream.nextCodePoint()
  if (
    cp !== undefined &&
    cp <= (0, $304351f7f091c097$export$fa8d654f18234ae6)
  ) {
    const ch = String.fromCodePoint(cp)
    if (this.pattern.test(ch)) {
      state.pushBinding(
        new (0, $a8ee6022e9bbdc31$export$f6a002739fa43001)(ch.length),
        origPos
      )
      return true
    }
  }
  state.processFailure(origPos, this)
  return false
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
$b477363445c611b4$export$f1bb6ea3bbab87ba.prototype.getArity = (0,
$e2c0af47b6882e74$export$817eb92a8194bab0)('getArity')
$b477363445c611b4$export$4154a199d7d90455.getArity =
  $b477363445c611b4$export$bd5df0f255a350f8.getArity =
  $b477363445c611b4$export$8dd80f06eb58bfe1.prototype.getArity =
  $b477363445c611b4$export$9a58ef0d7ad3278c.prototype.getArity =
  $b477363445c611b4$export$1ca45c9a47aec42c.prototype.getArity =
  $b477363445c611b4$export$efc21ddc6aeb363d.prototype.getArity =
  $b477363445c611b4$export$82f2f2b3ec52904.prototype.getArity =
    function () {
      return 1
    }
$b477363445c611b4$export$25ba4469a069167.prototype.getArity = function () {
  // This is ok b/c all terms must have the same arity -- this property is
  // checked by the Grammar constructor.
  return this.terms.length === 0 ? 0 : this.terms[0].getArity()
}
$b477363445c611b4$export$4802c350533dc67e.prototype.getArity = function () {
  let arity = 0
  for (let idx = 0; idx < this.factors.length; idx++) { arity += this.factors[idx].getArity() }
  return arity
}
$b477363445c611b4$export$ffbe1b4f1e592c3a.prototype.getArity = function () {
  return this.expr.getArity()
}
$b477363445c611b4$export$8c5a605c8776de77.prototype.getArity = function () {
  return 0
}
$b477363445c611b4$export$580268a9119fd710.prototype.getArity =
  $b477363445c611b4$export$43a76c134e83307c.prototype.getArity = function () {
    return this.expr.getArity()
  }

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function $f91cbef2f34ea15f$var$getMetaInfo (expr, grammarInterval) {
  const metaInfo = {}
  if (expr.source && grammarInterval) {
    const adjusted = expr.source.relativeTo(grammarInterval)
    metaInfo.sourceInterval = [adjusted.startIdx, adjusted.endIdx]
  }
  return metaInfo
}
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
$b477363445c611b4$export$f1bb6ea3bbab87ba.prototype.outputRecipe = (0,
$e2c0af47b6882e74$export$817eb92a8194bab0)('outputRecipe')
$b477363445c611b4$export$4154a199d7d90455.outputRecipe = function (
  formals,
  grammarInterval
) {
  return ['any', $f91cbef2f34ea15f$var$getMetaInfo(this, grammarInterval)]
}
$b477363445c611b4$export$bd5df0f255a350f8.outputRecipe = function (
  formals,
  grammarInterval
) {
  return ['end', $f91cbef2f34ea15f$var$getMetaInfo(this, grammarInterval)]
}
$b477363445c611b4$export$8dd80f06eb58bfe1.prototype.outputRecipe = function (
  formals,
  grammarInterval
) {
  return [
    'terminal',
    $f91cbef2f34ea15f$var$getMetaInfo(this, grammarInterval),
    this.obj
  ]
}
$b477363445c611b4$export$9a58ef0d7ad3278c.prototype.outputRecipe = function (
  formals,
  grammarInterval
) {
  return [
    'range',
    $f91cbef2f34ea15f$var$getMetaInfo(this, grammarInterval),
    this.from,
    this.to
  ]
}
$b477363445c611b4$export$1ca45c9a47aec42c.prototype.outputRecipe = function (
  formals,
  grammarInterval
) {
  return [
    'param',
    $f91cbef2f34ea15f$var$getMetaInfo(this, grammarInterval),
    this.index
  ]
}
$b477363445c611b4$export$25ba4469a069167.prototype.outputRecipe = function (
  formals,
  grammarInterval
) {
  return [
    'alt',
    $f91cbef2f34ea15f$var$getMetaInfo(this, grammarInterval)
  ].concat(
    this.terms.map((term) => term.outputRecipe(formals, grammarInterval))
  )
}
$b477363445c611b4$export$5b5dd0e212d2a5bc.prototype.outputRecipe = function (
  formals,
  grammarInterval
) {
  const extension = this.terms[0] // [extension, original]
  return extension.outputRecipe(formals, grammarInterval)
}
$b477363445c611b4$export$ceb3ee475cfd64d1.prototype.outputRecipe = function (
  formals,
  grammarInterval
) {
  const beforeTerms = this.terms.slice(0, this.expansionPos)
  const afterTerms = this.terms.slice(this.expansionPos + 1)
  return [
    'splice',
    $f91cbef2f34ea15f$var$getMetaInfo(this, grammarInterval),
    beforeTerms.map((term) => term.outputRecipe(formals, grammarInterval)),
    afterTerms.map((term) => term.outputRecipe(formals, grammarInterval))
  ]
}
$b477363445c611b4$export$4802c350533dc67e.prototype.outputRecipe = function (
  formals,
  grammarInterval
) {
  return [
    'seq',
    $f91cbef2f34ea15f$var$getMetaInfo(this, grammarInterval)
  ].concat(
    this.factors.map((factor) => factor.outputRecipe(formals, grammarInterval))
  )
}
$b477363445c611b4$export$1644ba17714857f1.prototype.outputRecipe =
  $b477363445c611b4$export$2d9ac7aa84f97a08.prototype.outputRecipe =
  $b477363445c611b4$export$a76800b3cc430f35.prototype.outputRecipe =
  $b477363445c611b4$export$8c5a605c8776de77.prototype.outputRecipe =
  $b477363445c611b4$export$580268a9119fd710.prototype.outputRecipe =
  $b477363445c611b4$export$43a76c134e83307c.prototype.outputRecipe =
    function (formals, grammarInterval) {
      return [
        this.constructor.name.toLowerCase(),
        $f91cbef2f34ea15f$var$getMetaInfo(this, grammarInterval),
        this.expr.outputRecipe(formals, grammarInterval)
      ]
    }
$b477363445c611b4$export$efc21ddc6aeb363d.prototype.outputRecipe = function (
  formals,
  grammarInterval
) {
  return [
    'app',
    $f91cbef2f34ea15f$var$getMetaInfo(this, grammarInterval),
    this.ruleName,
    this.args.map((arg) => arg.outputRecipe(formals, grammarInterval))
  ]
}
$b477363445c611b4$export$82f2f2b3ec52904.prototype.outputRecipe = function (
  formals,
  grammarInterval
) {
  return [
    'unicodeChar',
    $f91cbef2f34ea15f$var$getMetaInfo(this, grammarInterval),
    this.categoryOrProp
  ]
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
/*
  Called at grammar creation time to rewrite a rule body, replacing each reference to a formal
  parameter with a `Param` node. Returns a PExpr -- either a new one, or the original one if
  it was modified in place.
*/ $b477363445c611b4$export$f1bb6ea3bbab87ba.prototype.introduceParams = (0,
$e2c0af47b6882e74$export$817eb92a8194bab0)('introduceParams')
$b477363445c611b4$export$4154a199d7d90455.introduceParams =
  $b477363445c611b4$export$bd5df0f255a350f8.introduceParams =
  $b477363445c611b4$export$8dd80f06eb58bfe1.prototype.introduceParams =
  $b477363445c611b4$export$9a58ef0d7ad3278c.prototype.introduceParams =
  $b477363445c611b4$export$1ca45c9a47aec42c.prototype.introduceParams =
  $b477363445c611b4$export$82f2f2b3ec52904.prototype.introduceParams =
    function (formals) {
      return this
    }
$b477363445c611b4$export$25ba4469a069167.prototype.introduceParams = function (
  formals
) {
  this.terms.forEach((term, idx, terms) => {
    terms[idx] = term.introduceParams(formals)
  })
  return this
}
$b477363445c611b4$export$4802c350533dc67e.prototype.introduceParams = function (
  formals
) {
  this.factors.forEach((factor, idx, factors) => {
    factors[idx] = factor.introduceParams(formals)
  })
  return this
}
$b477363445c611b4$export$ffbe1b4f1e592c3a.prototype.introduceParams =
  $b477363445c611b4$export$8c5a605c8776de77.prototype.introduceParams =
  $b477363445c611b4$export$580268a9119fd710.prototype.introduceParams =
  $b477363445c611b4$export$43a76c134e83307c.prototype.introduceParams =
    function (formals) {
      this.expr = this.expr.introduceParams(formals)
      return this
    }
$b477363445c611b4$export$efc21ddc6aeb363d.prototype.introduceParams = function (
  formals
) {
  const index = formals.indexOf(this.ruleName)
  if (index >= 0) {
    if (this.args.length > 0) // TODO: Should this be supported? See issue #64.
    {
      throw new Error(
        'Parameterized rules cannot be passed as arguments to another rule.'
      )
    }
    return new $b477363445c611b4$export$1ca45c9a47aec42c(index).withSource(
      this.source
    )
  } else {
    this.args.forEach((arg, idx, args) => {
      args[idx] = arg.introduceParams(formals)
    })
    return this
  }
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
// Returns `true` if this parsing expression may accept without consuming any input.
$b477363445c611b4$export$f1bb6ea3bbab87ba.prototype.isNullable = function (
  grammar
) {
  return this._isNullable(grammar, Object.create(null))
}
$b477363445c611b4$export$f1bb6ea3bbab87ba.prototype._isNullable = (0,
$e2c0af47b6882e74$export$817eb92a8194bab0)('_isNullable')
$b477363445c611b4$export$4154a199d7d90455._isNullable =
  $b477363445c611b4$export$9a58ef0d7ad3278c.prototype._isNullable =
  $b477363445c611b4$export$1ca45c9a47aec42c.prototype._isNullable =
  $b477363445c611b4$export$2d9ac7aa84f97a08.prototype._isNullable =
  $b477363445c611b4$export$82f2f2b3ec52904.prototype._isNullable =
    function (grammar, memo) {
      return false
    }
$b477363445c611b4$export$bd5df0f255a350f8._isNullable = function (
  grammar,
  memo
) {
  return true
}
$b477363445c611b4$export$8dd80f06eb58bfe1.prototype._isNullable = function (
  grammar,
  memo
) {
  if (
    typeof this.obj === 'string'
  ) // This is an over-simplification: it's only correct if the input is a string. If it's an array
  // or an object, then the empty string parsing expression is not nullable.
  {
    return this.obj === ''
  } else return false
}
$b477363445c611b4$export$25ba4469a069167.prototype._isNullable = function (
  grammar,
  memo
) {
  return (
    this.terms.length === 0 ||
    this.terms.some((term) => term._isNullable(grammar, memo))
  )
}
$b477363445c611b4$export$4802c350533dc67e.prototype._isNullable = function (
  grammar,
  memo
) {
  return this.factors.every((factor) => factor._isNullable(grammar, memo))
}
$b477363445c611b4$export$1644ba17714857f1.prototype._isNullable =
  $b477363445c611b4$export$a76800b3cc430f35.prototype._isNullable =
  $b477363445c611b4$export$8c5a605c8776de77.prototype._isNullable =
  $b477363445c611b4$export$580268a9119fd710.prototype._isNullable =
    function (grammar, memo) {
      return true
    }
$b477363445c611b4$export$43a76c134e83307c.prototype._isNullable = function (
  grammar,
  memo
) {
  return this.expr._isNullable(grammar, memo)
}
$b477363445c611b4$export$efc21ddc6aeb363d.prototype._isNullable = function (
  grammar,
  memo
) {
  const key = this.toMemoKey()
  if (!Object.prototype.hasOwnProperty.call(memo, key)) {
    const { body } = grammar.rules[this.ruleName]
    const inlined = body.substituteParams(this.args)
    memo[key] = false // Prevent infinite recursion for recursive rules.
    memo[key] = inlined._isNullable(grammar, memo)
  }
  return memo[key]
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
/*
  Returns a PExpr that results from recursively replacing every formal parameter (i.e., instance
  of `Param`) inside this PExpr with its actual value from `actuals` (an Array).

  The receiver must not be modified; a new PExpr must be returned if any replacement is necessary.
*/ // function(actuals) { ... }
$b477363445c611b4$export$f1bb6ea3bbab87ba.prototype.substituteParams = (0,
$e2c0af47b6882e74$export$817eb92a8194bab0)('substituteParams')
$b477363445c611b4$export$4154a199d7d90455.substituteParams =
  $b477363445c611b4$export$bd5df0f255a350f8.substituteParams =
  $b477363445c611b4$export$8dd80f06eb58bfe1.prototype.substituteParams =
  $b477363445c611b4$export$9a58ef0d7ad3278c.prototype.substituteParams =
  $b477363445c611b4$export$82f2f2b3ec52904.prototype.substituteParams =
    function (actuals) {
      return this
    }
$b477363445c611b4$export$1ca45c9a47aec42c.prototype.substituteParams =
  function (actuals) {
    return (0, $e2c0af47b6882e74$export$bae73f3645afb2fd)(actuals[this.index])
  }
$b477363445c611b4$export$25ba4469a069167.prototype.substituteParams = function (
  actuals
) {
  return new $b477363445c611b4$export$25ba4469a069167(
    this.terms.map((term) => term.substituteParams(actuals))
  )
}
$b477363445c611b4$export$4802c350533dc67e.prototype.substituteParams =
  function (actuals) {
    return new $b477363445c611b4$export$4802c350533dc67e(
      this.factors.map((factor) => factor.substituteParams(actuals))
    )
  }
$b477363445c611b4$export$ffbe1b4f1e592c3a.prototype.substituteParams =
  $b477363445c611b4$export$8c5a605c8776de77.prototype.substituteParams =
  $b477363445c611b4$export$580268a9119fd710.prototype.substituteParams =
  $b477363445c611b4$export$43a76c134e83307c.prototype.substituteParams =
    function (actuals) {
      return new this.constructor(this.expr.substituteParams(actuals))
    }
$b477363445c611b4$export$efc21ddc6aeb363d.prototype.substituteParams =
  function (actuals) {
    if (
      this.args.length === 0
    ) // Avoid making a copy of this application, as an optimization
    {
      return this
    } else {
      const args = this.args.map((arg) => arg.substituteParams(actuals))
      return new $b477363445c611b4$export$efc21ddc6aeb363d(this.ruleName, args)
    }
  }

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function $ff4eac808de709e4$var$isRestrictedJSIdentifier (str) {
  return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(str)
}
function $ff4eac808de709e4$var$resolveDuplicatedNames (argumentNameList) {
  // `count` is used to record the number of times each argument name occurs in the list,
  // this is useful for checking duplicated argument name. It maps argument names to ints.
  const count = Object.create(null)
  argumentNameList.forEach((argName) => {
    count[argName] = (count[argName] || 0) + 1
  })
  // Append subscripts ('_1', '_2', ...) to duplicate argument names.
  Object.keys(count).forEach((dupArgName) => {
    if (count[dupArgName] <= 1) return
    // This name shows up more than once, so add subscripts.
    let subscript = 1
    argumentNameList.forEach((argName, idx) => {
      if (argName === dupArgName) { argumentNameList[idx] = argName + '_' + subscript++ }
    })
  })
}
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
/*
  Returns a list of strings that will be used as the default argument names for its receiver
  (a pexpr) in a semantic action. This is used exclusively by the Semantics Editor.

  `firstArgIndex` is the 1-based index of the first argument name that will be generated for this
  pexpr. It enables us to name arguments positionally, e.g., if the second argument is a
  non-alphanumeric terminal like "+", it will be named '$2'.

  `noDupCheck` is true if the caller of `toArgumentNameList` is not a top level caller. It enables
  us to avoid nested duplication subscripts appending, e.g., '_1_1', '_1_2', by only checking
  duplicates at the top level.

  Here is a more elaborate example that illustrates how this method works:
  `(a "+" b).toArgumentNameList(1)` evaluates to `['a', '$2', 'b']` with the following recursive
  calls:

    (a).toArgumentNameList(1) -> ['a'],
    ("+").toArgumentNameList(2) -> ['$2'],
    (b).toArgumentNameList(3) -> ['b']

  Notes:
  * This method must only be called on well-formed expressions, e.g., the receiver must
    not have any Alt sub-expressions with inconsistent arities.
  * e.getArity() === e.toArgumentNameList(1).length
*/ // function(firstArgIndex, noDupCheck) { ... }
$b477363445c611b4$export$f1bb6ea3bbab87ba.prototype.toArgumentNameList = (0,
$e2c0af47b6882e74$export$817eb92a8194bab0)('toArgumentNameList')
$b477363445c611b4$export$4154a199d7d90455.toArgumentNameList = function (
  firstArgIndex,
  noDupCheck
) {
  return ['any']
}
$b477363445c611b4$export$bd5df0f255a350f8.toArgumentNameList = function (
  firstArgIndex,
  noDupCheck
) {
  return ['end']
}
$b477363445c611b4$export$8dd80f06eb58bfe1.prototype.toArgumentNameList =
  function (firstArgIndex, noDupCheck) {
    if (
      typeof this.obj === 'string' &&
      /^[_a-zA-Z0-9]+$/.test(this.obj)
    ) // If this terminal is a valid suffix for a JS identifier, just prepend it with '_'
    {
      return ['_' + this.obj]
    } else // Otherwise, name it positionally.
    {
      return ['$' + firstArgIndex]
    }
  }
$b477363445c611b4$export$9a58ef0d7ad3278c.prototype.toArgumentNameList =
  function (firstArgIndex, noDupCheck) {
    let argName = this.from + '_to_' + this.to
    // If the `argName` is not valid then try to prepend a `_`.
    if (!$ff4eac808de709e4$var$isRestrictedJSIdentifier(argName)) { argName = '_' + argName }
    // If the `argName` still not valid after prepending a `_`, then name it positionally.
    if (!$ff4eac808de709e4$var$isRestrictedJSIdentifier(argName)) { argName = '$' + firstArgIndex }
    return [argName]
  }
$b477363445c611b4$export$25ba4469a069167.prototype.toArgumentNameList =
  function (firstArgIndex, noDupCheck) {
    // `termArgNameLists` is an array of arrays where each row is the
    // argument name list that corresponds to a term in this alternation.
    const termArgNameLists = this.terms.map((term) =>
      term.toArgumentNameList(firstArgIndex, true)
    )
    const argumentNameList = []
    const numArgs = termArgNameLists[0].length
    for (let colIdx = 0; colIdx < numArgs; colIdx++) {
      const col = []
      for (let rowIdx = 0; rowIdx < this.terms.length; rowIdx++) { col.push(termArgNameLists[rowIdx][colIdx]) }
      const uniqueNames = (0, $e2c0af47b6882e74$export$8c70279880500ad3)(col)
      argumentNameList.push(uniqueNames.join('_or_'))
    }
    if (!noDupCheck) { $ff4eac808de709e4$var$resolveDuplicatedNames(argumentNameList) }
    return argumentNameList
  }
$b477363445c611b4$export$4802c350533dc67e.prototype.toArgumentNameList =
  function (firstArgIndex, noDupCheck) {
    // Generate the argument name list, without worrying about duplicates.
    let argumentNameList = []
    this.factors.forEach((factor) => {
      const factorArgumentNameList = factor.toArgumentNameList(
        firstArgIndex,
        true
      )
      argumentNameList = argumentNameList.concat(factorArgumentNameList)
      // Shift the firstArgIndex to take this factor's argument names into account.
      firstArgIndex += factorArgumentNameList.length
    })
    if (!noDupCheck) { $ff4eac808de709e4$var$resolveDuplicatedNames(argumentNameList) }
    return argumentNameList
  }
$b477363445c611b4$export$ffbe1b4f1e592c3a.prototype.toArgumentNameList =
  function (firstArgIndex, noDupCheck) {
    const argumentNameList = this.expr
      .toArgumentNameList(firstArgIndex, noDupCheck)
      .map((exprArgumentString) =>
        exprArgumentString[exprArgumentString.length - 1] === 's'
          ? exprArgumentString + 'es'
          : exprArgumentString + 's'
      )
    if (!noDupCheck) { $ff4eac808de709e4$var$resolveDuplicatedNames(argumentNameList) }
    return argumentNameList
  }
$b477363445c611b4$export$a76800b3cc430f35.prototype.toArgumentNameList =
  function (firstArgIndex, noDupCheck) {
    return this.expr
      .toArgumentNameList(firstArgIndex, noDupCheck)
      .map((argName) => {
        return 'opt' + argName[0].toUpperCase() + argName.slice(1)
      })
  }
$b477363445c611b4$export$8c5a605c8776de77.prototype.toArgumentNameList =
  function (firstArgIndex, noDupCheck) {
    return []
  }
$b477363445c611b4$export$580268a9119fd710.prototype.toArgumentNameList =
  $b477363445c611b4$export$43a76c134e83307c.prototype.toArgumentNameList =
    function (firstArgIndex, noDupCheck) {
      return this.expr.toArgumentNameList(firstArgIndex, noDupCheck)
    }
$b477363445c611b4$export$efc21ddc6aeb363d.prototype.toArgumentNameList =
  function (firstArgIndex, noDupCheck) {
    return [this.ruleName]
  }
$b477363445c611b4$export$82f2f2b3ec52904.prototype.toArgumentNameList =
  function (firstArgIndex, noDupCheck) {
    return ['$' + firstArgIndex]
  }
$b477363445c611b4$export$1ca45c9a47aec42c.prototype.toArgumentNameList =
  function (firstArgIndex, noDupCheck) {
    return ['param' + this.index]
  } // "Value pexprs" (Value, Str, Arr, Obj) are going away soon, so we don't worry about them here.

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
// Returns a string representing the PExpr, for use as a UI label, etc.
$b477363445c611b4$export$f1bb6ea3bbab87ba.prototype.toDisplayString = (0,
$e2c0af47b6882e74$export$817eb92a8194bab0)('toDisplayString')
$b477363445c611b4$export$25ba4469a069167.prototype.toDisplayString =
  $b477363445c611b4$export$4802c350533dc67e.prototype.toDisplayString =
    function () {
      if (this.source) return this.source.trimmed().contents
      return '[' + this.constructor.name + ']'
    }
$b477363445c611b4$export$4154a199d7d90455.toDisplayString =
  $b477363445c611b4$export$bd5df0f255a350f8.toDisplayString =
  $b477363445c611b4$export$ffbe1b4f1e592c3a.prototype.toDisplayString =
  $b477363445c611b4$export$8c5a605c8776de77.prototype.toDisplayString =
  $b477363445c611b4$export$580268a9119fd710.prototype.toDisplayString =
  $b477363445c611b4$export$43a76c134e83307c.prototype.toDisplayString =
  $b477363445c611b4$export$8dd80f06eb58bfe1.prototype.toDisplayString =
  $b477363445c611b4$export$9a58ef0d7ad3278c.prototype.toDisplayString =
  $b477363445c611b4$export$1ca45c9a47aec42c.prototype.toDisplayString =
    function () {
      return this.toString()
    }
$b477363445c611b4$export$efc21ddc6aeb363d.prototype.toDisplayString =
  function () {
    if (this.args.length > 0) {
      const ps = this.args.map((arg) => arg.toDisplayString())
      return this.ruleName + '<' + ps.join(',') + '>'
    } else return this.ruleName
  }
$b477363445c611b4$export$82f2f2b3ec52904.prototype.toDisplayString =
  function () {
    return 'Unicode [' + this.categoryOrProp + '] character'
  }

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
/*
  `Failure`s represent expressions that weren't matched while parsing. They are used to generate
  error messages automatically. The interface of `Failure`s includes the collowing methods:

  - getText() : String
  - getType() : String  (one of {"description", "string", "code"})
  - isDescription() : bool
  - isStringTerminal() : bool
  - isCode() : bool
  - isFluffy() : bool
  - makeFluffy() : void
  - subsumes(Failure) : bool
*/ function $e23683cac89f84e9$var$isValidType (type) {
  return type === 'description' || type === 'string' || type === 'code'
}
class $e23683cac89f84e9$export$5ebc9a4af3ac0850 {
  constructor (pexpr, text, type) {
    if (!$e23683cac89f84e9$var$isValidType(type)) { throw new Error('invalid Failure type: ' + type) }
    this.pexpr = pexpr
    this.text = text
    this.type = type
    this.fluffy = false
  }

  getPExpr () {
    return this.pexpr
  }

  getText () {
    return this.text
  }

  getType () {
    return this.type
  }

  isDescription () {
    return this.type === 'description'
  }

  isStringTerminal () {
    return this.type === 'string'
  }

  isCode () {
    return this.type === 'code'
  }

  isFluffy () {
    return this.fluffy
  }

  makeFluffy () {
    this.fluffy = true
  }

  clearFluffy () {
    this.fluffy = false
  }

  subsumes (that) {
    return (
      this.getText() === that.getText() &&
      this.type === that.type &&
      (!this.isFluffy() || (this.isFluffy() && that.isFluffy()))
    )
  }

  toString () {
    return this.type === 'string'
      ? JSON.stringify(this.getText())
      : this.getText()
  }

  clone () {
    const failure = new $e23683cac89f84e9$export$5ebc9a4af3ac0850(
      this.pexpr,
      this.text,
      this.type
    )
    if (this.isFluffy()) failure.makeFluffy()
    return failure
  }

  toKey () {
    return this.toString() + '#' + this.type
  }
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
$b477363445c611b4$export$f1bb6ea3bbab87ba.prototype.toFailure = (0,
$e2c0af47b6882e74$export$817eb92a8194bab0)('toFailure')
$b477363445c611b4$export$4154a199d7d90455.toFailure = function (grammar) {
  return new (0, $e23683cac89f84e9$export$5ebc9a4af3ac0850)(
    this,
    'any object',
    'description'
  )
}
$b477363445c611b4$export$bd5df0f255a350f8.toFailure = function (grammar) {
  return new (0, $e23683cac89f84e9$export$5ebc9a4af3ac0850)(
    this,
    'end of input',
    'description'
  )
}
$b477363445c611b4$export$8dd80f06eb58bfe1.prototype.toFailure = function (
  grammar
) {
  return new (0, $e23683cac89f84e9$export$5ebc9a4af3ac0850)(
    this,
    this.obj,
    'string'
  )
}
$b477363445c611b4$export$9a58ef0d7ad3278c.prototype.toFailure = function (
  grammar
) {
  // TODO: come up with something better
  return new (0, $e23683cac89f84e9$export$5ebc9a4af3ac0850)(
    this,
    JSON.stringify(this.from) + '..' + JSON.stringify(this.to),
    'code'
  )
}
$b477363445c611b4$export$8c5a605c8776de77.prototype.toFailure = function (
  grammar
) {
  const description =
    this.expr === $b477363445c611b4$export$4154a199d7d90455
      ? 'nothing'
      : 'not ' + this.expr.toFailure(grammar)
  return new (0, $e23683cac89f84e9$export$5ebc9a4af3ac0850)(
    this,
    description,
    'description'
  )
}
$b477363445c611b4$export$580268a9119fd710.prototype.toFailure = function (
  grammar
) {
  return this.expr.toFailure(grammar)
}
$b477363445c611b4$export$efc21ddc6aeb363d.prototype.toFailure = function (
  grammar
) {
  let { description } = grammar.rules[this.ruleName]
  if (!description) {
    const article = /^[aeiouAEIOU]/.test(this.ruleName) ? 'an' : 'a'
    description = article + ' ' + this.ruleName
  }
  return new (0, $e23683cac89f84e9$export$5ebc9a4af3ac0850)(
    this,
    description,
    'description'
  )
}
$b477363445c611b4$export$82f2f2b3ec52904.prototype.toFailure = function (
  grammar
) {
  return new (0, $e23683cac89f84e9$export$5ebc9a4af3ac0850)(
    this,
    'a Unicode [' + this.categoryOrProp + '] character',
    'description'
  )
}
$b477363445c611b4$export$25ba4469a069167.prototype.toFailure = function (
  grammar
) {
  const fs = this.terms.map((t) => t.toFailure(grammar))
  const description = '(' + fs.join(' or ') + ')'
  return new (0, $e23683cac89f84e9$export$5ebc9a4af3ac0850)(
    this,
    description,
    'description'
  )
}
$b477363445c611b4$export$4802c350533dc67e.prototype.toFailure = function (
  grammar
) {
  const fs = this.factors.map((f) => f.toFailure(grammar))
  const description = '(' + fs.join(' ') + ')'
  return new (0, $e23683cac89f84e9$export$5ebc9a4af3ac0850)(
    this,
    description,
    'description'
  )
}
$b477363445c611b4$export$ffbe1b4f1e592c3a.prototype.toFailure = function (
  grammar
) {
  const description = '(' + this.expr.toFailure(grammar) + this.operator + ')'
  return new (0, $e23683cac89f84e9$export$5ebc9a4af3ac0850)(
    this,
    description,
    'description'
  )
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
/*
  e1.toString() === e2.toString() ==> e1 and e2 are semantically equivalent.
  Note that this is not an iff (<==>): e.g.,
  (~"b" "a").toString() !== ("a").toString(), even though
  ~"b" "a" and "a" are interchangeable in any grammar,
  both in terms of the languages they accept and their arities.
*/ $b477363445c611b4$export$f1bb6ea3bbab87ba.prototype.toString = (0,
$e2c0af47b6882e74$export$817eb92a8194bab0)('toString')
$b477363445c611b4$export$4154a199d7d90455.toString = function () {
  return 'any'
}
$b477363445c611b4$export$bd5df0f255a350f8.toString = function () {
  return 'end'
}
$b477363445c611b4$export$8dd80f06eb58bfe1.prototype.toString = function () {
  return JSON.stringify(this.obj)
}
$b477363445c611b4$export$9a58ef0d7ad3278c.prototype.toString = function () {
  return JSON.stringify(this.from) + '..' + JSON.stringify(this.to)
}
$b477363445c611b4$export$1ca45c9a47aec42c.prototype.toString = function () {
  return '$' + this.index
}
$b477363445c611b4$export$43a76c134e83307c.prototype.toString = function () {
  return '#(' + this.expr.toString() + ')'
}
$b477363445c611b4$export$25ba4469a069167.prototype.toString = function () {
  return this.terms.length === 1
    ? this.terms[0].toString()
    : '(' + this.terms.map((term) => term.toString()).join(' | ') + ')'
}
$b477363445c611b4$export$4802c350533dc67e.prototype.toString = function () {
  return this.factors.length === 1
    ? this.factors[0].toString()
    : '(' + this.factors.map((factor) => factor.toString()).join(' ') + ')'
}
$b477363445c611b4$export$ffbe1b4f1e592c3a.prototype.toString = function () {
  return this.expr + this.operator
}
$b477363445c611b4$export$8c5a605c8776de77.prototype.toString = function () {
  return '~' + this.expr
}
$b477363445c611b4$export$580268a9119fd710.prototype.toString = function () {
  return '&' + this.expr
}
$b477363445c611b4$export$efc21ddc6aeb363d.prototype.toString = function () {
  if (this.args.length > 0) {
    const ps = this.args.map((arg) => arg.toString())
    return this.ruleName + '<' + ps.join(',') + '>'
  } else return this.ruleName
}
$b477363445c611b4$export$82f2f2b3ec52904.prototype.toString = function () {
  return '\\p{' + this.categoryOrProp + '}'
}

class $458ca969ee9fd033$export$e2a5e0accdb67dcc extends (0,
$b477363445c611b4$export$f1bb6ea3bbab87ba) {
  constructor (param) {
    super()
    this.obj = param
  }

  _getString (state) {
    const terminal = state.currentApplication().args[this.obj.index];
    (0, $e2c0af47b6882e74$export$a7a9523472993e97)(
      terminal instanceof (0, $b477363445c611b4$export$8dd80f06eb58bfe1),
      'expected a Terminal expression'
    )
    return terminal.obj
  }

  // Implementation of the PExpr API
  allowsSkippingPrecedingSpace () {
    return true
  }

  eval (state) {
    const { inputStream } = state
    const origPos = inputStream.pos
    const matchStr = this._getString(state)
    if (!inputStream.matchString(matchStr, true)) {
      state.processFailure(origPos, this)
      return false
    } else {
      state.pushBinding(
        new (0, $a8ee6022e9bbdc31$export$f6a002739fa43001)(matchStr.length),
        origPos
      )
      return true
    }
  }

  getArity () {
    return 1
  }

  substituteParams (actuals) {
    return new $458ca969ee9fd033$export$e2a5e0accdb67dcc(
      this.obj.substituteParams(actuals)
    )
  }

  toDisplayString () {
    return this.obj.toDisplayString() + ' (case-insensitive)'
  }

  toFailure (grammar) {
    return new (0, $e23683cac89f84e9$export$5ebc9a4af3ac0850)(
      this,
      this.obj.toFailure(grammar) + ' (case-insensitive)',
      'description'
    )
  }

  _isNullable (grammar, memo) {
    return this.obj._isNullable(grammar, memo)
  }
}

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
let $0c3c5b34b54e1200$var$builtInApplySyntacticBody
$ceddbabc7a573b89$export$1781a71bf0bc728d((builtInRules) => {
  $0c3c5b34b54e1200$var$builtInApplySyntacticBody =
    builtInRules.rules.applySyntactic.body
})
const $0c3c5b34b54e1200$var$applySpaces =
  new $b477363445c611b4$export$efc21ddc6aeb363d('spaces')
class $0c3c5b34b54e1200$export$9a81a4fafdd8c0ed {
  constructor (matcher, startExpr, optPositionToRecordFailures) {
    this.matcher = matcher
    this.startExpr = startExpr
    this.grammar = matcher.grammar
    this.input = matcher.getInput()
    this.inputStream = new (0, $304351f7f091c097$export$f22294a9362415e4)(
      this.input
    )
    this.memoTable = matcher._memoTable
    this.userData = undefined
    this.doNotMemoize = false
    this._bindings = []
    this._bindingOffsets = []
    this._applicationStack = []
    this._posStack = [0]
    this.inLexifiedContextStack = [false]
    this.rightmostFailurePosition = -1
    this._rightmostFailurePositionStack = []
    this._recordedFailuresStack = []
    if (optPositionToRecordFailures !== undefined) {
      this.positionToRecordFailures = optPositionToRecordFailures
      this.recordedFailures = Object.create(null)
    }
  }

  posToOffset (pos) {
    return pos - this._posStack[this._posStack.length - 1]
  }

  enterApplication (posInfo, app) {
    this._posStack.push(this.inputStream.pos)
    this._applicationStack.push(app)
    this.inLexifiedContextStack.push(false)
    posInfo.enter(app)
    this._rightmostFailurePositionStack.push(this.rightmostFailurePosition)
    this.rightmostFailurePosition = -1
  }

  exitApplication (posInfo, optNode) {
    const origPos = this._posStack.pop()
    this._applicationStack.pop()
    this.inLexifiedContextStack.pop()
    posInfo.exit()
    this.rightmostFailurePosition = Math.max(
      this.rightmostFailurePosition,
      this._rightmostFailurePositionStack.pop()
    )
    if (optNode) this.pushBinding(optNode, origPos)
  }

  enterLexifiedContext () {
    this.inLexifiedContextStack.push(true)
  }

  exitLexifiedContext () {
    this.inLexifiedContextStack.pop()
  }

  currentApplication () {
    return this._applicationStack[this._applicationStack.length - 1]
  }

  inSyntacticContext () {
    const currentApplication = this.currentApplication()
    if (currentApplication) { return currentApplication.isSyntactic() && !this.inLexifiedContext() } else // The top-level context is syntactic if the start application is.
    {
      return this.startExpr.factors[0].isSyntactic()
    }
  }

  inLexifiedContext () {
    return this.inLexifiedContextStack[this.inLexifiedContextStack.length - 1]
  }

  skipSpaces () {
    this.pushFailuresInfo()
    this.eval($0c3c5b34b54e1200$var$applySpaces)
    this.popBinding()
    this.popFailuresInfo()
    return this.inputStream.pos
  }

  skipSpacesIfInSyntacticContext () {
    return this.inSyntacticContext() ? this.skipSpaces() : this.inputStream.pos
  }

  maybeSkipSpacesBefore (expr) {
    if (
      expr.allowsSkippingPrecedingSpace() &&
      expr !== $0c3c5b34b54e1200$var$applySpaces
    ) { return this.skipSpacesIfInSyntacticContext() } else return this.inputStream.pos
  }

  pushBinding (node, origPos) {
    this._bindings.push(node)
    this._bindingOffsets.push(this.posToOffset(origPos))
  }

  popBinding () {
    this._bindings.pop()
    this._bindingOffsets.pop()
  }

  numBindings () {
    return this._bindings.length
  }

  truncateBindings (newLength) {
    // Yes, this is this really faster than setting the `length` property (tested with
    // bin/es5bench on Node v6.1.0).
    // Update 2021-10-25: still true on v14.15.5 — it's ~20% speedup on es5bench.
    while (this._bindings.length > newLength) this.popBinding()
  }

  getCurrentPosInfo () {
    return this.getPosInfo(this.inputStream.pos)
  }

  getPosInfo (pos) {
    let posInfo = this.memoTable[pos]
    if (!posInfo) {
      posInfo = this.memoTable[pos] = new (0,
      $0ef2abddc6aeb433$export$3f64ba660e699daf)()
    }
    return posInfo
  }

  processFailure (pos, expr) {
    this.rightmostFailurePosition = Math.max(
      this.rightmostFailurePosition,
      pos
    )
    if (this.recordedFailures && pos === this.positionToRecordFailures) {
      const app = this.currentApplication()
      if (
        app
      ) // Substitute parameters with the actual pexprs that were passed to
      // the current rule.
      {
        expr = expr.substituteParams(app.args)
      }
      this.recordFailure(expr.toFailure(this.grammar), false)
    }
  }

  recordFailure (failure, shouldCloneIfNew) {
    const key = failure.toKey()
    if (!this.recordedFailures[key]) { this.recordedFailures[key] = shouldCloneIfNew ? failure.clone() : failure } else if (this.recordedFailures[key].isFluffy() && !failure.isFluffy()) { this.recordedFailures[key].clearFluffy() }
  }

  recordFailures (failures, shouldCloneIfNew) {
    Object.keys(failures).forEach((key) => {
      this.recordFailure(failures[key], shouldCloneIfNew)
    })
  }

  cloneRecordedFailures () {
    if (!this.recordedFailures) return undefined
    const ans = Object.create(null)
    Object.keys(this.recordedFailures).forEach((key) => {
      ans[key] = this.recordedFailures[key].clone()
    })
    return ans
  }

  getRightmostFailurePosition () {
    return this.rightmostFailurePosition
  }

  _getRightmostFailureOffset () {
    return this.rightmostFailurePosition >= 0
      ? this.posToOffset(this.rightmostFailurePosition)
      : -1
  }

  // Returns the memoized trace entry for `expr` at `pos`, if one exists, `null` otherwise.
  getMemoizedTraceEntry (pos, expr) {
    const posInfo = this.memoTable[pos]
    if (posInfo && expr instanceof $b477363445c611b4$export$efc21ddc6aeb363d) {
      const memoRec = posInfo.memo[expr.toMemoKey()]
      if (memoRec && memoRec.traceEntry) {
        const entry = memoRec.traceEntry.cloneWithExpr(expr)
        entry.isMemoized = true
        return entry
      }
    }
    return null
  }

  // Returns a new trace entry, with the currently active trace array as its children.
  getTraceEntry (pos, expr, succeeded, bindings) {
    if (expr instanceof $b477363445c611b4$export$efc21ddc6aeb363d) {
      const app = this.currentApplication()
      const actuals = app ? app.args : []
      expr = expr.substituteParams(actuals)
    }
    return (
      this.getMemoizedTraceEntry(pos, expr) ||
      new (0, $414ad3ef19e16be4$export$78e1bea9036f120f)(
        this.input,
        pos,
        this.inputStream.pos,
        expr,
        succeeded,
        bindings,
        this.trace
      )
    )
  }

  isTracing () {
    return !!this.trace
  }

  hasNecessaryInfo (memoRec) {
    if (this.trace && !memoRec.traceEntry) return false
    if (
      this.recordedFailures &&
      this.inputStream.pos + memoRec.rightmostFailureOffset ===
        this.positionToRecordFailures
    ) { return !!memoRec.failuresAtRightmostPosition }
    return true
  }

  useMemoizedResult (origPos, memoRec) {
    if (this.trace) this.trace.push(memoRec.traceEntry)
    const memoRecRightmostFailurePosition =
      this.inputStream.pos + memoRec.rightmostFailureOffset
    this.rightmostFailurePosition = Math.max(
      this.rightmostFailurePosition,
      memoRecRightmostFailurePosition
    )
    if (
      this.recordedFailures &&
      this.positionToRecordFailures === memoRecRightmostFailurePosition &&
      memoRec.failuresAtRightmostPosition
    ) { this.recordFailures(memoRec.failuresAtRightmostPosition, true) }
    this.inputStream.examinedLength = Math.max(
      this.inputStream.examinedLength,
      memoRec.examinedLength + origPos
    )
    if (memoRec.value) {
      this.inputStream.pos += memoRec.matchLength
      this.pushBinding(memoRec.value, origPos)
      return true
    }
    return false
  }

  // Evaluate `expr` and return `true` if it succeeded, `false` otherwise. On success, `bindings`
  // will have `expr.getArity()` more elements than before, and the input stream's position may
  // have increased. On failure, `bindings` and position will be unchanged.
  eval (expr) {
    const { inputStream } = this
    const origNumBindings = this._bindings.length
    const origUserData = this.userData
    let origRecordedFailures
    if (this.recordedFailures) {
      origRecordedFailures = this.recordedFailures
      this.recordedFailures = Object.create(null)
    }
    const origPos = inputStream.pos
    const memoPos = this.maybeSkipSpacesBefore(expr)
    let origTrace
    if (this.trace) {
      origTrace = this.trace
      this.trace = []
    }
    // Do the actual evaluation.
    const ans = expr.eval(this)
    if (this.trace) {
      const bindings = this._bindings.slice(origNumBindings)
      const traceEntry = this.getTraceEntry(memoPos, expr, ans, bindings)
      traceEntry.isImplicitSpaces = expr === $0c3c5b34b54e1200$var$applySpaces
      traceEntry.isRootNode = expr === this.startExpr
      origTrace.push(traceEntry)
      this.trace = origTrace
    }
    if (ans) {
      if (
        this.recordedFailures &&
        inputStream.pos === this.positionToRecordFailures
      ) {
        Object.keys(this.recordedFailures).forEach((key) => {
          this.recordedFailures[key].makeFluffy()
        })
      }
    } else {
      // Reset the position, bindings, and userData.
      inputStream.pos = origPos
      this.truncateBindings(origNumBindings)
      this.userData = origUserData
    }
    if (this.recordedFailures) this.recordFailures(origRecordedFailures, false)
    // The built-in applySyntactic rule needs special handling: we want to skip
    // trailing spaces, just as with the top-level application of a syntactic rule.
    if (expr === $0c3c5b34b54e1200$var$builtInApplySyntacticBody) { this.skipSpaces() }
    return ans
  }

  getMatchResult () {
    this.grammar._setUpMatchState(this)
    this.eval(this.startExpr)
    let rightmostFailures
    if (this.recordedFailures) {
      rightmostFailures = Object.keys(this.recordedFailures).map(
        (key) => this.recordedFailures[key]
      )
    }
    const cst = this._bindings[0]
    if (cst) cst.grammar = this.grammar
    return new (0, $b22cd105760b2b49$export$4fb32c2662f214d4)(
      this.matcher,
      this.input,
      this.startExpr,
      cst,
      this._bindingOffsets[0],
      this.rightmostFailurePosition,
      rightmostFailures
    )
  }

  getTrace () {
    this.trace = []
    const matchResult = this.getMatchResult()
    // The trace node for the start rule is always the last entry. If it is a syntactic rule,
    // the first entry is for an application of 'spaces'.
    // TODO(pdubroy): Clean this up by introducing a special `Match<startAppl>` rule, which will
    // ensure that there is always a single root trace node.
    const rootTrace = this.trace[this.trace.length - 1]
    rootTrace.result = matchResult
    return rootTrace
  }

  pushFailuresInfo () {
    this._rightmostFailurePositionStack.push(this.rightmostFailurePosition)
    this._recordedFailuresStack.push(this.recordedFailures)
  }

  popFailuresInfo () {
    this.rightmostFailurePosition = this._rightmostFailurePositionStack.pop()
    this.recordedFailures = this._recordedFailuresStack.pop()
  }
}

class $30397ddf6e8b38f0$export$20214574ec94167d {
  constructor (grammar) {
    this.grammar = grammar
    this._memoTable = []
    this._input = ''
    this._isMemoTableStale = false
  }

  _resetMemoTable () {
    this._memoTable = []
    this._isMemoTableStale = false
  }

  getInput () {
    return this._input
  }

  setInput (str) {
    if (this._input !== str) this.replaceInputRange(0, this._input.length, str)
    return this
  }

  replaceInputRange (startIdx, endIdx, str) {
    const prevInput = this._input
    const memoTable = this._memoTable
    if (
      startIdx < 0 ||
      startIdx > prevInput.length ||
      endIdx < 0 ||
      endIdx > prevInput.length ||
      startIdx > endIdx
    ) { throw new Error('Invalid indices: ' + startIdx + ' and ' + endIdx) }
    // update input
    this._input = prevInput.slice(0, startIdx) + str + prevInput.slice(endIdx)
    if (this._input !== prevInput && memoTable.length > 0) { this._isMemoTableStale = true }
    // update memo table (similar to the above)
    const restOfMemoTable = memoTable.slice(endIdx)
    memoTable.length = startIdx
    for (let idx = 0; idx < str.length; idx++) memoTable.push(undefined)
    for (const posInfo of restOfMemoTable) memoTable.push(posInfo)
    // Invalidate memoRecs
    for (let pos = 0; pos < startIdx; pos++) {
      const posInfo = memoTable[pos]
      if (posInfo) posInfo.clearObsoleteEntries(pos, startIdx)
    }
    return this
  }

  match (
    optStartApplicationStr,
    options = {
      incremental: true
    }
  ) {
    return this._match(this._getStartExpr(optStartApplicationStr), {
      incremental: options.incremental,
      tracing: false
    })
  }

  trace (
    optStartApplicationStr,
    options = {
      incremental: true
    }
  ) {
    return this._match(this._getStartExpr(optStartApplicationStr), {
      incremental: options.incremental,
      tracing: true
    })
  }

  _match (startExpr, options = {}) {
    const opts = {
      tracing: false,
      incremental: true,
      positionToRecordFailures: undefined,
      ...options
    }
    if (!opts.incremental) this._resetMemoTable()
    else if (this._isMemoTableStale && !this.grammar.supportsIncrementalParsing) { throw (0, $a0b00490599d0190$export$31c51bb6bc9944eb)(this.grammar) }
    const state = new (0, $0c3c5b34b54e1200$export$9a81a4fafdd8c0ed)(
      this,
      startExpr,
      opts.positionToRecordFailures
    )
    return opts.tracing ? state.getTrace() : state.getMatchResult()
  }

  /*
    Returns the starting expression for this Matcher's associated grammar. If
    `optStartApplicationStr` is specified, it is a string expressing a rule application in the
    grammar. If not specified, the grammar's default start rule will be used.
  */ _getStartExpr (optStartApplicationStr) {
    const applicationStr =
      optStartApplicationStr || this.grammar.defaultStartRule
    if (!applicationStr) {
      throw new Error(
        'Missing start rule argument -- the grammar has no default start rule.'
      )
    }
    const startApp = this.grammar.parseApplication(applicationStr)
    return new $b477363445c611b4$export$4802c350533dc67e([
      startApp,
      $b477363445c611b4$export$bd5df0f255a350f8
    ])
  }
}

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
const $11828b1e50c89002$var$globalActionStack = []
const $11828b1e50c89002$var$hasOwnProperty = (x, prop) =>
  Object.prototype.hasOwnProperty.call(x, prop)
// ----------------- Wrappers -----------------
// Wrappers decorate CST nodes with all of the functionality (i.e., operations and attributes)
// provided by a Semantics (see below). `Wrapper` is the abstract superclass of all wrappers. A
// `Wrapper` must have `_node` and `_semantics` instance variables, which refer to the CST node and
// Semantics (resp.) for which it was created, and a `_childWrappers` instance variable which is
// used to cache the wrapper instances that are created for its child nodes. Setting these instance
// variables is the responsibility of the constructor of each Semantics-specific subclass of
// `Wrapper`.
class $11828b1e50c89002$var$Wrapper {
  constructor (node, sourceInterval, baseInterval) {
    this._node = node
    this.source = sourceInterval
    // The interval that the childOffsets of `node` are relative to. It should be the source
    // of the closest Nonterminal node.
    this._baseInterval = baseInterval
    if (node.isNonterminal()) {
      $e2c0af47b6882e74$export$a7a9523472993e97(
        sourceInterval === baseInterval
      )
    }
    this._childWrappers = []
  }

  _forgetMemoizedResultFor (attributeName) {
    // Remove the memoized attribute from the cstNode and all its children.
    delete this._node[this._semantics.attributeKeys[attributeName]]
    this.children.forEach((child) => {
      child._forgetMemoizedResultFor(attributeName)
    })
  }

  // Returns the wrapper of the specified child node. Child wrappers are created lazily and
  // cached in the parent wrapper's `_childWrappers` instance variable.
  child (idx) {
    if (
      !(idx >= 0 && idx < this._node.numChildren())
    ) // TODO: Consider throwing an exception here.
    {
      return undefined
    }
    let childWrapper = this._childWrappers[idx]
    if (!childWrapper) {
      const childNode = this._node.childAt(idx)
      const offset = this._node.childOffsets[idx]
      const source = this._baseInterval.subInterval(
        offset,
        childNode.matchLength
      )
      const base = childNode.isNonterminal() ? source : this._baseInterval
      childWrapper = this._childWrappers[idx] = this._semantics.wrap(
        childNode,
        source,
        base
      )
    }
    return childWrapper
  }

  // Returns an array containing the wrappers of all of the children of the node associated
  // with this wrapper.
  _children () {
    // Force the creation of all child wrappers
    for (let idx = 0; idx < this._node.numChildren(); idx++) this.child(idx)
    return this._childWrappers
  }

  // Returns `true` if the CST node associated with this wrapper corresponds to an iteration
  // expression, i.e., a Kleene-*, Kleene-+, or an optional. Returns `false` otherwise.
  isIteration () {
    return this._node.isIteration()
  }

  // Returns `true` if the CST node associated with this wrapper is a terminal node, `false`
  // otherwise.
  isTerminal () {
    return this._node.isTerminal()
  }

  // Returns `true` if the CST node associated with this wrapper is a nonterminal node, `false`
  // otherwise.
  isNonterminal () {
    return this._node.isNonterminal()
  }

  // Returns `true` if the CST node associated with this wrapper is a nonterminal node
  // corresponding to a syntactic rule, `false` otherwise.
  isSyntactic () {
    return this.isNonterminal() && this._node.isSyntactic()
  }

  // Returns `true` if the CST node associated with this wrapper is a nonterminal node
  // corresponding to a lexical rule, `false` otherwise.
  isLexical () {
    return this.isNonterminal() && this._node.isLexical()
  }

  // Returns `true` if the CST node associated with this wrapper is an iterator node
  // having either one or no child (? operator), `false` otherwise.
  // Otherwise, throws an exception.
  isOptional () {
    return this._node.isOptional()
  }

  // Create a new _iter wrapper in the same semantics as this wrapper.
  iteration (optChildWrappers) {
    const childWrappers = optChildWrappers || []
    const childNodes = childWrappers.map((c) => c._node)
    const iter = new (0, $a8ee6022e9bbdc31$export$ebfccf4095ba179)(
      childNodes,
      [],
      -1,
      false
    )
    const wrapper = this._semantics.wrap(iter, null, null)
    wrapper._childWrappers = childWrappers
    return wrapper
  }

  // Returns an array containing the children of this CST node.
  get children () {
    return this._children()
  }

  // Returns the name of grammar rule that created this CST node.
  get ctorName () {
    return this._node.ctorName
  }

  // Returns the number of children of this CST node.
  get numChildren () {
    return this._node.numChildren()
  }

  // Returns the contents of the input stream consumed by this CST node.
  get sourceString () {
    return this.source.contents
  }
}
class $11828b1e50c89002$export$9d201e891b56e96e {
  constructor (grammar, superSemantics) {
    const self = this
    this.grammar = grammar
    this.checkedActionDicts = false
    // Constructor for wrapper instances, which are passed as the arguments to the semantic actions
    // of an operation or attribute. Operations and attributes require double dispatch: the semantic
    // action is chosen based on both the node's type and the semantics. Wrappers ensure that
    // the `execute` method is called with the correct (most specific) semantics object as an
    // argument.
    this.Wrapper = class extends (
      (superSemantics ? superSemantics.Wrapper : $11828b1e50c89002$var$Wrapper)
    ) {
      constructor (node, sourceInterval, baseInterval) {
        super(node, sourceInterval, baseInterval)
        self.checkActionDictsIfHaventAlready()
        this._semantics = self
      }

      toString () {
        return '[semantics wrapper for ' + self.grammar.name + ']'
      }
    }
    this.super = superSemantics
    if (superSemantics) {
      if (
        !(
          grammar.equals(this.super.grammar) ||
          grammar._inheritsFrom(this.super.grammar)
        )
      ) {
        throw new Error(
          "Cannot extend a semantics for grammar '" +
            this.super.grammar.name +
            "' for use with grammar '" +
            grammar.name +
            "' (not a sub-grammar)"
        )
      }
      this.operations = Object.create(this.super.operations)
      this.attributes = Object.create(this.super.attributes)
      this.attributeKeys = Object.create(null)
      // Assign unique symbols for each of the attributes inherited from the super-semantics so that
      // they are memoized independently.
      for (const attributeName in this.attributes) {
        Object.defineProperty(this.attributeKeys, attributeName, {
          value: $ceddbabc7a573b89$export$8b15d37bc3f197d4(attributeName)
        })
      }
    } else {
      this.operations = Object.create(null)
      this.attributes = Object.create(null)
      this.attributeKeys = Object.create(null)
    }
  }

  toString () {
    return '[semantics for ' + this.grammar.name + ']'
  }

  checkActionDictsIfHaventAlready () {
    if (!this.checkedActionDicts) {
      this.checkActionDicts()
      this.checkedActionDicts = true
    }
  }

  // Checks that the action dictionaries for all operations and attributes in this semantics,
  // including the ones that were inherited from the super-semantics, agree with the grammar.
  // Throws an exception if one or more of them doesn't.
  checkActionDicts () {
    let name
    for (name in this.operations) { this.operations[name].checkActionDict(this.grammar) }
    for (name in this.attributes) { this.attributes[name].checkActionDict(this.grammar) }
  }

  toRecipe (semanticsOnly) {
    function hasSuperSemantics (s) {
      return (
        s.super !==
        $11828b1e50c89002$export$9d201e891b56e96e.BuiltInSemantics._getSemantics()
      )
    }
    let str = '(function(g) {\n'
    if (hasSuperSemantics(this)) {
      str += '  var semantics = ' + this.super.toRecipe(true) + '(g'
      const superSemanticsGrammar = this.super.grammar
      let relatedGrammar = this.grammar
      while (relatedGrammar !== superSemanticsGrammar) {
        str += '.superGrammar'
        relatedGrammar = relatedGrammar.superGrammar
      }
      str += ');\n'
      str += '  return g.extendSemantics(semantics)'
    } else str += '  return g.createSemantics()';
    ['Operation', 'Attribute'].forEach((type) => {
      const semanticOperations = this[type.toLowerCase() + 's']
      Object.keys(semanticOperations).forEach((name) => {
        const { actionDict, formals, builtInDefault } =
          semanticOperations[name]
        let signature = name
        if (formals.length > 0) signature += '(' + formals.join(', ') + ')'
        let method
        if (
          hasSuperSemantics(this) &&
          this.super[type.toLowerCase() + 's'][name]
        ) { method = 'extend' + type } else method = 'add' + type
        str += '\n    .' + method + '(' + JSON.stringify(signature) + ', {'
        const srcArray = []
        Object.keys(actionDict).forEach((actionName) => {
          if (actionDict[actionName] !== builtInDefault) {
            let source = actionDict[actionName].toString().trim()
            // Convert method shorthand to plain old function syntax.
            // https://github.com/ohmjs/ohm/issues/263
            source = source.replace(/^.*\(/, 'function(')
            srcArray.push(
              '\n      ' + JSON.stringify(actionName) + ': ' + source
            )
          }
        })
        str += srcArray.join(',') + '\n    })'
      })
    })
    str += ';\n  })'
    if (!semanticsOnly) {
      str =
        '(function() {\n  var grammar = this.fromRecipe(' +
        this.grammar.toRecipe() +
        ');\n' +
        '  var semantics = ' +
        str +
        '(grammar);\n' +
        '  return semantics;\n' +
        '});\n'
    }
    return str
  }

  addOperationOrAttribute (type, signature, actionDict) {
    const typePlural = type + 's'
    const parsedNameAndFormalArgs = $11828b1e50c89002$var$parseSignature(
      signature,
      type
    )
    const { name } = parsedNameAndFormalArgs
    const { formals } = parsedNameAndFormalArgs
    // TODO: check that there are no duplicate formal arguments
    this.assertNewName(name, type)
    // Create the action dictionary for this operation / attribute that contains a `_default` action
    // which defines the default behavior of iteration, terminal, and non-terminal nodes...
    const builtInDefault = $11828b1e50c89002$var$newDefaultAction(
      type,
      name,
      doIt
    )
    const realActionDict = {
      _default: builtInDefault
    }
    // ... and add in the actions supplied by the programmer, which may override some or all of the
    // default ones.
    Object.keys(actionDict).forEach((name) => {
      realActionDict[name] = actionDict[name]
    })
    const entry =
      type === 'operation'
        ? new $11828b1e50c89002$var$Operation(
          name,
          formals,
          realActionDict,
          builtInDefault
        )
        : new $11828b1e50c89002$var$Attribute(
          name,
          realActionDict,
          builtInDefault
        )
    // The following check is not strictly necessary (it will happen later anyway) but it's better
    // to catch errors early.
    entry.checkActionDict(this.grammar)
    this[typePlural][name] = entry
    function doIt (...args) {
      // Dispatch to most specific version of this operation / attribute -- it may have been
      // overridden by a sub-semantics.
      const thisThing = this._semantics[typePlural][name]
      // Check that the caller passed the correct number of arguments.
      if (arguments.length !== thisThing.formals.length) {
        throw new Error(
          'Invalid number of arguments passed to ' +
            name +
            ' ' +
            type +
            ' (expected ' +
            thisThing.formals.length +
            ', got ' +
            arguments.length +
            ')'
        )
      }
      // Create an "arguments object" from the arguments that were passed to this
      // operation / attribute.
      const argsObj = Object.create(null)
      for (const [idx, val] of Object.entries(args)) {
        const formal = thisThing.formals[idx]
        argsObj[formal] = val
      }
      const oldArgs = this.args
      this.args = argsObj
      const ans = thisThing.execute(this._semantics, this)
      this.args = oldArgs
      return ans
    }
    if (type === 'operation') {
      this.Wrapper.prototype[name] = doIt
      this.Wrapper.prototype[name].toString = function () {
        return '[' + name + ' operation]'
      }
    } else {
      Object.defineProperty(this.Wrapper.prototype, name, {
        get: doIt,
        configurable: true
      })
      Object.defineProperty(this.attributeKeys, name, {
        value: $ceddbabc7a573b89$export$8b15d37bc3f197d4(name)
      })
    }
  }

  extendOperationOrAttribute (type, name, actionDict) {
    const typePlural = type + 's'
    // Make sure that `name` really is just a name, i.e., that it doesn't also contain formals.
    $11828b1e50c89002$var$parseSignature(name, 'attribute')
    if (!(this.super && name in this.super[typePlural])) {
      throw new Error(
        'Cannot extend ' +
          type +
          " '" +
          name +
          "': did not inherit an " +
          type +
          ' with that name'
      )
    }
    if ($11828b1e50c89002$var$hasOwnProperty(this[typePlural], name)) { throw new Error('Cannot extend ' + type + " '" + name + "' again") }
    // Create a new operation / attribute whose actionDict delegates to the super operation /
    // attribute's actionDict, and which has all the keys from `inheritedActionDict`.
    const inheritedFormals = this[typePlural][name].formals
    const inheritedActionDict = this[typePlural][name].actionDict
    const newActionDict = Object.create(inheritedActionDict)
    Object.keys(actionDict).forEach((name) => {
      newActionDict[name] = actionDict[name]
    })
    this[typePlural][name] =
      type === 'operation'
        ? new $11828b1e50c89002$var$Operation(
          name,
          inheritedFormals,
          newActionDict
        )
        : new $11828b1e50c89002$var$Attribute(name, newActionDict)
    // The following check is not strictly necessary (it will happen later anyway) but it's better
    // to catch errors early.
    this[typePlural][name].checkActionDict(this.grammar)
  }

  assertNewName (name, type) {
    if (
      $11828b1e50c89002$var$hasOwnProperty(
        $11828b1e50c89002$var$Wrapper.prototype,
        name
      )
    ) {
      throw new Error(
        'Cannot add ' + type + " '" + name + "': that's a reserved name"
      )
    }
    if (name in this.operations) {
      throw new Error(
        'Cannot add ' +
          type +
          " '" +
          name +
          "': an operation with that name already exists"
      )
    }
    if (name in this.attributes) {
      throw new Error(
        'Cannot add ' +
          type +
          " '" +
          name +
          "': an attribute with that name already exists"
      )
    }
  }

  // Returns a wrapper for the given CST `node` in this semantics.
  // If `node` is already a wrapper, returns `node` itself.  // TODO: why is this needed?
  wrap (node, source, optBaseInterval) {
    const baseInterval = optBaseInterval || source
    return node instanceof this.Wrapper
      ? node
      : new this.Wrapper(node, source, baseInterval)
  }
}
function $11828b1e50c89002$var$parseSignature (signature, type) {
  if (!$11828b1e50c89002$export$9d201e891b56e96e.prototypeGrammar) {
    // The Operations and Attributes grammar won't be available while Ohm is loading,
    // but we can get away the following simplification b/c none of the operations
    // that are used while loading take arguments.
    $e2c0af47b6882e74$export$a7a9523472993e97(signature.indexOf('(') === -1)
    return {
      name: signature,
      formals: []
    }
  }
  const r = $11828b1e50c89002$export$9d201e891b56e96e.prototypeGrammar.match(
    signature,
    type === 'operation' ? 'OperationSignature' : 'AttributeSignature'
  )
  if (r.failed()) throw new Error(r.message)
  return $11828b1e50c89002$export$9d201e891b56e96e
    .prototypeGrammarSemantics(r)
    .parse()
}
function $11828b1e50c89002$var$newDefaultAction (type, name, doIt) {
  return function (...children) {
    const thisThing =
      this._semantics.operations[name] || this._semantics.attributes[name]
    const args = thisThing.formals.map((formal) => this.args[formal])
    if (
      !this.isIteration() &&
      children.length === 1
    ) // This CST node corresponds to a non-terminal in the grammar (e.g., AddExpr). The fact that
    // we got here means that this action dictionary doesn't have an action for this particular
    // non-terminal or a generic `_nonterminal` action.
    // As a convenience, if this node only has one child, we just return the result of applying
    // this operation / attribute to the child node.
    {
      return doIt.apply(children[0], args)
    } else // Otherwise, we throw an exception to let the programmer know that we don't know what
    // to do with this node.
    {
      throw $a0b00490599d0190$export$1ce65c1570ed7bac(
        this.ctorName,
        name,
        type,
        $11828b1e50c89002$var$globalActionStack
      )
    }
  }
}
// Creates a new Semantics instance for `grammar`, inheriting operations and attributes from
// `optSuperSemantics`, if it is specified. Returns a function that acts as a proxy for the new
// Semantics instance. When that function is invoked with a CST node as an argument, it returns
// a wrapper for that node which gives access to the operations and attributes provided by this
// semantics.
$11828b1e50c89002$export$9d201e891b56e96e.createSemantics = function (
  grammar,
  optSuperSemantics
) {
  const s = new $11828b1e50c89002$export$9d201e891b56e96e(
    grammar,
    optSuperSemantics !== undefined
      ? optSuperSemantics
      : $11828b1e50c89002$export$9d201e891b56e96e.BuiltInSemantics._getSemantics()
  )
  // To enable clients to invoke a semantics like a function, return a function that acts as a proxy
  // for `s`, which is the real `Semantics` instance.
  const proxy = function ASemantics (matchResult) {
    if (
      !(matchResult instanceof (0, $b22cd105760b2b49$export$4fb32c2662f214d4))
    ) {
      throw new TypeError(
        'Semantics expected a MatchResult, but got ' +
          $e2c0af47b6882e74$export$81c9cb19ca23770e(matchResult)
      )
    }
    if (matchResult.failed()) {
      throw new TypeError(
        'cannot apply Semantics to ' + matchResult.toString()
      )
    }
    const cst = matchResult._cst
    if (cst.grammar !== grammar) {
      throw new Error(
        "Cannot use a MatchResult from grammar '" +
          cst.grammar.name +
          "' with a semantics for '" +
          grammar.name +
          "'"
      )
    }
    const inputStream = new (0, $304351f7f091c097$export$f22294a9362415e4)(
      matchResult.input
    )
    return s.wrap(
      cst,
      inputStream.interval(matchResult._cstOffset, matchResult.input.length)
    )
  }
  // Forward public methods from the proxy to the semantics instance.
  proxy.addOperation = function (signature, actionDict) {
    s.addOperationOrAttribute('operation', signature, actionDict)
    return proxy
  }
  proxy.extendOperation = function (name, actionDict) {
    s.extendOperationOrAttribute('operation', name, actionDict)
    return proxy
  }
  proxy.addAttribute = function (name, actionDict) {
    s.addOperationOrAttribute('attribute', name, actionDict)
    return proxy
  }
  proxy.extendAttribute = function (name, actionDict) {
    s.extendOperationOrAttribute('attribute', name, actionDict)
    return proxy
  }
  proxy._getActionDict = function (operationOrAttributeName) {
    const action =
      s.operations[operationOrAttributeName] ||
      s.attributes[operationOrAttributeName]
    if (!action) {
      throw new Error(
        '"' +
          operationOrAttributeName +
          '" is not a valid operation or attribute ' +
          'name in this semantics for "' +
          grammar.name +
          '"'
      )
    }
    return action.actionDict
  }
  proxy._remove = function (operationOrAttributeName) {
    let semantic
    if (operationOrAttributeName in s.operations) {
      semantic = s.operations[operationOrAttributeName]
      delete s.operations[operationOrAttributeName]
    } else if (operationOrAttributeName in s.attributes) {
      semantic = s.attributes[operationOrAttributeName]
      delete s.attributes[operationOrAttributeName]
    }
    delete s.Wrapper.prototype[operationOrAttributeName]
    return semantic
  }
  proxy.getOperationNames = function () {
    return Object.keys(s.operations)
  }
  proxy.getAttributeNames = function () {
    return Object.keys(s.attributes)
  }
  proxy.getGrammar = function () {
    return s.grammar
  }
  proxy.toRecipe = function (semanticsOnly) {
    return s.toRecipe(semanticsOnly)
  }
  // Make the proxy's toString() work.
  proxy.toString = s.toString.bind(s)
  // Returns the semantics for the proxy.
  proxy._getSemantics = function () {
    return s
  }
  return proxy
}
// ----------------- Operation -----------------
// An Operation represents a function to be applied to a concrete syntax tree (CST) -- it's very
// similar to a Visitor (http://en.wikipedia.org/wiki/Visitor_pattern). An operation is executed by
// recursively walking the CST, and at each node, invoking the matching semantic action from
// `actionDict`. See `Operation.prototype.execute` for details of how a CST node's matching semantic
// action is found.
class $11828b1e50c89002$var$Operation {
  constructor (name, formals, actionDict, builtInDefault) {
    this.name = name
    this.formals = formals
    this.actionDict = actionDict
    this.builtInDefault = builtInDefault
  }

  checkActionDict (grammar) {
    grammar._checkTopDownActionDict(this.typeName, this.name, this.actionDict)
  }

  // Execute this operation on the CST node associated with `nodeWrapper` in the context of the
  // given Semantics instance.
  execute (semantics, nodeWrapper) {
    try {
      // Look for a semantic action whose name matches the node's constructor name, which is either
      // the name of a rule in the grammar, or '_terminal' (for a terminal node), or '_iter' (for an
      // iteration node).
      const { ctorName } = nodeWrapper._node
      let actionFn = this.actionDict[ctorName]
      if (actionFn) {
        $11828b1e50c89002$var$globalActionStack.push([this, ctorName])
        return actionFn.apply(nodeWrapper, nodeWrapper._children())
      }
      // The action dictionary does not contain a semantic action for this specific type of node.
      // If this is a nonterminal node and the programmer has provided a `_nonterminal` semantic
      // action, we invoke it:
      if (nodeWrapper.isNonterminal()) {
        actionFn = this.actionDict._nonterminal
        if (actionFn) {
          $11828b1e50c89002$var$globalActionStack.push([
            this,
            '_nonterminal',
            ctorName
          ])
          return actionFn.apply(nodeWrapper, nodeWrapper._children())
        }
      }
      // Otherwise, we invoke the '_default' semantic action.
      $11828b1e50c89002$var$globalActionStack.push([
        this,
        'default action',
        ctorName
      ])
      return this.actionDict._default.apply(
        nodeWrapper,
        nodeWrapper._children()
      )
    } finally {
      $11828b1e50c89002$var$globalActionStack.pop()
    }
  }
}
$11828b1e50c89002$var$Operation.prototype.typeName = 'operation'
// ----------------- Attribute -----------------
// Attributes are Operations whose results are memoized. This means that, for any given semantics,
// the semantic action for a CST node will be invoked no more than once.
class $11828b1e50c89002$var$Attribute extends $11828b1e50c89002$var$Operation {
  constructor (name, actionDict, builtInDefault) {
    super(name, [], actionDict, builtInDefault)
  }

  execute (semantics, nodeWrapper) {
    const node = nodeWrapper._node
    const key = semantics.attributeKeys[this.name]
    if (
      !$11828b1e50c89002$var$hasOwnProperty(node, key)
    ) // The following is a super-send -- isn't JS beautiful? :/
    {
      node[key] = $11828b1e50c89002$var$Operation.prototype.execute.call(
        this,
        semantics,
        nodeWrapper
      )
    }
    return node[key]
  }
}
$11828b1e50c89002$var$Attribute.prototype.typeName = 'attribute'

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
const $335ed4fc151b1ab9$var$SPECIAL_ACTION_NAMES = [
  '_iter',
  '_terminal',
  '_nonterminal',
  '_default'
]
function $335ed4fc151b1ab9$var$getSortedRuleValues (grammar) {
  return Object.keys(grammar.rules)
    .sort()
    .map((name) => grammar.rules[name])
}
// Until ES2019, JSON was not a valid subset of JavaScript because U+2028 (line separator)
// and U+2029 (paragraph separator) are allowed in JSON string literals, but not in JS.
// This function properly encodes those two characters so that the resulting string is
// represents both valid JSON, and valid JavaScript (for ES2018 and below).
// See https://v8.dev/features/subsume-json for more details.
const $335ed4fc151b1ab9$var$jsonToJS = (str) =>
  str.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
let $335ed4fc151b1ab9$var$ohmGrammar
let $335ed4fc151b1ab9$var$buildGrammar
class $335ed4fc151b1ab9$export$553a52f18b21505e {
  constructor (name, superGrammar, rules, optDefaultStartRule) {
    this.name = name
    this.superGrammar = superGrammar
    this.rules = rules
    if (optDefaultStartRule) {
      if (!(optDefaultStartRule in rules)) {
        throw new Error(
          "Invalid start rule: '" +
            optDefaultStartRule +
            "' is not a rule in grammar '" +
            name +
            "'"
        )
      }
      this.defaultStartRule = optDefaultStartRule
    }
    this._matchStateInitializer = undefined
    this.supportsIncrementalParsing = true
  }

  matcher () {
    return new (0, $30397ddf6e8b38f0$export$20214574ec94167d)(this)
  }

  // Return true if the grammar is a built-in grammar, otherwise false.
  // NOTE: This might give an unexpected result if called before BuiltInRules is defined!
  isBuiltIn () {
    return (
      this === $335ed4fc151b1ab9$export$553a52f18b21505e.ProtoBuiltInRules ||
      this === $335ed4fc151b1ab9$export$553a52f18b21505e.BuiltInRules
    )
  }

  equals (g) {
    if (this === g) return true
    // Do the cheapest comparisons first.
    if (
      g == null ||
      this.name !== g.name ||
      this.defaultStartRule !== g.defaultStartRule ||
      !(
        this.superGrammar === g.superGrammar ||
        this.superGrammar.equals(g.superGrammar)
      )
    ) { return false }
    const myRules = $335ed4fc151b1ab9$var$getSortedRuleValues(this)
    const otherRules = $335ed4fc151b1ab9$var$getSortedRuleValues(g)
    return (
      myRules.length === otherRules.length &&
      myRules.every((rule, i) => {
        return (
          rule.description === otherRules[i].description &&
          rule.formals.join(',') === otherRules[i].formals.join(',') &&
          rule.body.toString() === otherRules[i].body.toString()
        )
      })
    )
  }

  match (input, optStartApplication) {
    const m = this.matcher()
    m.replaceInputRange(0, 0, input)
    return m.match(optStartApplication)
  }

  trace (input, optStartApplication) {
    const m = this.matcher()
    m.replaceInputRange(0, 0, input)
    return m.trace(optStartApplication)
  }

  createSemantics () {
    return (0, $11828b1e50c89002$export$9d201e891b56e96e).createSemantics(this)
  }

  extendSemantics (superSemantics) {
    return (0, $11828b1e50c89002$export$9d201e891b56e96e).createSemantics(
      this,
      superSemantics._getSemantics()
    )
  }

  // Check that every key in `actionDict` corresponds to a semantic action, and that it maps to
  // a function of the correct arity. If not, throw an exception.
  _checkTopDownActionDict (what, name, actionDict) {
    const problems = []
    for (const k in actionDict) {
      const v = actionDict[k]
      const isSpecialAction =
        $335ed4fc151b1ab9$var$SPECIAL_ACTION_NAMES.includes(k)
      if (!isSpecialAction && !(k in this.rules)) {
        problems.push(
          `'${k}' is not a valid semantic action for '${this.name}'`
        )
        continue
      }
      if (typeof v !== 'function') {
        problems.push(
          `'${k}' must be a function in an action dictionary for '${this.name}'`
        )
        continue
      }
      const actual = v.length
      const expected = this._topDownActionArity(k)
      if (actual !== expected) {
        let details
        if (k === '_iter' || k === '_nonterminal') {
          details =
            `it should use a rest parameter, e.g. \`${k}(...children) {}\`. ` +
            'NOTE: this is new in Ohm v16 \u2014 see https://ohmjs.org/d/ati for details.'
        } else details = `expected ${expected}, got ${actual}`
        problems.push(`Semantic action '${k}' has the wrong arity: ${details}`)
      }
    }
    if (problems.length > 0) {
      const prettyProblems = problems.map((problem) => '- ' + problem)
      const error = new Error(
        [
          `Found errors in the action dictionary of the '${name}' ${what}:`,
          ...prettyProblems
        ].join('\n')
      )
      error.problems = problems
      throw error
    }
  }

  // Return the expected arity for a semantic action named `actionName`, which
  // is either a rule name or a special action name like '_nonterminal'.
  _topDownActionArity (actionName) {
    // All special actions have an expected arity of 0, though all but _terminal
    // are expected to use the rest parameter syntax (e.g. `_iter(...children)`).
    // This is considered to have arity 0, i.e. `((...args) => {}).length` is 0.
    return $335ed4fc151b1ab9$var$SPECIAL_ACTION_NAMES.includes(actionName)
      ? 0
      : this.rules[actionName].body.getArity()
  }

  _inheritsFrom (grammar) {
    let g = this.superGrammar
    while (g) {
      if (g.equals(grammar, true)) return true
      g = g.superGrammar
    }
    return false
  }

  toRecipe (superGrammarExpr) {
    const metaInfo = {}
    // Include the grammar source if it is available.
    if (this.source) metaInfo.source = this.source.contents
    let startRule = null
    if (this.defaultStartRule) startRule = this.defaultStartRule
    const rules = {}
    Object.keys(this.rules).forEach((ruleName) => {
      const ruleInfo = this.rules[ruleName]
      const { body } = ruleInfo
      const isDefinition =
        !this.superGrammar || !this.superGrammar.rules[ruleName]
      let operation
      if (isDefinition) operation = 'define'
      else {
        operation =
          body instanceof $b477363445c611b4$export$5b5dd0e212d2a5bc
            ? 'extend'
            : 'override'
      }
      const metaInfo = {}
      if (ruleInfo.source && this.source) {
        const adjusted = ruleInfo.source.relativeTo(this.source)
        metaInfo.sourceInterval = [adjusted.startIdx, adjusted.endIdx]
      }
      const description = isDefinition ? ruleInfo.description : null
      const bodyRecipe = body.outputRecipe(ruleInfo.formals, this.source)
      rules[ruleName] = [
        operation,
        metaInfo,
        description,
        ruleInfo.formals,
        bodyRecipe
      ]
    })
    // If the caller provided an expression to use for the supergrammar, use that.
    // Otherwise, if the supergrammar is a user grammar, use its recipe inline.
    let superGrammarOutput = 'null'
    if (superGrammarExpr) superGrammarOutput = superGrammarExpr
    else if (this.superGrammar && !this.superGrammar.isBuiltIn()) { superGrammarOutput = this.superGrammar.toRecipe() }
    const recipeElements = [
      ...['grammar', metaInfo, this.name].map(JSON.stringify),
      superGrammarOutput,
      ...[startRule, rules].map(JSON.stringify)
    ]
    return $335ed4fc151b1ab9$var$jsonToJS(`[${recipeElements.join(',')}]`)
  }

  // TODO: Come up with better names for these methods.
  // TODO: Write the analog of these methods for inherited attributes.
  toOperationActionDictionaryTemplate () {
    return this._toOperationOrAttributeActionDictionaryTemplate()
  }

  toAttributeActionDictionaryTemplate () {
    return this._toOperationOrAttributeActionDictionaryTemplate()
  }

  _toOperationOrAttributeActionDictionaryTemplate () {
    // TODO: add the super-grammar's templates at the right place, e.g., a case for AddExpr_plus
    // should appear next to other cases of AddExpr.
    const sb = new $e2c0af47b6882e74$export$83347051c3437dc9()
    sb.append('{')
    let first = true
    for (const ruleName in this.rules) {
      const { body } = this.rules[ruleName]
      if (first) first = false
      else sb.append(',')
      sb.append('\n')
      sb.append('  ')
      this.addSemanticActionTemplate(ruleName, body, sb)
    }
    sb.append('\n}')
    return sb.contents()
  }

  addSemanticActionTemplate (ruleName, body, sb) {
    sb.append(ruleName)
    sb.append(': function(')
    const arity = this._topDownActionArity(ruleName)
    sb.append($e2c0af47b6882e74$export$76d90c956114f2c2('_', arity).join(', '))
    sb.append(') {\n')
    sb.append('  }')
  }

  // Parse a string which expresses a rule application in this grammar, and return the
  // resulting Apply node.
  parseApplication (str) {
    let app
    if (str.indexOf('<') === -1) // simple application
    {
      app = new $b477363445c611b4$export$efc21ddc6aeb363d(str)
    } else {
      // parameterized application
      const cst = $335ed4fc151b1ab9$var$ohmGrammar.match(
        str,
        'Base_application'
      )
      app = $335ed4fc151b1ab9$var$buildGrammar(cst, {})
    }
    // Ensure that the application is valid.
    if (!(app.ruleName in this.rules)) { throw $a0b00490599d0190$export$236a821bc395e911(app.ruleName, this.name) }
    const { formals } = this.rules[app.ruleName]
    if (formals.length !== app.args.length) {
      const { source } = this.rules[app.ruleName]
      throw $a0b00490599d0190$export$2cb7f8a72c9f798b(
        app.ruleName,
        formals.length,
        app.args.length,
        source
      )
    }
    return app
  }

  _setUpMatchState (state) {
    if (this._matchStateInitializer) this._matchStateInitializer(state)
  }
}
// The following grammar contains a few rules that couldn't be written  in "userland".
// At the bottom of src/main.js, we create a sub-grammar of this grammar that's called
// `BuiltInRules`. That grammar contains several convenience rules, e.g., `letter` and
// `digit`, and is implicitly the super-grammar of any grammar whose super-grammar
// isn't specified.
$335ed4fc151b1ab9$export$553a52f18b21505e.ProtoBuiltInRules =
  new $335ed4fc151b1ab9$export$553a52f18b21505e(
    'ProtoBuiltInRules',
    undefined,
    {
      any: {
        body: $b477363445c611b4$export$4154a199d7d90455,
        formals: [],
        description: 'any character',
        primitive: true
      },
      end: {
        body: $b477363445c611b4$export$bd5df0f255a350f8,
        formals: [],
        description: 'end of input',
        primitive: true
      },
      caseInsensitive: {
        body: new $458ca969ee9fd033$export$e2a5e0accdb67dcc(
          new $b477363445c611b4$export$1ca45c9a47aec42c(0)
        ),
        formals: ['str'],
        primitive: true
      },
      lower: {
        body: new $b477363445c611b4$export$82f2f2b3ec52904('Ll'),
        formals: [],
        description: 'a lowercase letter',
        primitive: true
      },
      upper: {
        body: new $b477363445c611b4$export$82f2f2b3ec52904('Lu'),
        formals: [],
        description: 'an uppercase letter',
        primitive: true
      },
      // Union of Lt (titlecase), Lm (modifier), and Lo (other), i.e. any letter not in Ll or Lu.
      unicodeLtmo: {
        body: new $b477363445c611b4$export$82f2f2b3ec52904('Ltmo'),
        formals: [],
        description: 'a Unicode character in Lt, Lm, or Lo',
        primitive: true
      },
      // These rules are not truly primitive (they could be written in userland) but are defined
      // here for bootstrapping purposes.
      spaces: {
        body: new $b477363445c611b4$export$1644ba17714857f1(
          new $b477363445c611b4$export$efc21ddc6aeb363d('space')
        ),
        formals: []
      },
      space: {
        body: new $b477363445c611b4$export$9a58ef0d7ad3278c('\x00', ' '),
        formals: [],
        description: 'a space'
      }
    }
  )
// This method is called from main.js once Ohm has loaded.
$335ed4fc151b1ab9$export$553a52f18b21505e.initApplicationParser = function (
  grammar,
  builderFn
) {
  $335ed4fc151b1ab9$var$ohmGrammar = grammar
  $335ed4fc151b1ab9$var$buildGrammar = builderFn
}

class $a13a66665c13c6a0$export$de188f5a432f7523 {
  constructor (name) {
    this.name = name
  }

  // Helpers
  sourceInterval (startIdx, endIdx) {
    return this.source.subInterval(startIdx, endIdx - startIdx)
  }

  ensureSuperGrammar () {
    if (!this.superGrammar) {
      this.withSuperGrammar(
        // TODO: The conditional expression below is an ugly hack. It's kind of ok because
        // I doubt anyone will ever try to declare a grammar called `BuiltInRules`. Still,
        // we should try to find a better way to do this.
        this.name === 'BuiltInRules'
          ? (0, $335ed4fc151b1ab9$export$553a52f18b21505e).ProtoBuiltInRules
          : (0, $335ed4fc151b1ab9$export$553a52f18b21505e).BuiltInRules
      )
    }
    return this.superGrammar
  }

  ensureSuperGrammarRuleForOverriding (name, source) {
    const ruleInfo = this.ensureSuperGrammar().rules[name]
    if (!ruleInfo) {
      throw $a0b00490599d0190$export$1e0aabfcd98d36cb(
        name,
        this.superGrammar.name,
        source
      )
    }
    return ruleInfo
  }

  installOverriddenOrExtendedRule (name, formals, body, source) {
    const duplicateParameterNames = (0,
    $e2c0af47b6882e74$export$1a47093b60e54e96)(formals)
    if (duplicateParameterNames.length > 0) {
      throw $a0b00490599d0190$export$7060ae4b85bc6c61(
        name,
        duplicateParameterNames,
        source
      )
    }
    const ruleInfo = this.ensureSuperGrammar().rules[name]
    const expectedFormals = ruleInfo.formals
    const expectedNumFormals = expectedFormals ? expectedFormals.length : 0
    if (formals.length !== expectedNumFormals) {
      throw $a0b00490599d0190$export$2cb7f8a72c9f798b(
        name,
        expectedNumFormals,
        formals.length,
        source
      )
    }
    return this.install(name, formals, body, ruleInfo.description, source)
  }

  install (name, formals, body, description, source, primitive = false) {
    this.rules[name] = {
      body: body.introduceParams(formals),
      formals,
      description,
      source,
      primitive
    }
    return this
  }

  // Stuff that you should only do once
  withSuperGrammar (superGrammar) {
    if (this.superGrammar) {
      throw new Error(
        'the super grammar of a GrammarDecl cannot be set more than once'
      )
    }
    this.superGrammar = superGrammar
    this.rules = Object.create(superGrammar.rules)
    // Grammars with an explicit supergrammar inherit a default start rule.
    if (!superGrammar.isBuiltIn()) { this.defaultStartRule = superGrammar.defaultStartRule }
    return this
  }

  withDefaultStartRule (ruleName) {
    this.defaultStartRule = ruleName
    return this
  }

  withSource (source) {
    this.source = new (0, $304351f7f091c097$export$f22294a9362415e4)(
      source
    ).interval(0, source.length)
    return this
  }

  // Creates a Grammar instance, and if it passes the sanity checks, returns it.
  build () {
    const grammar = new (0, $335ed4fc151b1ab9$export$553a52f18b21505e)(
      this.name,
      this.ensureSuperGrammar(),
      this.rules,
      this.defaultStartRule
    )
    // Initialize internal props that are inherited from the super grammar.
    grammar._matchStateInitializer =
      grammar.superGrammar._matchStateInitializer
    grammar.supportsIncrementalParsing =
      grammar.superGrammar.supportsIncrementalParsing
    // TODO: change the pexpr.prototype.assert... methods to make them add
    // exceptions to an array that's provided as an arg. Then we'll be able to
    // show more than one error of the same type at a time.
    // TODO: include the offending pexpr in the errors, that way we can show
    // the part of the source that caused it.
    const grammarErrors = []
    let grammarHasInvalidApplications = false
    Object.keys(grammar.rules).forEach((ruleName) => {
      const { body } = grammar.rules[ruleName]
      try {
        body.assertChoicesHaveUniformArity(ruleName)
      } catch (e) {
        grammarErrors.push(e)
      }
      try {
        body.assertAllApplicationsAreValid(ruleName, grammar)
      } catch (e) {
        grammarErrors.push(e)
        grammarHasInvalidApplications = true
      }
    })
    if (
      !grammarHasInvalidApplications
    ) // The following check can only be done if the grammar has no invalid applications.
    {
      Object.keys(grammar.rules).forEach((ruleName) => {
        const { body } = grammar.rules[ruleName]
        try {
          body.assertIteratedExprsAreNotNullable(grammar, [])
        } catch (e) {
          grammarErrors.push(e)
        }
      })
    }
    if (grammarErrors.length > 0) { $a0b00490599d0190$export$85b9972f25847cb(grammarErrors) }
    if (this.source) grammar.source = this.source
    return grammar
  }

  // Rule declarations
  define (name, formals, body, description, source, primitive) {
    this.ensureSuperGrammar()
    if (this.superGrammar.rules[name]) {
      throw $a0b00490599d0190$export$9bfb44bf175cf0b5(
        name,
        this.name,
        this.superGrammar.name,
        source
      )
    } else if (this.rules[name]) {
      throw $a0b00490599d0190$export$9bfb44bf175cf0b5(
        name,
        this.name,
        this.name,
        source
      )
    }
    const duplicateParameterNames = (0,
    $e2c0af47b6882e74$export$1a47093b60e54e96)(formals)
    if (duplicateParameterNames.length > 0) {
      throw $a0b00490599d0190$export$7060ae4b85bc6c61(
        name,
        duplicateParameterNames,
        source
      )
    }
    return this.install(name, formals, body, description, source, primitive)
  }

  override (name, formals, body, descIgnored, source) {
    this.ensureSuperGrammarRuleForOverriding(name, source)
    this.installOverriddenOrExtendedRule(name, formals, body, source)
    return this
  }

  extend (name, formals, fragment, descIgnored, source) {
    const ruleInfo = this.ensureSuperGrammar().rules[name]
    if (!ruleInfo) {
      throw $a0b00490599d0190$export$d6f61fa3efbad9d1(
        name,
        this.superGrammar.name,
        source
      )
    }
    const body = new $b477363445c611b4$export$5b5dd0e212d2a5bc(
      this.superGrammar,
      name,
      fragment
    )
    body.source = fragment.source
    this.installOverriddenOrExtendedRule(name, formals, body, source)
    return this
  }
}

class $f81fcc927ee076e6$export$f75e4297694ec637 {
  constructor (options) {
    this.currentDecl = null
    this.currentRuleName = null
    this.options = options || {}
  }

  newGrammar (name) {
    return new (0, $a13a66665c13c6a0$export$de188f5a432f7523)(name)
  }

  grammar (metaInfo, name, superGrammar, defaultStartRule, rules) {
    const gDecl = new (0, $a13a66665c13c6a0$export$de188f5a432f7523)(name)
    if (
      superGrammar
    ) // `superGrammar` may be a recipe (i.e. an Array), or an actual grammar instance.
    {
      gDecl.withSuperGrammar(
        superGrammar instanceof (0, $335ed4fc151b1ab9$export$553a52f18b21505e)
          ? superGrammar
          : this.fromRecipe(superGrammar)
      )
    }
    if (defaultStartRule) gDecl.withDefaultStartRule(defaultStartRule)
    if (metaInfo && metaInfo.source) gDecl.withSource(metaInfo.source)
    this.currentDecl = gDecl
    Object.keys(rules).forEach((ruleName) => {
      this.currentRuleName = ruleName
      const ruleRecipe = rules[ruleName]
      const action = ruleRecipe[0] // define/extend/override
      const metaInfo = ruleRecipe[1]
      const description = ruleRecipe[2]
      const formals = ruleRecipe[3]
      const body = this.fromRecipe(ruleRecipe[4])
      let source
      if (gDecl.source && metaInfo && metaInfo.sourceInterval) {
        source = gDecl.source.subInterval(
          metaInfo.sourceInterval[0],
          metaInfo.sourceInterval[1] - metaInfo.sourceInterval[0]
        )
      }
      gDecl[action](ruleName, formals, body, description, source)
    })
    this.currentRuleName = this.currentDecl = null
    return gDecl.build()
  }

  terminal (x) {
    return new $b477363445c611b4$export$8dd80f06eb58bfe1(x)
  }

  range (from, to) {
    return new $b477363445c611b4$export$9a58ef0d7ad3278c(from, to)
  }

  param (index) {
    return new $b477363445c611b4$export$1ca45c9a47aec42c(index)
  }

  alt (...termArgs) {
    let terms = []
    for (let arg of termArgs) {
      if (!(arg instanceof $b477363445c611b4$export$f1bb6ea3bbab87ba)) { arg = this.fromRecipe(arg) }
      if (arg instanceof $b477363445c611b4$export$25ba4469a069167) { terms = terms.concat(arg.terms) } else terms.push(arg)
    }
    return terms.length === 1
      ? terms[0]
      : new $b477363445c611b4$export$25ba4469a069167(terms)
  }

  seq (...factorArgs) {
    let factors = []
    for (let arg of factorArgs) {
      if (!(arg instanceof $b477363445c611b4$export$f1bb6ea3bbab87ba)) { arg = this.fromRecipe(arg) }
      if (arg instanceof $b477363445c611b4$export$4802c350533dc67e) { factors = factors.concat(arg.factors) } else factors.push(arg)
    }
    return factors.length === 1
      ? factors[0]
      : new $b477363445c611b4$export$4802c350533dc67e(factors)
  }

  star (expr) {
    if (!(expr instanceof $b477363445c611b4$export$f1bb6ea3bbab87ba)) { expr = this.fromRecipe(expr) }
    return new $b477363445c611b4$export$1644ba17714857f1(expr)
  }

  plus (expr) {
    if (!(expr instanceof $b477363445c611b4$export$f1bb6ea3bbab87ba)) { expr = this.fromRecipe(expr) }
    return new $b477363445c611b4$export$2d9ac7aa84f97a08(expr)
  }

  opt (expr) {
    if (!(expr instanceof $b477363445c611b4$export$f1bb6ea3bbab87ba)) { expr = this.fromRecipe(expr) }
    return new $b477363445c611b4$export$a76800b3cc430f35(expr)
  }

  not (expr) {
    if (!(expr instanceof $b477363445c611b4$export$f1bb6ea3bbab87ba)) { expr = this.fromRecipe(expr) }
    return new $b477363445c611b4$export$8c5a605c8776de77(expr)
  }

  lookahead (expr) {
    if (!(expr instanceof $b477363445c611b4$export$f1bb6ea3bbab87ba)) { expr = this.fromRecipe(expr) }
    // For v18 compatibility, where we don't want a binding for lookahead.
    if (this.options.eliminateLookaheads) {
      return new $b477363445c611b4$export$8c5a605c8776de77(
        new $b477363445c611b4$export$8c5a605c8776de77(expr)
      )
    }
    return new $b477363445c611b4$export$580268a9119fd710(expr)
  }

  lex (expr) {
    if (!(expr instanceof $b477363445c611b4$export$f1bb6ea3bbab87ba)) { expr = this.fromRecipe(expr) }
    return new $b477363445c611b4$export$43a76c134e83307c(expr)
  }

  app (ruleName, optParams) {
    if (optParams && optParams.length > 0) {
      optParams = optParams.map(function (param) {
        return param instanceof $b477363445c611b4$export$f1bb6ea3bbab87ba
          ? param
          : this.fromRecipe(param)
      }, this)
    }
    return new $b477363445c611b4$export$efc21ddc6aeb363d(ruleName, optParams)
  }

  // Note that unlike other methods in this class, this method cannot be used as a
  // convenience constructor. It only works with recipes, because it relies on
  // `this.currentDecl` and `this.currentRuleName` being set.
  splice (beforeTerms, afterTerms) {
    return new $b477363445c611b4$export$ceb3ee475cfd64d1(
      this.currentDecl.superGrammar,
      this.currentRuleName,
      beforeTerms.map((term) => this.fromRecipe(term)),
      afterTerms.map((term) => this.fromRecipe(term))
    )
  }

  fromRecipe (recipe) {
    // the meta-info of 'grammar' is processed in Builder.grammar
    const args = recipe[0] === 'grammar' ? recipe.slice(1) : recipe.slice(2)
    const result = this[recipe[0]](...args)
    const metaInfo = recipe[1]
    if (metaInfo) {
      if (metaInfo.sourceInterval && this.currentDecl) {
        result.withSource(
          this.currentDecl.sourceInterval(...metaInfo.sourceInterval)
        )
      }
    }
    return result
  }
}

function $47d3a3b7dcef659f$export$85748b62f76fe970 (recipe) {
  if (typeof recipe === 'function') { return recipe.call(new (0, $f81fcc927ee076e6$export$f75e4297694ec637)()) } else {
    if (typeof recipe === 'string') // stringified JSON recipe
    {
      recipe = JSON.parse(recipe)
    }
    return new (0, $f81fcc927ee076e6$export$f75e4297694ec637)().fromRecipe(
      recipe
    )
  }
}

const $cf8df08dcd13c713$export$2e2bcd8739ae039 = (0,
$47d3a3b7dcef659f$export$85748b62f76fe970)([
  'grammar',
  {
    source:
      'BuiltInRules {\n\n  alnum  (an alpha-numeric character)\n    = letter\n    | digit\n\n  letter  (a letter)\n    = lower\n    | upper\n    | unicodeLtmo\n\n  digit  (a digit)\n    = "0".."9"\n\n  hexDigit  (a hexadecimal digit)\n    = digit\n    | "a".."f"\n    | "A".."F"\n\n  ListOf<elem, sep>\n    = NonemptyListOf<elem, sep>\n    | EmptyListOf<elem, sep>\n\n  NonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  EmptyListOf<elem, sep>\n    = /* nothing */\n\n  listOf<elem, sep>\n    = nonemptyListOf<elem, sep>\n    | emptyListOf<elem, sep>\n\n  nonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  emptyListOf<elem, sep>\n    = /* nothing */\n\n  // Allows a syntactic rule application within a lexical context.\n  applySyntactic<app> = app\n}'
  },
  'BuiltInRules',
  null,
  null,
  {
    alnum: [
      'define',
      {
        sourceInterval: [18, 78]
      },
      'an alpha-numeric character',
      [],
      [
        'alt',
        {
          sourceInterval: [60, 78]
        },
        [
          'app',
          {
            sourceInterval: [60, 66]
          },
          'letter',
          []
        ],
        [
          'app',
          {
            sourceInterval: [73, 78]
          },
          'digit',
          []
        ]
      ]
    ],
    letter: [
      'define',
      {
        sourceInterval: [82, 142]
      },
      'a letter',
      [],
      [
        'alt',
        {
          sourceInterval: [107, 142]
        },
        [
          'app',
          {
            sourceInterval: [107, 112]
          },
          'lower',
          []
        ],
        [
          'app',
          {
            sourceInterval: [119, 124]
          },
          'upper',
          []
        ],
        [
          'app',
          {
            sourceInterval: [131, 142]
          },
          'unicodeLtmo',
          []
        ]
      ]
    ],
    digit: [
      'define',
      {
        sourceInterval: [146, 177]
      },
      'a digit',
      [],
      [
        'range',
        {
          sourceInterval: [169, 177]
        },
        '0',
        '9'
      ]
    ],
    hexDigit: [
      'define',
      {
        sourceInterval: [181, 254]
      },
      'a hexadecimal digit',
      [],
      [
        'alt',
        {
          sourceInterval: [219, 254]
        },
        [
          'app',
          {
            sourceInterval: [219, 224]
          },
          'digit',
          []
        ],
        [
          'range',
          {
            sourceInterval: [231, 239]
          },
          'a',
          'f'
        ],
        [
          'range',
          {
            sourceInterval: [246, 254]
          },
          'A',
          'F'
        ]
      ]
    ],
    ListOf: [
      'define',
      {
        sourceInterval: [258, 336]
      },
      null,
      ['elem', 'sep'],
      [
        'alt',
        {
          sourceInterval: [282, 336]
        },
        [
          'app',
          {
            sourceInterval: [282, 307]
          },
          'NonemptyListOf',
          [
            [
              'param',
              {
                sourceInterval: [297, 301]
              },
              0
            ],
            [
              'param',
              {
                sourceInterval: [303, 306]
              },
              1
            ]
          ]
        ],
        [
          'app',
          {
            sourceInterval: [314, 336]
          },
          'EmptyListOf',
          [
            [
              'param',
              {
                sourceInterval: [326, 330]
              },
              0
            ],
            [
              'param',
              {
                sourceInterval: [332, 335]
              },
              1
            ]
          ]
        ]
      ]
    ],
    NonemptyListOf: [
      'define',
      {
        sourceInterval: [340, 388]
      },
      null,
      ['elem', 'sep'],
      [
        'seq',
        {
          sourceInterval: [372, 388]
        },
        [
          'param',
          {
            sourceInterval: [372, 376]
          },
          0
        ],
        [
          'star',
          {
            sourceInterval: [377, 388]
          },
          [
            'seq',
            {
              sourceInterval: [378, 386]
            },
            [
              'param',
              {
                sourceInterval: [378, 381]
              },
              1
            ],
            [
              'param',
              {
                sourceInterval: [382, 386]
              },
              0
            ]
          ]
        ]
      ]
    ],
    EmptyListOf: [
      'define',
      {
        sourceInterval: [392, 434]
      },
      null,
      ['elem', 'sep'],
      [
        'seq',
        {
          sourceInterval: [438, 438]
        }
      ]
    ],
    listOf: [
      'define',
      {
        sourceInterval: [438, 516]
      },
      null,
      ['elem', 'sep'],
      [
        'alt',
        {
          sourceInterval: [462, 516]
        },
        [
          'app',
          {
            sourceInterval: [462, 487]
          },
          'nonemptyListOf',
          [
            [
              'param',
              {
                sourceInterval: [477, 481]
              },
              0
            ],
            [
              'param',
              {
                sourceInterval: [483, 486]
              },
              1
            ]
          ]
        ],
        [
          'app',
          {
            sourceInterval: [494, 516]
          },
          'emptyListOf',
          [
            [
              'param',
              {
                sourceInterval: [506, 510]
              },
              0
            ],
            [
              'param',
              {
                sourceInterval: [512, 515]
              },
              1
            ]
          ]
        ]
      ]
    ],
    nonemptyListOf: [
      'define',
      {
        sourceInterval: [520, 568]
      },
      null,
      ['elem', 'sep'],
      [
        'seq',
        {
          sourceInterval: [552, 568]
        },
        [
          'param',
          {
            sourceInterval: [552, 556]
          },
          0
        ],
        [
          'star',
          {
            sourceInterval: [557, 568]
          },
          [
            'seq',
            {
              sourceInterval: [558, 566]
            },
            [
              'param',
              {
                sourceInterval: [558, 561]
              },
              1
            ],
            [
              'param',
              {
                sourceInterval: [562, 566]
              },
              0
            ]
          ]
        ]
      ]
    ],
    emptyListOf: [
      'define',
      {
        sourceInterval: [572, 682]
      },
      null,
      ['elem', 'sep'],
      [
        'seq',
        {
          sourceInterval: [685, 685]
        }
      ]
    ],
    applySyntactic: [
      'define',
      {
        sourceInterval: [685, 710]
      },
      null,
      ['app'],
      [
        'param',
        {
          sourceInterval: [707, 710]
        },
        0
      ]
    ]
  }
]);

(0, $335ed4fc151b1ab9$export$553a52f18b21505e).BuiltInRules =
  (0, $cf8df08dcd13c713$export$2e2bcd8739ae039);
(0, $ceddbabc7a573b89$export$be176d47c2921f22)(
  (0, $335ed4fc151b1ab9$export$553a52f18b21505e).BuiltInRules
)

const $67f22e211920046e$export$2e2bcd8739ae039 = (0,
$47d3a3b7dcef659f$export$85748b62f76fe970)([
  'grammar',
  {
    source:
      'Ohm {\n\n  Grammars\n    = Grammar*\n\n  Grammar\n    = ident SuperGrammar? "{" Rule* "}"\n\n  SuperGrammar\n    = "<:" ident\n\n  Rule\n    = ident Formals? ruleDescr? "="  RuleBody  -- define\n    | ident Formals?            ":=" OverrideRuleBody  -- override\n    | ident Formals?            "+=" RuleBody  -- extend\n\n  RuleBody\n    = "|"? NonemptyListOf<TopLevelTerm, "|">\n\n  TopLevelTerm\n    = Seq caseName  -- inline\n    | Seq\n\n  OverrideRuleBody\n    = "|"? NonemptyListOf<OverrideTopLevelTerm, "|">\n\n  OverrideTopLevelTerm\n    = "..."  -- superSplice\n    | TopLevelTerm\n\n  Formals\n    = "<" ListOf<ident, ","> ">"\n\n  Params\n    = "<" ListOf<Seq, ","> ">"\n\n  Alt\n    = NonemptyListOf<Seq, "|">\n\n  Seq\n    = Iter*\n\n  Iter\n    = Pred "*"  -- star\n    | Pred "+"  -- plus\n    | Pred "?"  -- opt\n    | Pred\n\n  Pred\n    = "~" Lex  -- not\n    | "&" Lex  -- lookahead\n    | Lex\n\n  Lex\n    = "#" Base  -- lex\n    | Base\n\n  Base\n    = ident Params? ~(ruleDescr? "=" | ":=" | "+=")  -- application\n    | oneCharTerminal ".." oneCharTerminal           -- range\n    | terminal                                       -- terminal\n    | "(" Alt ")"                                    -- paren\n\n  ruleDescr  (a rule description)\n    = "(" ruleDescrText ")"\n\n  ruleDescrText\n    = (~")" any)*\n\n  caseName\n    = "--" (~"\\n" space)* name (~"\\n" space)* ("\\n" | &"}")\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = "_"\n    | letter\n\n  nameRest\n    = "_"\n    | alnum\n\n  ident  (an identifier)\n    = name\n\n  terminal\n    = "\\"" terminalChar* "\\""\n\n  oneCharTerminal\n    = "\\"" terminalChar "\\""\n\n  terminalChar\n    = escapeChar\n      | ~"\\\\" ~"\\"" ~"\\n" "\\u{0}".."\\u{10FFFF}"\n\n  escapeChar  (an escape sequence)\n    = "\\\\\\\\"                                     -- backslash\n    | "\\\\\\""                                     -- doubleQuote\n    | "\\\\\\\'"                                     -- singleQuote\n    | "\\\\b"                                      -- backspace\n    | "\\\\n"                                      -- lineFeed\n    | "\\\\r"                                      -- carriageReturn\n    | "\\\\t"                                      -- tab\n    | "\\\\u{" hexDigit hexDigit? hexDigit?\n             hexDigit? hexDigit? hexDigit? "}"   -- unicodeCodePoint\n    | "\\\\u" hexDigit hexDigit hexDigit hexDigit  -- unicodeEscape\n    | "\\\\x" hexDigit hexDigit                    -- hexEscape\n\n  space\n   += comment\n\n  comment\n    = "//" (~"\\n" any)* &("\\n" | end)  -- singleLine\n    | "/*" (~"*/" any)* "*/"  -- multiLine\n\n  tokens = token*\n\n  token = caseName | comment | ident | operator | punctuation | terminal | any\n\n  operator = "<:" | "=" | ":=" | "+=" | "*" | "+" | "?" | "~" | "&"\n\n  punctuation = "<" | ">" | "," | "--"\n}'
  },
  'Ohm',
  null,
  'Grammars',
  {
    Grammars: [
      'define',
      {
        sourceInterval: [9, 32]
      },
      null,
      [],
      [
        'star',
        {
          sourceInterval: [24, 32]
        },
        [
          'app',
          {
            sourceInterval: [24, 31]
          },
          'Grammar',
          []
        ]
      ]
    ],
    Grammar: [
      'define',
      {
        sourceInterval: [36, 83]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [50, 83]
        },
        [
          'app',
          {
            sourceInterval: [50, 55]
          },
          'ident',
          []
        ],
        [
          'opt',
          {
            sourceInterval: [56, 69]
          },
          [
            'app',
            {
              sourceInterval: [56, 68]
            },
            'SuperGrammar',
            []
          ]
        ],
        [
          'terminal',
          {
            sourceInterval: [70, 73]
          },
          '{'
        ],
        [
          'star',
          {
            sourceInterval: [74, 79]
          },
          [
            'app',
            {
              sourceInterval: [74, 78]
            },
            'Rule',
            []
          ]
        ],
        [
          'terminal',
          {
            sourceInterval: [80, 83]
          },
          '}'
        ]
      ]
    ],
    SuperGrammar: [
      'define',
      {
        sourceInterval: [87, 116]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [106, 116]
        },
        [
          'terminal',
          {
            sourceInterval: [106, 110]
          },
          '<:'
        ],
        [
          'app',
          {
            sourceInterval: [111, 116]
          },
          'ident',
          []
        ]
      ]
    ],
    Rule_define: [
      'define',
      {
        sourceInterval: [131, 181]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [131, 170]
        },
        [
          'app',
          {
            sourceInterval: [131, 136]
          },
          'ident',
          []
        ],
        [
          'opt',
          {
            sourceInterval: [137, 145]
          },
          [
            'app',
            {
              sourceInterval: [137, 144]
            },
            'Formals',
            []
          ]
        ],
        [
          'opt',
          {
            sourceInterval: [146, 156]
          },
          [
            'app',
            {
              sourceInterval: [146, 155]
            },
            'ruleDescr',
            []
          ]
        ],
        [
          'terminal',
          {
            sourceInterval: [157, 160]
          },
          '='
        ],
        [
          'app',
          {
            sourceInterval: [162, 170]
          },
          'RuleBody',
          []
        ]
      ]
    ],
    Rule_override: [
      'define',
      {
        sourceInterval: [188, 248]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [188, 235]
        },
        [
          'app',
          {
            sourceInterval: [188, 193]
          },
          'ident',
          []
        ],
        [
          'opt',
          {
            sourceInterval: [194, 202]
          },
          [
            'app',
            {
              sourceInterval: [194, 201]
            },
            'Formals',
            []
          ]
        ],
        [
          'terminal',
          {
            sourceInterval: [214, 218]
          },
          ':='
        ],
        [
          'app',
          {
            sourceInterval: [219, 235]
          },
          'OverrideRuleBody',
          []
        ]
      ]
    ],
    Rule_extend: [
      'define',
      {
        sourceInterval: [255, 305]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [255, 294]
        },
        [
          'app',
          {
            sourceInterval: [255, 260]
          },
          'ident',
          []
        ],
        [
          'opt',
          {
            sourceInterval: [261, 269]
          },
          [
            'app',
            {
              sourceInterval: [261, 268]
            },
            'Formals',
            []
          ]
        ],
        [
          'terminal',
          {
            sourceInterval: [281, 285]
          },
          '+='
        ],
        [
          'app',
          {
            sourceInterval: [286, 294]
          },
          'RuleBody',
          []
        ]
      ]
    ],
    Rule: [
      'define',
      {
        sourceInterval: [120, 305]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [131, 305]
        },
        [
          'app',
          {
            sourceInterval: [131, 170]
          },
          'Rule_define',
          []
        ],
        [
          'app',
          {
            sourceInterval: [188, 235]
          },
          'Rule_override',
          []
        ],
        [
          'app',
          {
            sourceInterval: [255, 294]
          },
          'Rule_extend',
          []
        ]
      ]
    ],
    RuleBody: [
      'define',
      {
        sourceInterval: [309, 362]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [324, 362]
        },
        [
          'opt',
          {
            sourceInterval: [324, 328]
          },
          [
            'terminal',
            {
              sourceInterval: [324, 327]
            },
            '|'
          ]
        ],
        [
          'app',
          {
            sourceInterval: [329, 362]
          },
          'NonemptyListOf',
          [
            [
              'app',
              {
                sourceInterval: [344, 356]
              },
              'TopLevelTerm',
              []
            ],
            [
              'terminal',
              {
                sourceInterval: [358, 361]
              },
              '|'
            ]
          ]
        ]
      ]
    ],
    TopLevelTerm_inline: [
      'define',
      {
        sourceInterval: [385, 408]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [385, 397]
        },
        [
          'app',
          {
            sourceInterval: [385, 388]
          },
          'Seq',
          []
        ],
        [
          'app',
          {
            sourceInterval: [389, 397]
          },
          'caseName',
          []
        ]
      ]
    ],
    TopLevelTerm: [
      'define',
      {
        sourceInterval: [366, 418]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [385, 418]
        },
        [
          'app',
          {
            sourceInterval: [385, 397]
          },
          'TopLevelTerm_inline',
          []
        ],
        [
          'app',
          {
            sourceInterval: [415, 418]
          },
          'Seq',
          []
        ]
      ]
    ],
    OverrideRuleBody: [
      'define',
      {
        sourceInterval: [422, 491]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [445, 491]
        },
        [
          'opt',
          {
            sourceInterval: [445, 449]
          },
          [
            'terminal',
            {
              sourceInterval: [445, 448]
            },
            '|'
          ]
        ],
        [
          'app',
          {
            sourceInterval: [450, 491]
          },
          'NonemptyListOf',
          [
            [
              'app',
              {
                sourceInterval: [465, 485]
              },
              'OverrideTopLevelTerm',
              []
            ],
            [
              'terminal',
              {
                sourceInterval: [487, 490]
              },
              '|'
            ]
          ]
        ]
      ]
    ],
    OverrideTopLevelTerm_superSplice: [
      'define',
      {
        sourceInterval: [522, 543]
      },
      null,
      [],
      [
        'terminal',
        {
          sourceInterval: [522, 527]
        },
        '...'
      ]
    ],
    OverrideTopLevelTerm: [
      'define',
      {
        sourceInterval: [495, 562]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [522, 562]
        },
        [
          'app',
          {
            sourceInterval: [522, 527]
          },
          'OverrideTopLevelTerm_superSplice',
          []
        ],
        [
          'app',
          {
            sourceInterval: [550, 562]
          },
          'TopLevelTerm',
          []
        ]
      ]
    ],
    Formals: [
      'define',
      {
        sourceInterval: [566, 606]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [580, 606]
        },
        [
          'terminal',
          {
            sourceInterval: [580, 583]
          },
          '<'
        ],
        [
          'app',
          {
            sourceInterval: [584, 602]
          },
          'ListOf',
          [
            [
              'app',
              {
                sourceInterval: [591, 596]
              },
              'ident',
              []
            ],
            [
              'terminal',
              {
                sourceInterval: [598, 601]
              },
              ','
            ]
          ]
        ],
        [
          'terminal',
          {
            sourceInterval: [603, 606]
          },
          '>'
        ]
      ]
    ],
    Params: [
      'define',
      {
        sourceInterval: [610, 647]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [623, 647]
        },
        [
          'terminal',
          {
            sourceInterval: [623, 626]
          },
          '<'
        ],
        [
          'app',
          {
            sourceInterval: [627, 643]
          },
          'ListOf',
          [
            [
              'app',
              {
                sourceInterval: [634, 637]
              },
              'Seq',
              []
            ],
            [
              'terminal',
              {
                sourceInterval: [639, 642]
              },
              ','
            ]
          ]
        ],
        [
          'terminal',
          {
            sourceInterval: [644, 647]
          },
          '>'
        ]
      ]
    ],
    Alt: [
      'define',
      {
        sourceInterval: [651, 685]
      },
      null,
      [],
      [
        'app',
        {
          sourceInterval: [661, 685]
        },
        'NonemptyListOf',
        [
          [
            'app',
            {
              sourceInterval: [676, 679]
            },
            'Seq',
            []
          ],
          [
            'terminal',
            {
              sourceInterval: [681, 684]
            },
            '|'
          ]
        ]
      ]
    ],
    Seq: [
      'define',
      {
        sourceInterval: [689, 704]
      },
      null,
      [],
      [
        'star',
        {
          sourceInterval: [699, 704]
        },
        [
          'app',
          {
            sourceInterval: [699, 703]
          },
          'Iter',
          []
        ]
      ]
    ],
    Iter_star: [
      'define',
      {
        sourceInterval: [719, 736]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [719, 727]
        },
        [
          'app',
          {
            sourceInterval: [719, 723]
          },
          'Pred',
          []
        ],
        [
          'terminal',
          {
            sourceInterval: [724, 727]
          },
          '*'
        ]
      ]
    ],
    Iter_plus: [
      'define',
      {
        sourceInterval: [743, 760]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [743, 751]
        },
        [
          'app',
          {
            sourceInterval: [743, 747]
          },
          'Pred',
          []
        ],
        [
          'terminal',
          {
            sourceInterval: [748, 751]
          },
          '+'
        ]
      ]
    ],
    Iter_opt: [
      'define',
      {
        sourceInterval: [767, 783]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [767, 775]
        },
        [
          'app',
          {
            sourceInterval: [767, 771]
          },
          'Pred',
          []
        ],
        [
          'terminal',
          {
            sourceInterval: [772, 775]
          },
          '?'
        ]
      ]
    ],
    Iter: [
      'define',
      {
        sourceInterval: [708, 794]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [719, 794]
        },
        [
          'app',
          {
            sourceInterval: [719, 727]
          },
          'Iter_star',
          []
        ],
        [
          'app',
          {
            sourceInterval: [743, 751]
          },
          'Iter_plus',
          []
        ],
        [
          'app',
          {
            sourceInterval: [767, 775]
          },
          'Iter_opt',
          []
        ],
        [
          'app',
          {
            sourceInterval: [790, 794]
          },
          'Pred',
          []
        ]
      ]
    ],
    Pred_not: [
      'define',
      {
        sourceInterval: [809, 824]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [809, 816]
        },
        [
          'terminal',
          {
            sourceInterval: [809, 812]
          },
          '~'
        ],
        [
          'app',
          {
            sourceInterval: [813, 816]
          },
          'Lex',
          []
        ]
      ]
    ],
    Pred_lookahead: [
      'define',
      {
        sourceInterval: [831, 852]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [831, 838]
        },
        [
          'terminal',
          {
            sourceInterval: [831, 834]
          },
          '&'
        ],
        [
          'app',
          {
            sourceInterval: [835, 838]
          },
          'Lex',
          []
        ]
      ]
    ],
    Pred: [
      'define',
      {
        sourceInterval: [798, 862]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [809, 862]
        },
        [
          'app',
          {
            sourceInterval: [809, 816]
          },
          'Pred_not',
          []
        ],
        [
          'app',
          {
            sourceInterval: [831, 838]
          },
          'Pred_lookahead',
          []
        ],
        [
          'app',
          {
            sourceInterval: [859, 862]
          },
          'Lex',
          []
        ]
      ]
    ],
    Lex_lex: [
      'define',
      {
        sourceInterval: [876, 892]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [876, 884]
        },
        [
          'terminal',
          {
            sourceInterval: [876, 879]
          },
          '#'
        ],
        [
          'app',
          {
            sourceInterval: [880, 884]
          },
          'Base',
          []
        ]
      ]
    ],
    Lex: [
      'define',
      {
        sourceInterval: [866, 903]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [876, 903]
        },
        [
          'app',
          {
            sourceInterval: [876, 884]
          },
          'Lex_lex',
          []
        ],
        [
          'app',
          {
            sourceInterval: [899, 903]
          },
          'Base',
          []
        ]
      ]
    ],
    Base_application: [
      'define',
      {
        sourceInterval: [918, 979]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [918, 963]
        },
        [
          'app',
          {
            sourceInterval: [918, 923]
          },
          'ident',
          []
        ],
        [
          'opt',
          {
            sourceInterval: [924, 931]
          },
          [
            'app',
            {
              sourceInterval: [924, 930]
            },
            'Params',
            []
          ]
        ],
        [
          'not',
          {
            sourceInterval: [932, 963]
          },
          [
            'alt',
            {
              sourceInterval: [934, 962]
            },
            [
              'seq',
              {
                sourceInterval: [934, 948]
              },
              [
                'opt',
                {
                  sourceInterval: [934, 944]
                },
                [
                  'app',
                  {
                    sourceInterval: [934, 943]
                  },
                  'ruleDescr',
                  []
                ]
              ],
              [
                'terminal',
                {
                  sourceInterval: [945, 948]
                },
                '='
              ]
            ],
            [
              'terminal',
              {
                sourceInterval: [951, 955]
              },
              ':='
            ],
            [
              'terminal',
              {
                sourceInterval: [958, 962]
              },
              '+='
            ]
          ]
        ]
      ]
    ],
    Base_range: [
      'define',
      {
        sourceInterval: [986, 1041]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [986, 1022]
        },
        [
          'app',
          {
            sourceInterval: [986, 1001]
          },
          'oneCharTerminal',
          []
        ],
        [
          'terminal',
          {
            sourceInterval: [1002, 1006]
          },
          '..'
        ],
        [
          'app',
          {
            sourceInterval: [1007, 1022]
          },
          'oneCharTerminal',
          []
        ]
      ]
    ],
    Base_terminal: [
      'define',
      {
        sourceInterval: [1048, 1106]
      },
      null,
      [],
      [
        'app',
        {
          sourceInterval: [1048, 1056]
        },
        'terminal',
        []
      ]
    ],
    Base_paren: [
      'define',
      {
        sourceInterval: [1113, 1168]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [1113, 1124]
        },
        [
          'terminal',
          {
            sourceInterval: [1113, 1116]
          },
          '('
        ],
        [
          'app',
          {
            sourceInterval: [1117, 1120]
          },
          'Alt',
          []
        ],
        [
          'terminal',
          {
            sourceInterval: [1121, 1124]
          },
          ')'
        ]
      ]
    ],
    Base: [
      'define',
      {
        sourceInterval: [907, 1168]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [918, 1168]
        },
        [
          'app',
          {
            sourceInterval: [918, 963]
          },
          'Base_application',
          []
        ],
        [
          'app',
          {
            sourceInterval: [986, 1022]
          },
          'Base_range',
          []
        ],
        [
          'app',
          {
            sourceInterval: [1048, 1056]
          },
          'Base_terminal',
          []
        ],
        [
          'app',
          {
            sourceInterval: [1113, 1124]
          },
          'Base_paren',
          []
        ]
      ]
    ],
    ruleDescr: [
      'define',
      {
        sourceInterval: [1172, 1231]
      },
      'a rule description',
      [],
      [
        'seq',
        {
          sourceInterval: [1210, 1231]
        },
        [
          'terminal',
          {
            sourceInterval: [1210, 1213]
          },
          '('
        ],
        [
          'app',
          {
            sourceInterval: [1214, 1227]
          },
          'ruleDescrText',
          []
        ],
        [
          'terminal',
          {
            sourceInterval: [1228, 1231]
          },
          ')'
        ]
      ]
    ],
    ruleDescrText: [
      'define',
      {
        sourceInterval: [1235, 1266]
      },
      null,
      [],
      [
        'star',
        {
          sourceInterval: [1255, 1266]
        },
        [
          'seq',
          {
            sourceInterval: [1256, 1264]
          },
          [
            'not',
            {
              sourceInterval: [1256, 1260]
            },
            [
              'terminal',
              {
                sourceInterval: [1257, 1260]
              },
              ')'
            ]
          ],
          [
            'app',
            {
              sourceInterval: [1261, 1264]
            },
            'any',
            []
          ]
        ]
      ]
    ],
    caseName: [
      'define',
      {
        sourceInterval: [1270, 1338]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [1285, 1338]
        },
        [
          'terminal',
          {
            sourceInterval: [1285, 1289]
          },
          '--'
        ],
        [
          'star',
          {
            sourceInterval: [1290, 1304]
          },
          [
            'seq',
            {
              sourceInterval: [1291, 1302]
            },
            [
              'not',
              {
                sourceInterval: [1291, 1296]
              },
              [
                'terminal',
                {
                  sourceInterval: [1292, 1296]
                },
                '\n'
              ]
            ],
            [
              'app',
              {
                sourceInterval: [1297, 1302]
              },
              'space',
              []
            ]
          ]
        ],
        [
          'app',
          {
            sourceInterval: [1305, 1309]
          },
          'name',
          []
        ],
        [
          'star',
          {
            sourceInterval: [1310, 1324]
          },
          [
            'seq',
            {
              sourceInterval: [1311, 1322]
            },
            [
              'not',
              {
                sourceInterval: [1311, 1316]
              },
              [
                'terminal',
                {
                  sourceInterval: [1312, 1316]
                },
                '\n'
              ]
            ],
            [
              'app',
              {
                sourceInterval: [1317, 1322]
              },
              'space',
              []
            ]
          ]
        ],
        [
          'alt',
          {
            sourceInterval: [1326, 1337]
          },
          [
            'terminal',
            {
              sourceInterval: [1326, 1330]
            },
            '\n'
          ],
          [
            'lookahead',
            {
              sourceInterval: [1333, 1337]
            },
            [
              'terminal',
              {
                sourceInterval: [1334, 1337]
              },
              '}'
            ]
          ]
        ]
      ]
    ],
    name: [
      'define',
      {
        sourceInterval: [1342, 1382]
      },
      'a name',
      [],
      [
        'seq',
        {
          sourceInterval: [1363, 1382]
        },
        [
          'app',
          {
            sourceInterval: [1363, 1372]
          },
          'nameFirst',
          []
        ],
        [
          'star',
          {
            sourceInterval: [1373, 1382]
          },
          [
            'app',
            {
              sourceInterval: [1373, 1381]
            },
            'nameRest',
            []
          ]
        ]
      ]
    ],
    nameFirst: [
      'define',
      {
        sourceInterval: [1386, 1418]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [1402, 1418]
        },
        [
          'terminal',
          {
            sourceInterval: [1402, 1405]
          },
          '_'
        ],
        [
          'app',
          {
            sourceInterval: [1412, 1418]
          },
          'letter',
          []
        ]
      ]
    ],
    nameRest: [
      'define',
      {
        sourceInterval: [1422, 1452]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [1437, 1452]
        },
        [
          'terminal',
          {
            sourceInterval: [1437, 1440]
          },
          '_'
        ],
        [
          'app',
          {
            sourceInterval: [1447, 1452]
          },
          'alnum',
          []
        ]
      ]
    ],
    ident: [
      'define',
      {
        sourceInterval: [1456, 1489]
      },
      'an identifier',
      [],
      [
        'app',
        {
          sourceInterval: [1485, 1489]
        },
        'name',
        []
      ]
    ],
    terminal: [
      'define',
      {
        sourceInterval: [1493, 1531]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [1508, 1531]
        },
        [
          'terminal',
          {
            sourceInterval: [1508, 1512]
          },
          '"'
        ],
        [
          'star',
          {
            sourceInterval: [1513, 1526]
          },
          [
            'app',
            {
              sourceInterval: [1513, 1525]
            },
            'terminalChar',
            []
          ]
        ],
        [
          'terminal',
          {
            sourceInterval: [1527, 1531]
          },
          '"'
        ]
      ]
    ],
    oneCharTerminal: [
      'define',
      {
        sourceInterval: [1535, 1579]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [1557, 1579]
        },
        [
          'terminal',
          {
            sourceInterval: [1557, 1561]
          },
          '"'
        ],
        [
          'app',
          {
            sourceInterval: [1562, 1574]
          },
          'terminalChar',
          []
        ],
        [
          'terminal',
          {
            sourceInterval: [1575, 1579]
          },
          '"'
        ]
      ]
    ],
    terminalChar: [
      'define',
      {
        sourceInterval: [1583, 1660]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [1602, 1660]
        },
        [
          'app',
          {
            sourceInterval: [1602, 1612]
          },
          'escapeChar',
          []
        ],
        [
          'seq',
          {
            sourceInterval: [1621, 1660]
          },
          [
            'not',
            {
              sourceInterval: [1621, 1626]
            },
            [
              'terminal',
              {
                sourceInterval: [1622, 1626]
              },
              '\\'
            ]
          ],
          [
            'not',
            {
              sourceInterval: [1627, 1632]
            },
            [
              'terminal',
              {
                sourceInterval: [1628, 1632]
              },
              '"'
            ]
          ],
          [
            'not',
            {
              sourceInterval: [1633, 1638]
            },
            [
              'terminal',
              {
                sourceInterval: [1634, 1638]
              },
              '\n'
            ]
          ],
          [
            'range',
            {
              sourceInterval: [1639, 1660]
            },
            '\u0000',
            '\uDBFF\uDFFF'
          ]
        ]
      ]
    ],
    escapeChar_backslash: [
      'define',
      {
        sourceInterval: [1703, 1758]
      },
      null,
      [],
      [
        'terminal',
        {
          sourceInterval: [1703, 1709]
        },
        '\\\\'
      ]
    ],
    escapeChar_doubleQuote: [
      'define',
      {
        sourceInterval: [1765, 1822]
      },
      null,
      [],
      [
        'terminal',
        {
          sourceInterval: [1765, 1771]
        },
        '\\"'
      ]
    ],
    escapeChar_singleQuote: [
      'define',
      {
        sourceInterval: [1829, 1886]
      },
      null,
      [],
      [
        'terminal',
        {
          sourceInterval: [1829, 1835]
        },
        "\\'"
      ]
    ],
    escapeChar_backspace: [
      'define',
      {
        sourceInterval: [1893, 1948]
      },
      null,
      [],
      [
        'terminal',
        {
          sourceInterval: [1893, 1898]
        },
        '\\b'
      ]
    ],
    escapeChar_lineFeed: [
      'define',
      {
        sourceInterval: [1955, 2009]
      },
      null,
      [],
      [
        'terminal',
        {
          sourceInterval: [1955, 1960]
        },
        '\\n'
      ]
    ],
    escapeChar_carriageReturn: [
      'define',
      {
        sourceInterval: [2016, 2076]
      },
      null,
      [],
      [
        'terminal',
        {
          sourceInterval: [2016, 2021]
        },
        '\\r'
      ]
    ],
    escapeChar_tab: [
      'define',
      {
        sourceInterval: [2083, 2132]
      },
      null,
      [],
      [
        'terminal',
        {
          sourceInterval: [2083, 2088]
        },
        '\\t'
      ]
    ],
    escapeChar_unicodeCodePoint: [
      'define',
      {
        sourceInterval: [2139, 2243]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [2139, 2221]
        },
        [
          'terminal',
          {
            sourceInterval: [2139, 2145]
          },
          '\\u{'
        ],
        [
          'app',
          {
            sourceInterval: [2146, 2154]
          },
          'hexDigit',
          []
        ],
        [
          'opt',
          {
            sourceInterval: [2155, 2164]
          },
          [
            'app',
            {
              sourceInterval: [2155, 2163]
            },
            'hexDigit',
            []
          ]
        ],
        [
          'opt',
          {
            sourceInterval: [2165, 2174]
          },
          [
            'app',
            {
              sourceInterval: [2165, 2173]
            },
            'hexDigit',
            []
          ]
        ],
        [
          'opt',
          {
            sourceInterval: [2188, 2197]
          },
          [
            'app',
            {
              sourceInterval: [2188, 2196]
            },
            'hexDigit',
            []
          ]
        ],
        [
          'opt',
          {
            sourceInterval: [2198, 2207]
          },
          [
            'app',
            {
              sourceInterval: [2198, 2206]
            },
            'hexDigit',
            []
          ]
        ],
        [
          'opt',
          {
            sourceInterval: [2208, 2217]
          },
          [
            'app',
            {
              sourceInterval: [2208, 2216]
            },
            'hexDigit',
            []
          ]
        ],
        [
          'terminal',
          {
            sourceInterval: [2218, 2221]
          },
          '}'
        ]
      ]
    ],
    escapeChar_unicodeEscape: [
      'define',
      {
        sourceInterval: [2250, 2309]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [2250, 2291]
        },
        [
          'terminal',
          {
            sourceInterval: [2250, 2255]
          },
          '\\u'
        ],
        [
          'app',
          {
            sourceInterval: [2256, 2264]
          },
          'hexDigit',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2265, 2273]
          },
          'hexDigit',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2274, 2282]
          },
          'hexDigit',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2283, 2291]
          },
          'hexDigit',
          []
        ]
      ]
    ],
    escapeChar_hexEscape: [
      'define',
      {
        sourceInterval: [2316, 2371]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [2316, 2339]
        },
        [
          'terminal',
          {
            sourceInterval: [2316, 2321]
          },
          '\\x'
        ],
        [
          'app',
          {
            sourceInterval: [2322, 2330]
          },
          'hexDigit',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2331, 2339]
          },
          'hexDigit',
          []
        ]
      ]
    ],
    escapeChar: [
      'define',
      {
        sourceInterval: [1664, 2371]
      },
      'an escape sequence',
      [],
      [
        'alt',
        {
          sourceInterval: [1703, 2371]
        },
        [
          'app',
          {
            sourceInterval: [1703, 1709]
          },
          'escapeChar_backslash',
          []
        ],
        [
          'app',
          {
            sourceInterval: [1765, 1771]
          },
          'escapeChar_doubleQuote',
          []
        ],
        [
          'app',
          {
            sourceInterval: [1829, 1835]
          },
          'escapeChar_singleQuote',
          []
        ],
        [
          'app',
          {
            sourceInterval: [1893, 1898]
          },
          'escapeChar_backspace',
          []
        ],
        [
          'app',
          {
            sourceInterval: [1955, 1960]
          },
          'escapeChar_lineFeed',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2016, 2021]
          },
          'escapeChar_carriageReturn',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2083, 2088]
          },
          'escapeChar_tab',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2139, 2221]
          },
          'escapeChar_unicodeCodePoint',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2250, 2291]
          },
          'escapeChar_unicodeEscape',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2316, 2339]
          },
          'escapeChar_hexEscape',
          []
        ]
      ]
    ],
    space: [
      'extend',
      {
        sourceInterval: [2375, 2394]
      },
      null,
      [],
      [
        'app',
        {
          sourceInterval: [2387, 2394]
        },
        'comment',
        []
      ]
    ],
    comment_singleLine: [
      'define',
      {
        sourceInterval: [2412, 2458]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [2412, 2443]
        },
        [
          'terminal',
          {
            sourceInterval: [2412, 2416]
          },
          '//'
        ],
        [
          'star',
          {
            sourceInterval: [2417, 2429]
          },
          [
            'seq',
            {
              sourceInterval: [2418, 2427]
            },
            [
              'not',
              {
                sourceInterval: [2418, 2423]
              },
              [
                'terminal',
                {
                  sourceInterval: [2419, 2423]
                },
                '\n'
              ]
            ],
            [
              'app',
              {
                sourceInterval: [2424, 2427]
              },
              'any',
              []
            ]
          ]
        ],
        [
          'lookahead',
          {
            sourceInterval: [2430, 2443]
          },
          [
            'alt',
            {
              sourceInterval: [2432, 2442]
            },
            [
              'terminal',
              {
                sourceInterval: [2432, 2436]
              },
              '\n'
            ],
            [
              'app',
              {
                sourceInterval: [2439, 2442]
              },
              'end',
              []
            ]
          ]
        ]
      ]
    ],
    comment_multiLine: [
      'define',
      {
        sourceInterval: [2465, 2501]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [2465, 2487]
        },
        [
          'terminal',
          {
            sourceInterval: [2465, 2469]
          },
          '/*'
        ],
        [
          'star',
          {
            sourceInterval: [2470, 2482]
          },
          [
            'seq',
            {
              sourceInterval: [2471, 2480]
            },
            [
              'not',
              {
                sourceInterval: [2471, 2476]
              },
              [
                'terminal',
                {
                  sourceInterval: [2472, 2476]
                },
                '*/'
              ]
            ],
            [
              'app',
              {
                sourceInterval: [2477, 2480]
              },
              'any',
              []
            ]
          ]
        ],
        [
          'terminal',
          {
            sourceInterval: [2483, 2487]
          },
          '*/'
        ]
      ]
    ],
    comment: [
      'define',
      {
        sourceInterval: [2398, 2501]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [2412, 2501]
        },
        [
          'app',
          {
            sourceInterval: [2412, 2443]
          },
          'comment_singleLine',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2465, 2487]
          },
          'comment_multiLine',
          []
        ]
      ]
    ],
    tokens: [
      'define',
      {
        sourceInterval: [2505, 2520]
      },
      null,
      [],
      [
        'star',
        {
          sourceInterval: [2514, 2520]
        },
        [
          'app',
          {
            sourceInterval: [2514, 2519]
          },
          'token',
          []
        ]
      ]
    ],
    token: [
      'define',
      {
        sourceInterval: [2524, 2600]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [2532, 2600]
        },
        [
          'app',
          {
            sourceInterval: [2532, 2540]
          },
          'caseName',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2543, 2550]
          },
          'comment',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2553, 2558]
          },
          'ident',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2561, 2569]
          },
          'operator',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2572, 2583]
          },
          'punctuation',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2586, 2594]
          },
          'terminal',
          []
        ],
        [
          'app',
          {
            sourceInterval: [2597, 2600]
          },
          'any',
          []
        ]
      ]
    ],
    operator: [
      'define',
      {
        sourceInterval: [2604, 2669]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [2615, 2669]
        },
        [
          'terminal',
          {
            sourceInterval: [2615, 2619]
          },
          '<:'
        ],
        [
          'terminal',
          {
            sourceInterval: [2622, 2625]
          },
          '='
        ],
        [
          'terminal',
          {
            sourceInterval: [2628, 2632]
          },
          ':='
        ],
        [
          'terminal',
          {
            sourceInterval: [2635, 2639]
          },
          '+='
        ],
        [
          'terminal',
          {
            sourceInterval: [2642, 2645]
          },
          '*'
        ],
        [
          'terminal',
          {
            sourceInterval: [2648, 2651]
          },
          '+'
        ],
        [
          'terminal',
          {
            sourceInterval: [2654, 2657]
          },
          '?'
        ],
        [
          'terminal',
          {
            sourceInterval: [2660, 2663]
          },
          '~'
        ],
        [
          'terminal',
          {
            sourceInterval: [2666, 2669]
          },
          '&'
        ]
      ]
    ],
    punctuation: [
      'define',
      {
        sourceInterval: [2673, 2709]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [2687, 2709]
        },
        [
          'terminal',
          {
            sourceInterval: [2687, 2690]
          },
          '<'
        ],
        [
          'terminal',
          {
            sourceInterval: [2693, 2696]
          },
          '>'
        ],
        [
          'terminal',
          {
            sourceInterval: [2699, 2702]
          },
          ','
        ],
        [
          'terminal',
          {
            sourceInterval: [2705, 2709]
          },
          '--'
        ]
      ]
    ]
  }
])

const $7e124ea40e3f2725$var$superSplicePlaceholder = Object.create(
  $b477363445c611b4$export$f1bb6ea3bbab87ba.prototype
)
function $7e124ea40e3f2725$var$namespaceHas (ns, name) {
  // Look for an enumerable property, anywhere in the prototype chain.
  for (const prop in ns) {
    if (prop === name) return true
  }
  return false
}
function $7e124ea40e3f2725$export$f0a33453b950a1a6 (
  match,
  namespace,
  optOhmGrammarForTesting,
  options
) {
  const builder = new (0, $f81fcc927ee076e6$export$f75e4297694ec637)(options)
  let decl
  let currentRuleName
  let currentRuleFormals
  let overriding = false
  const metaGrammar =
    optOhmGrammarForTesting || (0, $67f22e211920046e$export$2e2bcd8739ae039)
  // A visitor that produces a Grammar instance from the CST.
  const helpers = metaGrammar.createSemantics().addOperation('visit', {
    Grammars (grammarIter) {
      return grammarIter.children.map((c) => c.visit())
    },
    Grammar (id, s, _open, rules, _close) {
      const grammarName = id.visit()
      decl = builder.newGrammar(grammarName)
      s.child(0) && s.child(0).visit()
      rules.children.map((c) => c.visit())
      const g = decl.build()
      g.source = this.source.trimmed()
      if ($7e124ea40e3f2725$var$namespaceHas(namespace, grammarName)) { throw $a0b00490599d0190$export$211c0e3ff69bb868(g, namespace) }
      namespace[grammarName] = g
      return g
    },
    SuperGrammar (_, n) {
      const superGrammarName = n.visit()
      if (superGrammarName === 'null') decl.withSuperGrammar(null)
      else {
        if (
          !namespace ||
          !$7e124ea40e3f2725$var$namespaceHas(namespace, superGrammarName)
        ) {
          throw $a0b00490599d0190$export$851b7305dcf6b4fb(
            superGrammarName,
            namespace,
            n.source
          )
        }
        decl.withSuperGrammar(namespace[superGrammarName])
      }
    },
    Rule_define (n, fs, d, _, b) {
      currentRuleName = n.visit()
      currentRuleFormals = fs.children.map((c) => c.visit())[0] || []
      // If there is no default start rule yet, set it now. This must be done before visiting
      // the body, because it might contain an inline rule definition.
      if (
        !decl.defaultStartRule &&
        decl.ensureSuperGrammar() !==
          (0, $335ed4fc151b1ab9$export$553a52f18b21505e).ProtoBuiltInRules
      ) { decl.withDefaultStartRule(currentRuleName) }
      const body = b.visit()
      const description = d.children.map((c) => c.visit())[0]
      const source = this.source.trimmed()
      return decl.define(
        currentRuleName,
        currentRuleFormals,
        body,
        description,
        source
      )
    },
    Rule_override (n, fs, _, b) {
      currentRuleName = n.visit()
      currentRuleFormals = fs.children.map((c) => c.visit())[0] || []
      const source = this.source.trimmed()
      decl.ensureSuperGrammarRuleForOverriding(currentRuleName, source)
      overriding = true
      const body = b.visit()
      overriding = false
      return decl.override(
        currentRuleName,
        currentRuleFormals,
        body,
        null,
        source
      )
    },
    Rule_extend (n, fs, _, b) {
      currentRuleName = n.visit()
      currentRuleFormals = fs.children.map((c) => c.visit())[0] || []
      const body = b.visit()
      const source = this.source.trimmed()
      return decl.extend(
        currentRuleName,
        currentRuleFormals,
        body,
        null,
        source
      )
    },
    RuleBody (_, terms) {
      return builder.alt(...terms.visit()).withSource(this.source)
    },
    OverrideRuleBody (_, terms) {
      const args = terms.visit()
      // Check if the super-splice operator (`...`) appears in the terms.
      const expansionPos = args.indexOf(
        $7e124ea40e3f2725$var$superSplicePlaceholder
      )
      if (expansionPos >= 0) {
        const beforeTerms = args.slice(0, expansionPos)
        const afterTerms = args.slice(expansionPos + 1)
        // Ensure it appears no more than once.
        afterTerms.forEach((t) => {
          if (t === $7e124ea40e3f2725$var$superSplicePlaceholder) { throw $a0b00490599d0190$export$21a2fba0ab980a76(t) }
        })
        return new $b477363445c611b4$export$ceb3ee475cfd64d1(
          decl.superGrammar,
          currentRuleName,
          beforeTerms,
          afterTerms
        ).withSource(this.source)
      } else return builder.alt(...args).withSource(this.source)
    },
    Formals (opointy, fs, cpointy) {
      return fs.visit()
    },
    Params (opointy, ps, cpointy) {
      return ps.visit()
    },
    Alt (seqs) {
      return builder.alt(...seqs.visit()).withSource(this.source)
    },
    TopLevelTerm_inline (b, n) {
      const inlineRuleName = currentRuleName + '_' + n.visit()
      const body = b.visit()
      const source = this.source.trimmed()
      const isNewRuleDeclaration = !(
        decl.superGrammar && decl.superGrammar.rules[inlineRuleName]
      )
      if (overriding && !isNewRuleDeclaration) { decl.override(inlineRuleName, currentRuleFormals, body, null, source) } else decl.define(inlineRuleName, currentRuleFormals, body, null, source)
      const params = currentRuleFormals.map((formal) => builder.app(formal))
      return builder.app(inlineRuleName, params).withSource(body.source)
    },
    OverrideTopLevelTerm_superSplice (_) {
      return $7e124ea40e3f2725$var$superSplicePlaceholder
    },
    Seq (expr) {
      return builder
        .seq(...expr.children.map((c) => c.visit()))
        .withSource(this.source)
    },
    Iter_star (x, _) {
      return builder.star(x.visit()).withSource(this.source)
    },
    Iter_plus (x, _) {
      return builder.plus(x.visit()).withSource(this.source)
    },
    Iter_opt (x, _) {
      return builder.opt(x.visit()).withSource(this.source)
    },
    Pred_not (_, x) {
      return builder.not(x.visit()).withSource(this.source)
    },
    Pred_lookahead (_, x) {
      return builder.lookahead(x.visit()).withSource(this.source)
    },
    Lex_lex (_, x) {
      return builder.lex(x.visit()).withSource(this.source)
    },
    Base_application (rule, ps) {
      const params = ps.children.map((c) => c.visit())[0] || []
      return builder.app(rule.visit(), params).withSource(this.source)
    },
    Base_range (from, _, to) {
      return builder.range(from.visit(), to.visit()).withSource(this.source)
    },
    Base_terminal (expr) {
      return builder.terminal(expr.visit()).withSource(this.source)
    },
    Base_paren (open, x, close) {
      return x.visit()
    },
    ruleDescr (open, t, close) {
      return t.visit()
    },
    ruleDescrText (_) {
      return this.sourceString.trim()
    },
    caseName (_, space1, n, space2, end) {
      return n.visit()
    },
    name (first, rest) {
      return this.sourceString
    },
    nameFirst (expr) {},
    nameRest (expr) {},
    terminal (open, cs, close) {
      return cs.children.map((c) => c.visit()).join('')
    },
    oneCharTerminal (open, c, close) {
      return c.visit()
    },
    escapeChar (c) {
      try {
        return $e2c0af47b6882e74$export$bbcbd90d9a366220(this.sourceString)
      } catch (err) {
        if (
          err instanceof RangeError &&
          err.message.startsWith('Invalid code point ')
        ) { throw $a0b00490599d0190$export$fcc474965e836039(c) }
        throw err // Rethrow
      }
    },
    NonemptyListOf (x, _, xs) {
      return [x.visit()].concat(xs.children.map((c) => c.visit()))
    },
    EmptyListOf () {
      return []
    },
    _terminal () {
      return this.sourceString
    }
  })
  return helpers(match).visit()
}

const $01320ba6fd21119e$export$2e2bcd8739ae039 = (0,
$47d3a3b7dcef659f$export$85748b62f76fe970)([
  'grammar',
  {
    source:
      'OperationsAndAttributes {\n\n  AttributeSignature =\n    name\n\n  OperationSignature =\n    name Formals?\n\n  Formals\n    = "(" ListOf<name, ","> ")"\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = "_"\n    | letter\n\n  nameRest\n    = "_"\n    | alnum\n\n}'
  },
  'OperationsAndAttributes',
  null,
  'AttributeSignature',
  {
    AttributeSignature: [
      'define',
      {
        sourceInterval: [29, 58]
      },
      null,
      [],
      [
        'app',
        {
          sourceInterval: [54, 58]
        },
        'name',
        []
      ]
    ],
    OperationSignature: [
      'define',
      {
        sourceInterval: [62, 100]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [87, 100]
        },
        [
          'app',
          {
            sourceInterval: [87, 91]
          },
          'name',
          []
        ],
        [
          'opt',
          {
            sourceInterval: [92, 100]
          },
          [
            'app',
            {
              sourceInterval: [92, 99]
            },
            'Formals',
            []
          ]
        ]
      ]
    ],
    Formals: [
      'define',
      {
        sourceInterval: [104, 143]
      },
      null,
      [],
      [
        'seq',
        {
          sourceInterval: [118, 143]
        },
        [
          'terminal',
          {
            sourceInterval: [118, 121]
          },
          '('
        ],
        [
          'app',
          {
            sourceInterval: [122, 139]
          },
          'ListOf',
          [
            [
              'app',
              {
                sourceInterval: [129, 133]
              },
              'name',
              []
            ],
            [
              'terminal',
              {
                sourceInterval: [135, 138]
              },
              ','
            ]
          ]
        ],
        [
          'terminal',
          {
            sourceInterval: [140, 143]
          },
          ')'
        ]
      ]
    ],
    name: [
      'define',
      {
        sourceInterval: [147, 187]
      },
      'a name',
      [],
      [
        'seq',
        {
          sourceInterval: [168, 187]
        },
        [
          'app',
          {
            sourceInterval: [168, 177]
          },
          'nameFirst',
          []
        ],
        [
          'star',
          {
            sourceInterval: [178, 187]
          },
          [
            'app',
            {
              sourceInterval: [178, 186]
            },
            'nameRest',
            []
          ]
        ]
      ]
    ],
    nameFirst: [
      'define',
      {
        sourceInterval: [191, 223]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [207, 223]
        },
        [
          'terminal',
          {
            sourceInterval: [207, 210]
          },
          '_'
        ],
        [
          'app',
          {
            sourceInterval: [217, 223]
          },
          'letter',
          []
        ]
      ]
    ],
    nameRest: [
      'define',
      {
        sourceInterval: [227, 257]
      },
      null,
      [],
      [
        'alt',
        {
          sourceInterval: [242, 257]
        },
        [
          'terminal',
          {
            sourceInterval: [242, 245]
          },
          '_'
        ],
        [
          'app',
          {
            sourceInterval: [252, 257]
          },
          'alnum',
          []
        ]
      ]
    ]
  }
])

$814ea6f85f42aea6$var$initBuiltInSemantics(
  (0, $335ed4fc151b1ab9$export$553a52f18b21505e).BuiltInRules
)
$814ea6f85f42aea6$var$initPrototypeParser(
  (0, $01320ba6fd21119e$export$2e2bcd8739ae039)
) // requires BuiltInSemantics
function $814ea6f85f42aea6$var$initBuiltInSemantics (builtInRules) {
  const actions = {
    empty () {
      return this.iteration()
    },
    nonEmpty (first, _, rest) {
      return this.iteration([first].concat(rest.children))
    },
    self (..._children) {
      return this
    }
  };
  (0, $11828b1e50c89002$export$9d201e891b56e96e).BuiltInSemantics = (0,
  $11828b1e50c89002$export$9d201e891b56e96e)
    .createSemantics(builtInRules, null)
    .addOperation('asIteration', {
      emptyListOf: actions.empty,
      nonemptyListOf: actions.nonEmpty,
      EmptyListOf: actions.empty,
      NonemptyListOf: actions.nonEmpty,
      _iter: actions.self
    })
}
function $814ea6f85f42aea6$var$initPrototypeParser (grammar) {
  (0, $11828b1e50c89002$export$9d201e891b56e96e).prototypeGrammarSemantics =
    grammar.createSemantics().addOperation('parse', {
      AttributeSignature (name) {
        return {
          name: name.parse(),
          formals: []
        }
      },
      OperationSignature (name, optFormals) {
        return {
          name: name.parse(),
          formals: optFormals.children.map((c) => c.parse())[0] || []
        }
      },
      Formals (oparen, fs, cparen) {
        return fs.asIteration().children.map((c) => c.parse())
      },
      name (first, rest) {
        return this.sourceString
      }
    });
  (0, $11828b1e50c89002$export$9d201e891b56e96e).prototypeGrammar = grammar
}

function $20c5554a790c2a34$export$21c64fe48385932f (input) {
  let pos = 0
  const stack = [0]
  const topOfStack = () => stack[stack.length - 1]
  const result = {}
  const regex = /( *).*(?:$|\r?\n|\r)/g
  let match
  while ((match = regex.exec(input)) != null) {
    const [line, indent] = match
    // The last match will always have length 0. In every other case, some
    // characters will be matched (possibly only the end of line chars).
    if (line.length === 0) break
    const indentSize = indent.length
    const prevSize = topOfStack()
    const indentPos = pos + indentSize
    if (indentSize > prevSize) {
      // Indent -- always only 1.
      stack.push(indentSize)
      result[indentPos] = 1
    } else if (indentSize < prevSize) {
      // Dedent -- can be multiple levels.
      const prevLength = stack.length
      while (topOfStack() !== indentSize) stack.pop()
      result[indentPos] = -1 * (prevLength - stack.length)
    }
    pos += line.length
  }
  // Ensure that there is a matching DEDENT for every remaining INDENT.
  if (stack.length > 1) result[pos] = 1 - stack.length
  return result
}

const $405dea962c1d5d2f$var$INDENT_DESCRIPTION = 'an indented block'
const $405dea962c1d5d2f$var$DEDENT_DESCRIPTION = 'a dedent'
// A sentinel value that is out of range for both charCodeAt() and codePointAt().
const $405dea962c1d5d2f$var$INVALID_CODE_POINT = 1114112
class $405dea962c1d5d2f$var$InputStreamWithIndentation extends (0,
$304351f7f091c097$export$f22294a9362415e4) {
  constructor (state) {
    super(state.input)
    this.state = state
  }

  _indentationAt (pos) {
    return this.state.userData[pos] || 0
  }

  atEnd () {
    return super.atEnd() && this._indentationAt(this.pos) === 0
  }

  next () {
    if (this._indentationAt(this.pos) !== 0) {
      this.examinedLength = Math.max(this.examinedLength, this.pos)
      return undefined
    }
    return super.next()
  }

  nextCharCode () {
    if (this._indentationAt(this.pos) !== 0) {
      this.examinedLength = Math.max(this.examinedLength, this.pos)
      return $405dea962c1d5d2f$var$INVALID_CODE_POINT
    }
    return super.nextCharCode()
  }

  nextCodePoint () {
    if (this._indentationAt(this.pos) !== 0) {
      this.examinedLength = Math.max(this.examinedLength, this.pos)
      return $405dea962c1d5d2f$var$INVALID_CODE_POINT
    }
    return super.nextCodePoint()
  }
}
class $405dea962c1d5d2f$var$Indentation extends $b477363445c611b4$export$f1bb6ea3bbab87ba {
  constructor (isIndent = true) {
    super()
    this.isIndent = isIndent
  }

  allowsSkippingPrecedingSpace () {
    return true
  }

  eval (state) {
    const { inputStream } = state
    const pseudoTokens = state.userData
    state.doNotMemoize = true
    const origPos = inputStream.pos
    const sign = this.isIndent ? 1 : -1
    const count = (pseudoTokens[origPos] || 0) * sign
    if (count > 0) {
      // Update the count to consume the pseudotoken.
      state.userData = Object.create(pseudoTokens)
      state.userData[origPos] -= sign
      state.pushBinding(
        new (0, $a8ee6022e9bbdc31$export$f6a002739fa43001)(0),
        origPos
      )
      return true
    } else {
      state.processFailure(origPos, this)
      return false
    }
  }

  getArity () {
    return 1
  }

  _assertAllApplicationsAreValid (ruleName, grammar) {}
  _isNullable (grammar, memo) {
    return false
  }

  assertChoicesHaveUniformArity (ruleName) {}
  assertIteratedExprsAreNotNullable (grammar) {}
  introduceParams (formals) {
    return this
  }

  substituteParams (actuals) {
    return this
  }

  toString () {
    return this.isIndent ? 'indent' : 'dedent'
  }

  toDisplayString () {
    return this.toString()
  }

  toFailure (grammar) {
    const description = this.isIndent
      ? $405dea962c1d5d2f$var$INDENT_DESCRIPTION
      : $405dea962c1d5d2f$var$DEDENT_DESCRIPTION
    return new (0, $e23683cac89f84e9$export$5ebc9a4af3ac0850)(
      this,
      description,
      'description'
    )
  }
}
// Create a new definition for `any` that can consume indent & dedent.
const $405dea962c1d5d2f$var$applyIndent =
  new $b477363445c611b4$export$efc21ddc6aeb363d('indent')
const $405dea962c1d5d2f$var$applyDedent =
  new $b477363445c611b4$export$efc21ddc6aeb363d('dedent')
const $405dea962c1d5d2f$var$newAnyBody =
  new $b477363445c611b4$export$ceb3ee475cfd64d1(
    (0, $cf8df08dcd13c713$export$2e2bcd8739ae039),
    'any',
    [$405dea962c1d5d2f$var$applyIndent, $405dea962c1d5d2f$var$applyDedent],
    []
  )
const $405dea962c1d5d2f$export$50f9518753313078 = new (0,
$f81fcc927ee076e6$export$f75e4297694ec637)()
  .newGrammar('IndentationSensitive')
  .withSuperGrammar((0, $cf8df08dcd13c713$export$2e2bcd8739ae039))
  .define(
    'indent',
    [],
    new $405dea962c1d5d2f$var$Indentation(true),
    $405dea962c1d5d2f$var$INDENT_DESCRIPTION,
    undefined,
    true
  )
  .define(
    'dedent',
    [],
    new $405dea962c1d5d2f$var$Indentation(false),
    $405dea962c1d5d2f$var$DEDENT_DESCRIPTION,
    undefined,
    true
  )
  .extend(
    'any',
    [],
    $405dea962c1d5d2f$var$newAnyBody,
    'any character',
    undefined
  )
  .build()
Object.assign($405dea962c1d5d2f$export$50f9518753313078, {
  _matchStateInitializer (state) {
    state.userData = (0, $20c5554a790c2a34$export$21c64fe48385932f)(
      state.input
    )
    state.inputStream = new $405dea962c1d5d2f$var$InputStreamWithIndentation(
      state
    )
  },
  supportsIncrementalParsing: false
})

// Generated by scripts/prebuild.js
const $9ade749a38e2feb4$export$83d89fbfd8236492 = '17.5.0';

(0, $335ed4fc151b1ab9$export$553a52f18b21505e).initApplicationParser(
  (0, $67f22e211920046e$export$2e2bcd8739ae039),
  (0, $7e124ea40e3f2725$export$f0a33453b950a1a6)
)
const $1294e431ab320b5b$var$isBuffer = (obj) =>
  !!obj.constructor &&
  typeof obj.constructor.isBuffer === 'function' &&
  obj.constructor.isBuffer(obj)
function $1294e431ab320b5b$var$compileAndLoad (source, namespace, buildOptions) {
  const m = (0, $67f22e211920046e$export$2e2bcd8739ae039).match(
    source,
    'Grammars'
  )
  if (m.failed()) throw $a0b00490599d0190$export$aa4e38829b7a0199(m)
  return (0, $7e124ea40e3f2725$export$f0a33453b950a1a6)(
    m,
    namespace,
    undefined,
    buildOptions
  )
}
function $1294e431ab320b5b$export$96712698dad3db34 (
  source,
  optNamespace,
  buildOptions
) {
  const ns = $1294e431ab320b5b$export$731aaf871a3732fc(
    source,
    optNamespace,
    buildOptions
  )
  // Ensure that the source contained no more than one grammar definition.
  const grammarNames = Object.keys(ns)
  if (grammarNames.length === 0) throw new Error('Missing grammar definition')
  else if (grammarNames.length > 1) {
    const secondGrammar = ns[grammarNames[1]]
    const interval = secondGrammar.source
    throw new Error(
      $ceddbabc7a573b89$export$c5fbb07c01caabdd(
        interval.sourceString,
        interval.startIdx
      ) +
        'Found more than one grammar definition -- use ohm.grammars() instead.'
    )
  }
  return ns[grammarNames[0]] // Return the one and only grammar.
}
function $1294e431ab320b5b$export$731aaf871a3732fc (
  source,
  optNamespace,
  buildOptions
) {
  const ns = Object.create(optNamespace || {})
  if (typeof source !== 'string') {
    // For convenience, detect Node.js Buffer objects and automatically call toString().
    if ($1294e431ab320b5b$var$isBuffer(source)) source = source.toString()
    else {
      throw new TypeError(
        'Expected string as first argument, got ' +
          $e2c0af47b6882e74$export$81c9cb19ca23770e(source)
      )
    }
  }
  $1294e431ab320b5b$var$compileAndLoad(source, ns, buildOptions)
  return ns
}
function $1294e431ab320b5b$export$b3a6900b22e4209 (source, optNamespace) {
  return $1294e431ab320b5b$export$96712698dad3db34(source, optNamespace)
}
function $1294e431ab320b5b$export$b37d0c5c3fa2df9d (source, optNamespace) {
  return $1294e431ab320b5b$export$731aaf871a3732fc(source, optNamespace)
}

/**
 * Takes in a Starling string.
 * Returns array with Starling string AST and Starling string compiled to Metamath.
 * @param {string} star
 * @returns {Array}
 * @example
 *
 *    compile("define 0;")
 */ const $4ad4a80c0dba78f3$export$ef7acd7185315e22 = (star) => {
  const langGrammar = $1294e431ab320b5b$export$b3a6900b22e4209(
    (0, $c85bf9ccc162a34d$export$4d295a9d2402319b)
  )
  const s = langGrammar
    .createSemantics()
    .addOperation('makeAST', (0, $4e84020b840855f3$export$e324594224ef24da))
  const matchResult = langGrammar.match(star)
  const adapter = s(matchResult).makeAST()
  const ast = (0, $4e84020b840855f3$export$d43989f1fbb8f4f9)(adapter)
  return [ast, (0, $db8e6816c5249ddb$export$e6752350b2f8ac26)(ast)]
}

export {
  $c85bf9ccc162a34d$export$4d295a9d2402319b as starlingGrammar,
  $4e84020b840855f3$export$e324594224ef24da as actions,
  $4e84020b840855f3$export$d43989f1fbb8f4f9 as resolveReferences,
  $db8e6816c5249ddb$export$e6752350b2f8ac26 as transpile,
  $4ad4a80c0dba78f3$export$ef7acd7185315e22 as compile
}
