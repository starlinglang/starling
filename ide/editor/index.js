import { AppState } from './src/app-state.js'
import { Actions } from './src/actions.js'
import { Persistence } from './src/persistence.js'
import { FileTreeUI } from './src/ui-file-tree.js'
import { CanvasUI } from './src/ui-canvas.js'

document.addEventListener('DOMContentLoaded', () => {
  AppState.initStacks()
  Persistence.init()

  FileTreeUI.init()
  CanvasUI.init()

  document
    .getElementById('newFile')
    .addEventListener('click', () => Actions.createFile())
  document
    .getElementById('download')
    .addEventListener('click', () => Actions.download())
})
