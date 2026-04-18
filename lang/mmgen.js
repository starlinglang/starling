function transpile (ast) {
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

  // First pass: collect and categorize statements
  for (const item of ast) {
    if (typeof item === 'string') {
      // Skip comments
      if (item === 'single_line_comment' || item === 'multiline_comment') {
        continue
      }
    } else if (item.field === 'import_stmt') {
      statements.imports.push(item)
    } else if (item.field === 'constant_stmt') {
      statements.constants = item.value
    } else if (item.field === 'variable-stmt') {
      statements.variables.push(item)
    } else if (item.label && item.inside) {
      if (item.inside.field === 'variable-stmt') {
        statements.labeled.push(item)
      } else if (item.inside.field === 'block') {
        statements.blocks.push(item)
      } else if (item.inside.field === 'theorem') {
        statements.theorems.push(item)
      } else {
        statements.labeled.push(item)
      }
    } else if (item.field === 'disjoint') {
      statements.labeled.push(item)
    } else if (item.field === 'block') {
      statements.blocks.push(item)
    } else if (item.field === 'proof') {
      statements.proofs.push(item)
    }
  }

  // Generate imports section
  for (const importItem of statements.imports) {
    output.push(`$[ ${importItem.value} $]`)
  }

  // Generate constants section
  if (statements.constants.length > 0) {
    output.push(`$c ${statements.constants.join(' ')} $.`)
  }

  // Generate variables section
  const allVariables = []
  for (const item of statements.labeled) {
    if (item.inside && item.inside.field === 'variable-stmt') {
      allVariables.push(item.inside.variable)
    }
  }
  if (allVariables.length > 0) {
    output.push(`$v ${allVariables.join(' ')} $.`)
  }

  // Generate labeled statements (variable declarations, axioms, etc.)
  for (const item of statements.labeled) {
    if (item.inside && item.inside.field === 'variable-stmt') {
      const { variable, type } = item.inside
      output.push(`${item.label} $f ${type} ${variable} $.`)
    } else if (item.field === 'disjoint') {
      output.push(`$d ${item.value.join(' ')} $.`)
    } else if (item.inside && item.inside.field === 'axiom') {
      const { statement, type } = item.inside
      const stmt = Array.isArray(statement) ? statement.join(' ') : statement
      output.push(`${item.label} $a ${type} ${stmt} $.`)
    }
  }

  // Generate blocks
  for (const block of statements.blocks) {
    output.push('${')
    for (const blockItem of block.value) {
      if (typeof blockItem === 'string') {
        if (
          blockItem === 'single_line_comment' ||
          blockItem === 'multiline_comment'
        ) {
          continue
        }
      } else if (blockItem.label && blockItem.inside) {
        if (Array.isArray(blockItem.inside)) {
          // Block with essential statements or axioms
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

  // Generate theorems
  for (const item of statements.theorems) {
    if (item.inside && item.inside.field === 'theorem') {
      const { statement, type } = item.inside
      const stmt = Array.isArray(statement) ? statement.join(' ') : statement
      output.push(`${item.label} $p ${type} ${stmt} $= `)
    }
  }

  // Generate proofs
  for (const proofItem of statements.proofs) {
    if (proofItem.proof && Array.isArray(proofItem.proof)) {
      const proofSteps = proofItem.proof.join(' ')
      // Append proof steps to the last line (theorem declaration)
      if (output.length > 0) {
        output[output.length - 1] += proofSteps + '\n$.'
      }
    }
  }

  return output.join('\n')
}

export { transpile }
