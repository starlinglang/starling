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
    return { field: "proof", value: theorem, proof: prf };
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

function resolveReferences(arr) {
  const labelMap = {};

  arr.forEach((item) => {
    if (item.label) {
      labelMap[item.label] = item;
    }
  });

  arr.forEach((item) => {
    if (item.field === "proof" && typeof item.value === "string") {
      const label = item.value;
      if (labelMap[label]) {
        item.value = labelMap[label];
      }
    }
  });

  return arr;
}

module.exports = { actions, resolveReferences };
