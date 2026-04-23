/* global confirm */

import { AppState } from './app-state.js'
import { Utils } from './utils.js'
import { Persistence } from './persistence.js'

export const Actions = {
  createFile () {
    const date = new Date()
    const newFile = {
      id: `new-${Utils.generateId()}`,
      name: `${date.toLocaleTimeString().replace(/:/g, '-')}.star`,
      path: 'src/new.star',
      x: 150 - AppState.get('canvas').x,
      y: 150 - AppState.get('canvas').y,
      code: 'define 0, +, equals, implies, <, >, term, formula, provable;'
    }

    const canvas = AppState.get('canvas')
    const viewportCenterX = (window.innerWidth - 260) / 2 // Approximate
    const viewportCenterY = window.innerHeight / 2

    const worldPos = Utils.screenToWorld(
      viewportCenterX,
      viewportCenterY,
      canvas
    )

    newFile.x = worldPos.x - 350
    newFile.y = worldPos.y - 250

    const currentFiles = AppState.get('files')
    AppState.set('files', [...currentFiles, newFile])

    AppState.getStack(newFile.id).push(newFile.code)

    Persistence.immediateSave()
  },

  deleteFile (id) {
    if (!confirm('Permanently delete this file?')) return

    const currentFiles = AppState.get('files')
    const newFiles = currentFiles.filter((f) => f.id !== id)
    AppState.set('files', newFiles)

    // Clean up stack
    if (AppState.get('stacks')[id]) {
      delete AppState.get('stacks')[id]
    }

    Persistence.immediateSave()
  },

  updateFileCode (id, code) {
    const files = AppState.get('files')
    const fileIndex = files.findIndex((f) => f.id === id)
    if (fileIndex === -1) return

    const newFiles = [...files]
    newFiles[fileIndex].code = code
    AppState.set('files', newFiles)

    const stack = AppState.getStack(id)
    stack.push(code)
  },

  undo (id) {
    const stack = AppState.getStack(id)
    const prevCode = stack.undo()
    if (prevCode !== null) {
      this.updateFileCodeSilent(id, prevCode)
    }
  },

  redo (id) {
    const stack = AppState.getStack(id)
    const nextCode = stack.redo()
    if (nextCode !== null) {
      this.updateFileCodeSilent(id, nextCode)
    }
  },

  updateFileCodeSilent (id, code) {
    const files = AppState.get('files')
    const fileIndex = files.findIndex((f) => f.id === id)
    if (fileIndex === -1) return

    const newFiles = [...files]
    newFiles[fileIndex].code = code
    AppState.set('files', newFiles)
  },

  moveFile (id, x, y) {
    const files = AppState.get('files')
    const fileIndex = files.findIndex((f) => f.id === id)
    if (fileIndex === -1) return

    const newFiles = [...files]
    newFiles[fileIndex].x = x
    newFiles[fileIndex].y = y
    AppState.set('files', newFiles)
  },

  pan (dx, dy) {
    const canvas = AppState.get('canvas')
    AppState.set('canvas', {
      ...canvas,
      x: canvas.x + dx,
      y: canvas.y + dy
    })
  },

  setCanvas (props) {
    const canvas = AppState.get('canvas')
    AppState.set('canvas', { ...canvas, ...props })
  },

  flyTo (fileId) {
    const files = AppState.get('files')
    const file = files.find((f) => f.id === fileId)
    if (!file) return

    const canvas = AppState.get('canvas')
    const viewportW = window.innerWidth - 260 // Sidebar width
    const viewportH = window.innerHeight - 56 // Nav height
    const fileW = 700
    const fileH = 500

    const targetScale = canvas.scale

    const targetCanvasX =
      viewportW / 2 - file.x * targetScale - (fileW * targetScale) / 2
    const targetCanvasY =
      viewportH / 2 - file.y * targetScale - (fileH * targetScale) / 2

    const startCanvas = { ...canvas }

    Utils.animate(
      600,
      (progress) => {
        AppState.set('canvas', {
          x: startCanvas.x + (targetCanvasX - startCanvas.x) * progress,
          y: startCanvas.y + (targetCanvasY - startCanvas.y) * progress,
          scale: startCanvas.scale
        })
      },
      () => {
        Persistence.immediateSave()
      }
    )
  },

  download () {
    const data = JSON.stringify(AppState.get('files'))
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'starling-project.json'
    a.click()
    URL.revokeObjectURL(url)
  }
}
