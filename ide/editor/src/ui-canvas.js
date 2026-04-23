/* global requestAnimationFrame */

import { AppState } from './app-state.js'
import { Actions } from './actions.js'
import { Utils } from './utils.js'
import { Persistence } from './persistence.js'

export const CanvasUI = {
  viewport: null,
  world: null,

  isPanning: false,
  panStart: { x: 0, y: 0 },

  isDraggingFile: false,
  dragFileId: null,
  dragFileStart: { x: 0, y: 0 },
  mouseStart: { x: 0, y: 0 },

  init () {
    this.viewport = document.getElementById('canvas-viewport')
    this.world = document.getElementById('canvas-world')

    this.setupEventListeners()
    this.renderContainers()

    AppState.subscribe('canvas', (canvas) => this.applyTransform(canvas))
    AppState.subscribe('files', () => this.renderContainers())
  },

  applyTransform (canvas) {
    this.world.style.transform = `translate(${canvas.x}px, ${canvas.y}px) scale(${canvas.scale})`
  },

  setupEventListeners () {
    this.viewport.addEventListener('mousedown', (e) => {
      if (e.target === this.viewport || e.target === this.world) {
        this.isPanning = true
        this.panStart = {
          x: e.clientX - AppState.get('canvas').x,
          y: e.clientY - AppState.get('canvas').y
        }
        this.viewport.style.cursor = 'grabbing'
      }
    })

    this.viewport.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault()
        const zoomIntensity = 0.001
        const delta = -e.deltaY * zoomIntensity
        const currentScale = AppState.get('canvas').scale
        const newScale = Math.min(Math.max(0.2, currentScale + delta), 3)

        Actions.setCanvas({ scale: newScale })
      },
      { passive: false }
    )

    window.addEventListener('mousemove', (e) => {
      if (this.isPanning) {
        e.preventDefault()
        const newX = e.clientX - this.panStart.x
        const newY = e.clientY - this.panStart.y

        requestAnimationFrame(() => {
          Actions.setCanvas({ x: newX, y: newY })
        })
      } else if (this.isDraggingFile && this.dragFileId) {
        e.preventDefault()
        const canvas = AppState.get('canvas')
        const currentMouseWorld = Utils.screenToWorld(
          e.clientX,
          e.clientY,
          canvas
        )

        const dx = currentMouseWorld.x - this.mouseStart.x
        const dy = currentMouseWorld.y - this.mouseStart.y

        const newX = this.dragFileStart.x + dx
        const newY = this.dragFileStart.y + dy

        requestAnimationFrame(() => {
          Actions.moveFile(this.dragFileId, newX, newY)
        })
      }
    })

    window.addEventListener('mouseup', () => {
      this.isPanning = false
      this.isDraggingFile = false
      this.dragFileId = null
      this.viewport.style.cursor = 'grab'
      Persistence.immediateSave() // Save position after drag
    })
  },

  renderContainers () {
    const files = AppState.get('files')
    const existingNodes = new Map()

    Array.from(this.world.children).forEach((node) => {
      if (node.classList.contains('file-container')) {
        existingNodes.set(node.dataset.id, node)
      }
    })

    const renderedIds = new Set()

    files.forEach((file) => {
      renderedIds.add(file.id)
      let container = existingNodes.get(file.id)

      if (!container) {
        container = this.createFileContainer(file)
        this.world.appendChild(container)
      } else {
        const titleEl = container.querySelector('.container-title')
        if (titleEl && titleEl.textContent !== file.name) {
          titleEl.textContent = file.name
        }

        container.style.left = `${file.x}px`
        container.style.top = `${file.y}px`

        const textarea = container.querySelector('.source-editor')
        if (textarea && textarea.value !== file.code) {
          if (document.activeElement !== textarea) {
            textarea.value = file.code
          }
        }
      }
    })

    existingNodes.forEach((node, id) => {
      if (!renderedIds.has(id)) {
        node.remove()
      }
    })
  },

  createFileContainer (file) {
    const container = document.createElement('div')
    container.className = 'file-container'
    container.dataset.id = file.id
    container.style.left = `${file.x}px`
    container.style.top = `${file.y}px`

    const header = document.createElement('div')
    header.className = 'container-header'
    header.innerHTML = `
      <div class="window-controls left">
        <button class="tool-btn undo-btn" title="Undo">↶</button>
        <button class="tool-btn redo-btn" title="Redo">↷</button>
      </div>
      <div class="container-title">${file.name}</div>
      <div class="window-controls right">
        <span class="delete-btn" title="Delete File">×</span>
      </div>
    `

    const moduleDiv = document.createElement('div')
    moduleDiv.className = 'module source-editor-container'
    moduleDiv.innerHTML = '<div class="module-header">Source Editor</div>'

    const textarea = document.createElement('textarea')
    textarea.className = 'source-editor'
    textarea.value = file.code
    textarea.spellcheck = false
    moduleDiv.appendChild(textarea)

    container.appendChild(header)
    container.appendChild(moduleDiv)

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.tool-btn') || e.target.closest('.delete-btn')) {
        return
      }

      this.isDraggingFile = true
      this.dragFileId = file.id

      const canvas = AppState.get('canvas')
      this.mouseStart = Utils.screenToWorld(e.clientX, e.clientY, canvas)
      this.dragFileStart = { x: file.x, y: file.y }

      e.stopPropagation()
    })

    header.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation()
      Actions.deleteFile(file.id)
    })

    const undoBtn = header.querySelector('.undo-btn')
    const redoBtn = header.querySelector('.redo-btn')

    const updateButtons = () => {
      const stack = AppState.getStack(file.id)
      undoBtn.disabled = !stack.canUndo
      redoBtn.disabled = !stack.canRedo
    }

    updateButtons()

    undoBtn.addEventListener('click', () => {
      Actions.undo(file.id)
      textarea.value = AppState.getStack(file.id).state
      updateButtons()
    })

    redoBtn.addEventListener('click', () => {
      Actions.redo(file.id)
      textarea.value = AppState.getStack(file.id).state
      updateButtons()
    })

    let inputTimeout
    textarea.addEventListener('input', () => {
      const code = textarea.value

      clearTimeout(inputTimeout)
      inputTimeout = setTimeout(() => {
        Actions.updateFileCode(file.id, code)
        updateButtons()
      }, 400)
    })

    return container
  }
}
