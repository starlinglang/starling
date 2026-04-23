/* global localStorage:writable */

import { AppState } from './app-state.js'

export const Persistence = {
  STORAGE_KEYS: {
    FILES: 'starling_files',
    CANVAS: 'starling_canvas'
  },

  debounceTimer: null,
  DEBOUNCE_MS: 500,

  init () {
    const savedFiles = localStorage.getItem(this.STORAGE_KEYS.FILES)
    const savedCanvas = localStorage.getItem(this.STORAGE_KEYS.CANVAS)

    if (savedFiles) {
      try {
        const files = JSON.parse(savedFiles)
        AppState.set('files', files)
      } catch (e) {
        console.error('Failed to parse saved files', e)
      }
    }

    if (savedCanvas) {
      try {
        const canvas = JSON.parse(savedCanvas)
        AppState.set('canvas', canvas)
      } catch (e) {
        console.error('Failed to parse saved canvas', e)
      }
    }

    AppState.subscribe('files', () => this.scheduleSave())
    AppState.subscribe('canvas', () => this.scheduleSave())
  },

  scheduleSave () {
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => this.saveAll(), this.DEBOUNCE_MS)
  },

  saveAll () {
    const state = AppState.get()
    localStorage.setItem(this.STORAGE_KEYS.FILES, JSON.stringify(state.files))
    localStorage.setItem(
      this.STORAGE_KEYS.CANVAS,
      JSON.stringify(state.canvas)
    )
  },

  immediateSave () {
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    this.saveAll()
  }
}
