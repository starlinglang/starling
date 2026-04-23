import { AppState } from './app-state.js'
import { Actions } from './actions.js'

export const FileTreeUI = {
  container: null,

  init () {
    this.container = document.getElementById('file-tree')

    this.render()

    AppState.subscribe('files', () => this.render())
  },

  render () {
    const files = AppState.get('files')
    this.container.innerHTML = ''

    files.forEach((file) => {
      const indent = (file.path.split('/').length - 1) * 16
      const item = document.createElement('div')
      item.className = 'file-tree-item'
      item.style.paddingLeft = `${12 + indent}px`
      item.dataset.id = file.id

      item.innerHTML = `<span class="file-icon">📄</span> ${file.name}`

      item.onclick = () => {
        Actions.flyTo(file.id)
      }

      this.container.appendChild(item)
    })
  }
}
