/* global self */

import { compile } from './lang.mjs'
import { validate } from './verifier.js'

self.onmessage = (msg) => {
  if (msg.data[0].includes('set.mm')) {
    console.log(msg.data.length)
    const setmm = msg.data[0]
    let snippet = msg.data[1].replace('set.mm', '')
    snippet = snippet.replace('"', '')
    snippet = snippet.replace('"', '')
    snippet = snippet.replace('import', '')
    snippet = snippet.replace(';', '')
    let newMM
    try {
      newMM = compile(snippet)[1]
    } catch (e) {
      console.error(e)
      self.postMessage('Could not compile to Metamath.')
      return
    }
    const result = validate(setmm + '\n' + newMM)
    self.postMessage(result)
  } else {
    let newMM
    try {
      newMM = compile(msg.data)[1]
    } catch (e) {
      console.error(e)
      self.postMessage('Could not compile to Metamath.')
      return
    }
    const result = validate(newMM)
    self.postMessage(result)
  }
}
