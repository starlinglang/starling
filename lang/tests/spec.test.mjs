import { expect, test, afterAll } from 'vitest'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { shortTest, longTest } from './testcases.js'
import { compile } from '../index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const shortFilePath = path.join(__dirname, 'compiled_short.mm')
const longFilePath = path.join(__dirname, 'compiled_long.mm')

try {
  fs.writeFileSync(shortFilePath, compile(shortTest))
  fs.writeFileSync(longFilePath, compile(longTest))
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

test('longTest compiles and passes checkmm', () => {
  try {
    execSync(`npx checkmm "${longFilePath}"`)
  } catch (error) {
    expect.fail(`checkmm failed for longTest: ${error.message}`)
  }
})

afterAll(() => {
  const filesToClean = [shortFilePath, longFilePath]

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
