# Starling Contributing Guide

## Welcome

First off, thank you for considering contributing to Starling. It's people like you that make Starling great.

If you would like to contribute to a specific part of the project, check out the following list of contributions that we accept:

* Starling codebase
  * Git mirror syncing
  * Interactive language documentation

* Starling language
  * Quickcheck tests
  * Theorem counterexample generation
  * Integration with Metamath databases
  * Metamath database search
  * Proof imports from other proof assistants
  * Metamath to Starling compilation

* Starling code editor
  * Error messages
  * Source code definition-on-hover
  * Pantograph integration
  * Remote collaboration
  * Ability to see different branches / try different proof strategies (history viewer)
  * Proof visualization
  * Theorem provenance visualization

However, at this time, we do not accept the following contributions:

* Model Context Protocol integration
* Large language model integration
* React integration

## Starling overview

The purpose of Starling is to make formal verification of mathematical proofs accessible to novices and/or mathematicians without programming experience.

## Ground rules

Before contributing, read our [Code of Conduct](CODE_OF_CONDUCT.md) to learn more about our community guidelines and expectations.

## Share ideas

If you want to share new ideas for this project, feel free to create an [issue](https://github.com/starlinglang/starling/issues). 

## Before you start

Before you start contributing, ensure you have the following installed on your computer:

* [Node.js](https://nodejs.org/en)
* [Git](https://git-scm.com/)
* Web browser
* Code editor 

## Environment setup

To set up your environment, perform the following actions:

Check that you have [Node.js](https://nodejs.org) installed. Go into your [terminal](https://launchschool.com/books/command_line) and type:

```bash
node -v
```

You should see something like:

```bash
v24.13.0
```



Check that [git](https://git-scm.com/) is installed. Go into your [terminal](https://launchschool.com/books/command_line) and type:

```bash
git --version
```

You should see something like:

```bash
git version 2.51.0
```

## Best practices

Our project uses [standard](https://github.com/standard/standard), [commitlint](https://github.com/conventional-changelog/commitlint), and [Vitest](https://vitest.dev/). Reference the documentation from these projects to familiarize yourself with the best practices we want contributors to follow.


## Contribution workflow

### Report issues and bugs

If you find a bug in Starling, [create a new issue](https://github.com/starlinglang/starling/issue).

### Commit messages

Our commits follow the [conventional commit format](https://www.conventionalcommits.org/en/v1.0.0/).

### Branch creation

When working on new features, create new branches with `git checkout -b branchName`.

### Pull requests

Follow the structure of [PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md).

### Changelog

We automate changelog edits with [github-changelog-generator](https://github.com/github-changelog-generator/github-changelog-generator).
