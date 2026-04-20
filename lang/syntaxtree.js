const actions = {
  Database (stmts) {
    return stmts.children.map((c) => c.makeAST())
  },

  import_stmt (one, name, three, four) {
    return { field: 'import_stmt', value: name.sourceString }
  },
  Const (one, list, semicolon) {
    const stringConsts = list.asIteration().children.map((c) => c.sourceString)
    return { field: 'constant_stmt', value: stringConsts }
  },
  Variable (one, list, three) {
    const childAST = list.makeAST()
    return childAST
  },
  VariableListItem (variable, two, type) {
    const vari = variable.sourceString
    const typ = type.sourceString
    return { field: 'variable-stmt', variable: vari, type: typ }
  },
  Axiom (one, stmt, three, type, five) {
    const axiomatic = stmt.sourceString
    const typ = type.sourceString

    return { field: 'axiom', statement: axiomatic, type: typ }
  },
  Theorem (statement, three, type, four) {
    const stmt = statement.asIteration().children.map((c) => c.sourceString)
    const ind = stmt.indexOf('axiom')
    let fld = 'axiom'

    if (ind > -1) {
      stmt.splice(ind, 1)
    } else {
      fld = 'theorem'
    }
    const typ = type.sourceString
    return { field: fld, statement: stmt, type: typ }
  },
  Essential_hyp (one, assumed, three, type, five) {
    const assumption = assumed.sourceString
    const typ = type.sourceString
    const objet = { field: 'essential-stmt', statement: assumption, type: typ }
    return objet
  },
  Disjoint (one, list, semicolon) {
    return { field: 'disjoint', value: list.sourceString.split(',') }
  },
  To_sub (label, two, inner) {
    const name = label.sourceString
    const a = inner.makeAST()
    return { label: name, inside: a }
  },
  Inner (inside) {
    return inside.makeAST()
  },
  Proof_block (one, thmName, three, arr, five) {
    const theorem = thmName.sourceString
    const prf = arr.asIteration().children.map((c) => c.makeAST())
    return { field: 'proof', value: theorem, proof: prf }
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
    list.makeAST()
  },
  ReplaceListItem (star, colon, mm) {
    return { toReplace: star, replacement: mm }
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

function resolveReferences (arr) {
  const labelMap = {}

  arr.forEach((item) => {
    if (item.label) {
      labelMap[item.label] = item
    }
  })

  arr.forEach((item) => {
    if (item.field === 'proof' && typeof item.value === 'string') {
      const label = item.value
      if (labelMap[label]) {
        item.value = labelMap[label]
      }
    }
  })

  return arr
}

export { actions, resolveReferences }
