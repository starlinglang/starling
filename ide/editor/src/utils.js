/* global requestAnimationFrame, cancelAnimationFrame */

/**
 * Utility functions for the Starling editor.
 */

export const Utils = {
  /**
   * Generates a unique ID based on timestamp and random string
   */
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  },

  /**
   * Cubic ease-out function for animations
   */
  easeOutCubic: (x) => 1 - Math.pow(1 - x, 3),

  /**
   * History Stack for Undo/Redo functionality
   */
  createStack: (initialState) => {
    const states = [undefined, initialState] // 1-indexed for easier math
    let index = 1
    let length = 1

    return {
      get state () {
        return states[index]
      },
      get canUndo () {
        return index > 1
      },
      get canRedo () {
        return index < length
      },
      push (newState) {
        if (index < length) {
          length = index + 1
          states.length = length
        }
        index++
        states[index] = newState
        length = index
      },
      undo () {
        if (this.canUndo) {
          index--
          return states[index]
        }
        return null
      },
      redo () {
        if (this.canRedo) {
          index++
          return states[index]
        }
        return null
      }
    }
  },

  /**
   * Animation helper that returns a cancel function
   */
  animate: (duration, onUpdate, onComplete) => {
    const startTime = performance.now()
    let frameId

    const step = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = Utils.easeOutCubic(progress)

      onUpdate(easedProgress)

      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      } else {
        if (onComplete) onComplete()
      }
    }

    frameId = requestAnimationFrame(step)

    return () => cancelAnimationFrame(frameId)
  },

  /**
   * Coordinate conversion helpers
   */
  screenToWorld: (screenX, screenY, canvasState) => {
    return {
      x: (screenX - canvasState.x) / canvasState.scale,
      y: (screenY - canvasState.y) / canvasState.scale
    }
  }
}
