/* global localStorage, Stack, confirm, requestAnimationFrame */

const defaultFiles = [
  {
    id: 'long-star',
    name: 'long.star',
    path: 'src/long.star',
    x: 100,
    y: 100,
    code: `define 0, +, equals, implies, <, >, term, formula, provable;
         tt = fix t: term;
         tr = fix r: term;
         ts = fix s: term;
         wp = fix P: formula;
         wq = fix Q: formula;
         tze = axiom 0: term;
         tpl = axiom <t + r>: term;
         weq = axiom t equals r: formula;
         wim = axiom <P implies Q>: formula;
         distinct wp, wq;
         a1 =  axiom <t equals r implies <t equals s implies r equals s >>: provable;
         a2 =  axiom <t+0> equals t: provable;
         block {
         min = assume P: provable;
         maj = assume <P implies Q>: provable;
         mp = axiom Q: provable;
         }
         th1 = t equals t: provable;
         proof of th1 {
         tt; tze; tpl; tt; weq; tt; tt; weq; tt; a2; tt; tze; tpl; tt; weq; tt; tze; tpl; tt; weq; tt; tt; weq; wim; tt; a2; tt; tze; tpl; tt; tt; a1; mp; mp;
         }`
  },
  {
    id: 'short-star',
    name: 'short.star',
    path: 'src/short.star',
    x: 850,
    y: 200,
    code: `define <, >, implies, formula;
         wp = fix p: formula;
         wq = fix q: formula;
         wr = fix r: formula;
         ws = fix s: formula;
         w2 = axiom <p implies q>: formula;
         wnew = <s implies < r implies p >> :formula;
         proof of wnew {
         ws;
         wr;
         wp;
         w2;
         w2;
         }`
  }
]
let filesState =
  JSON.parse(localStorage.getItem('starling_files')) || defaultFiles
const canvasState = JSON.parse(localStorage.getItem('starling_canvas')) || {
  x: 0,
  y: 0,
  scale: 1
}

const editorStacks = new Map()

const canvasViewport = document.getElementById('canvas-viewport')
const canvasWorld = document.getElementById('canvas-world')
const fileTreeEl = document.getElementById('file-tree')

function init () {
  renderFileTree()
  renderCanvas()
  applyCanvasTransform()
  setupCanvasInteractions()
}

function renderFileTree () {
  fileTreeEl.innerHTML = ''
  filesState.forEach((file) => {
    const indent = (file.path.split('/').length - 1) * 16
    const item = document.createElement('div')
    item.className = 'file-tree-item'
    item.style.paddingLeft = `${12 + indent}px`
    item.innerHTML = `<span class="file-icon">📄</span> ${file.name}`
    item.onclick = () => flyToContainer(file.id)
    fileTreeEl.appendChild(item)
  })
}

function renderCanvas () {
  const existing = canvasWorld.querySelectorAll('.file-container')
  existing.forEach((el) => el.remove())

  filesState.forEach((file) => {
    const container = document.createElement('div')
    container.className = 'file-container'
    container.id = file.id
    container.style.left = `${file.x}px`
    container.style.top = `${file.y}px`

    if (!editorStacks.has(file.id)) {
      editorStacks.set(file.id, new Stack(file.code))
    }
    const stack = editorStacks.get(file.id)

    const header = document.createElement('div')
    header.className = 'container-header'
    header.dataset.id = file.id
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
    canvasWorld.appendChild(container)

    setupContainerDrag(container, header, file.id)

    textarea.addEventListener('input', () => {
      file.code = textarea.value
      localStorage.setItem('starling_files', JSON.stringify(filesState))

      clearTimeout(textarea._inputTimeout)
      textarea._inputTimeout = setTimeout(() => {
        stack.pushState(textarea.value)
        updateUndoRedoUI(container, stack)
      }, 400)
    })

    header.querySelector('.undo-btn').addEventListener('click', () => {
      clearTimeout(textarea._inputTimeout)
      stack.back()
      applyHistoryState(file, stack, textarea, container)
    })

    header.querySelector('.redo-btn').addEventListener('click', () => {
      clearTimeout(textarea._inputTimeout)
      stack.forward()
      applyHistoryState(file, stack, textarea, container)
    })

    updateUndoRedoUI(container, stack)

    header.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation()
      if (confirm(`Permanently delete "${file.name}"?`)) {
        filesState = filesState.filter((f) => f.id !== file.id)
        editorStacks.delete(file.id)
        localStorage.setItem('starling_files', JSON.stringify(filesState))
        renderFileTree()
        renderCanvas()
      }
    })
  })
}

function applyHistoryState (file, stack, textarea, container) {
  textarea.value = stack.state
  file.code = stack.state
  localStorage.setItem('starling_files', JSON.stringify(filesState))
  updateUndoRedoUI(container, stack)
}

function updateUndoRedoUI (container, stack) {
  container.querySelector('.undo-btn').disabled = stack.atStart
  container.querySelector('.redo-btn').disabled = stack.atEnd
}

function applyCanvasTransform () {
  canvasWorld.style.transform = `translate(${canvasState.x}px, ${canvasState.y}px) scale(${canvasState.scale})`
}
function saveCanvasState () {
  localStorage.setItem('starling_canvas', JSON.stringify(canvasState))
}
function setupCanvasInteractions () {
  let isPanning = false
  let startX, startY
  canvasViewport.addEventListener('mousedown', (e) => {
    if (e.target === canvasViewport || e.target === canvasWorld) {
      isPanning = true
      startX = e.clientX - canvasState.x
      startY = e.clientY - canvasState.y
      canvasViewport.style.cursor = 'grabbing'
    }
  })
  window.addEventListener('mousemove', (e) => {
    if (isPanning) {
      e.preventDefault()
      canvasState.x = e.clientX - startX
      canvasState.y = e.clientY - startY
      applyCanvasTransform()
      saveCanvasState()
    }
  })
  window.addEventListener('mouseup', () => {
    isPanning = false
    canvasViewport.style.cursor = 'grab'
  })
  canvasViewport.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault()
      const zoomIntensity = 0.001
      const delta = -e.deltaY * zoomIntensity
      const newScale = Math.min(Math.max(0.2, canvasState.scale + delta), 3)
      canvasState.scale = newScale
      applyCanvasTransform()
      saveCanvasState()
    },
    { passive: false }
  )
}

function setupContainerDrag (container, header, fileId) {
  let isDragging = false
  let startX, startY
  let initialLeft, initialTop
  header.addEventListener('mousedown', (e) => {
    isDragging = true
    const file = filesState.find((f) => f.id === fileId)
    initialLeft = file.x
    initialTop = file.y
    startX = (e.clientX - canvasState.x) / canvasState.scale
    startY = (e.clientY - canvasState.y) / canvasState.scale
    e.stopPropagation()
  })
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    const currentMouseX = (e.clientX - canvasState.x) / canvasState.scale
    const currentMouseY = (e.clientY - canvasState.y) / canvasState.scale
    const dx = currentMouseX - startX
    const dy = currentMouseY - startY
    const file = filesState.find((f) => f.id === fileId)
    file.x = initialLeft + dx
    file.y = initialTop + dy
    container.style.left = `${file.x}px`
    container.style.top = `${file.y}px`
  })
  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false
      localStorage.setItem('starling_files', JSON.stringify(filesState))
    }
  })
}

function flyToContainer (fileId) {
  const file = filesState.find((f) => f.id === fileId)
  if (!file) return
  const viewportW = canvasViewport.clientWidth
  const viewportH = canvasViewport.clientHeight
  const fileW = 700
  const fileH = 500
  const targetX =
    viewportW / 2 -
    file.x * canvasState.scale -
    (fileW * canvasState.scale) / 2
  const targetY =
    viewportH / 2 -
    file.y * canvasState.scale -
    (fileH * canvasState.scale) / 2
  animateCanvasTo(targetX, targetY)
}
function animateCanvasTo (targetX, targetY) {
  const startX = canvasState.x
  const startY = canvasState.y
  const duration = 600
  const startTime = performance.now()
  function step (currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    canvasState.x = startX + (targetX - startX) * ease
    canvasState.y = startY + (targetY - startY) * ease
    applyCanvasTransform()
    if (progress < 1) requestAnimationFrame(step)
    else saveCanvasState()
  }
  requestAnimationFrame(step)
}

function newFile () {
  const date = new Date()
  filesState.push({
    id: `new-star-${date.getTime()}`,
    name: `${date.toLocaleTimeString().replace(/:/g, '-')}.star`,
    path: 'src/new.star',
    x: 150,
    y: 150,
    code: 'define 0, +, equals, implies, <, >, term, formula, provable;'
  })
  renderFileTree()
  renderCanvas()
}

const downloading = () => {
  const data = JSON.stringify(filesState)
  const blob = new Blob([data], { type: 'application/json' })
  const jsonObjectUrl = URL.createObjectURL(blob)
  const filename = 'canvas.json'
  const anchorEl = document.createElement('a')
  anchorEl.href = jsonObjectUrl
  anchorEl.download = filename
  anchorEl.click()
  URL.revokeObjectURL(jsonObjectUrl)
}

document.getElementById('newFile').addEventListener('click', newFile)
document.getElementById('download').addEventListener('click', downloading)

init()
