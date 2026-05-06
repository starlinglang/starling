import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const shortTest = fs.readFileSync(
  path.join(__dirname, 'shortTest.star'),
  'utf8'
)
const longTest = fs.readFileSync(path.join(__dirname, 'longTest.star'), 'utf8')
const setmmTest = fs.readFileSync(
  path.join(__dirname, 'setmmTest.star'),
  'utf8'
)

export { shortTest, longTest, setmmTest }
