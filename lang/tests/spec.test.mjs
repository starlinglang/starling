import { expect, test, afterAll } from 'vitest'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { shortTest, longTest, setmmTest } from './testcases.js'
import { compile } from '../index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const shortFilePath = path.join(__dirname, 'compiled_short.mm')
const longFilePath = path.join(__dirname, 'compiled_long.mm')
const setmmPath = path.join(__dirname, 'set.mm')
const setmmTestFilePath = path.join(__dirname, 'compiled_setmmtest.mm')

try {
  fs.writeFileSync(shortFilePath, compile(shortTest)[1])
} catch (error) {
  throw new Error(`Failed to write compiled files: ${error.message}`)
}

test('shortTest compiles and passes checkmm', () => {
  try {
    execSync(`npx checkmm "${shortFilePath}"`)
  } catch (error) {
    expect.fail(`checkmm failed for shortTest: ${error.message}`)
  }
})

try {
  fs.writeFileSync(longFilePath, compile(longTest)[1])
} catch (error) {
  throw new Error(`Failed to write compiled files: ${error.message}`)
}

test('longTest compiles and passes checkmm', () => {
  try {
    execSync(`npx checkmm "${longFilePath}"`)
  } catch (error) {
    expect.fail(`checkmm failed for longTest: ${error.message}`)
  }
})

test('setmmTest compiles and passes checkmm when appended to set.mm', () => {
  try {
    // Download set.mm only if it doesn't exist
    if (!fs.existsSync(setmmPath)) {
      execSync(
        `curl https://raw.githubusercontent.com/metamath/set.mm/develop/set.mm -o "${setmmPath}"`
      )
    }

    const compiledSetmmTest = compile(setmmTest)[1]
    const setmmContent = fs.readFileSync(setmmPath, 'utf-8')
    const combinedContent = setmmContent + '\n' + compiledSetmmTest
    fs.writeFileSync(setmmTestFilePath, combinedContent)

    execSync(`npx checkmm "${setmmTestFilePath}"`)
  } catch (error) {
    expect.fail(
      `checkmm failed for setmmTest appended to set.mm: ${error.message}`
    )
  }
}, 100_000)

afterAll(() => {
  const filesToClean = [
    shortFilePath,
    longFilePath,
    setmmTestFilePath,
    setmmPath
  ]

  filesToClean.forEach((filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      console.warn(`Failed to clean up ${filePath}: ${error.message}`)
    }
  })
})
