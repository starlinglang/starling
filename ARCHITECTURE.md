# Architecture

This document is a work in progress! Feel free to [contribute](CONTRIBUTING.md) better explanations or visualizations.

## Compilation
This diagram describes how Starling gets compiled into Metamath.
```mermaid
flowchart LR
    A["Starling source<br/>(.star file)"] --> B["ohm.js grammar<br/>(grammar.js)"]
    B --> C["ohm.js parser<br/>(syntaxtree.js)"]
    C --> D["AST generation <br/>(makeAST)"]

    D --> E["Clean up AST<br/>(resolveReferences)"]
    E --> F["Metamath transpiler<br/>(mmgen.js, transpile)"]
    F --> G["Metamath output<br/>(.mm file)"]
    
    classDef core fill:#e3f2fd,stroke:#1976d2,stroke-width:2px;
    class A,B,C,D,E,F,G core;

```

## Continuous Integration
This diagram describes the continous integration workflow for this repository.
```mermaid
flowchart LR
    A[git push to<br/>main branch] --> B[commit.yml<br/>commitlint]
    B --> C[lint_test.yml<br/>standard + htmlhint + vitest]
    
    C --> D[releases.yml<br/>version + tag]
    C --> E[static.yml<br/>deploy ide folder]
    D --> G[changelog.yml<br/>changelog generation]
    
    classDef trigger fill:#fff3e0,stroke:#f57c00,stroke-width:2px;
    classDef ci fill:#e8f5e9,stroke:#388e3c,stroke-width:2px;
    classDef deploy fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    
    class A trigger;
    class B,C ci;
    class E,D,G deploy;
```
