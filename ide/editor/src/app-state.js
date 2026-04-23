import { Utils } from './utils.js'

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
tpl = axiom < t + r > : term;
weq = axiom t equals r: formula;
wim = axiom < P implies Q >: formula;

a1 =  axiom < t equals r implies < t equals s implies r equals s > >: provable;
a2 =  axiom < t + 0 > equals t: provable;

block {
min = assume P: provable;
maj = assume < P implies Q >: provable;
mp = axiom Q: provable;
}

th1 = t equals t: provable;

proof of th1 {
tt;
tze;
tpl;
tt;
weq;
tt;
tt;
weq;
tt;
a2;
tt;
tze;
tpl;
tt;
weq;
tt;
tze;
tpl;
tt;
weq;
tt;
tt;
weq;
wim;
tt;
a2;
tt;
tze;
tpl;
tt;
tt;
a1;
mp;
mp;
}`
  },
  {
    id: 'short-star',
    name: 'short.star',
    path: 'src/short.star',
    x: 850,
    y: 200,
    code: `define (, ), formula, implies;
wp = fix p: formula;
wq = fix q: formula;
wr = fix r: formula;
ws = fix s: formula;
w2 = axiom ( p implies q ):formula;
wnew = ( s implies ( r implies p ) ):formula;

proof of wnew {
ws;
wr;
wp;
w2;
w2;
}`
  }
]

const defaultCanvas = { x: 0, y: 0, scale: 1 }

const _state = {
  files: [...defaultFiles],
  canvas: { ...defaultCanvas },
  ui: {
    selectedFileId: null,
    isDragging: false,
    dragOffset: { x: 0, y: 0 }
  },
  stacks: {}
}

const subscribers = {}

export const AppState = {
  get (path) {
    if (!path) return _state
    return path
      .split('.')
      .reduce((obj, key) => (obj ? obj[key] : undefined), _state)
  },

  set (path, value) {
    const keys = path.split('.')
    let current = _state

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {}
      current = current[keys[i]]
    }

    const lastKey = keys[keys.length - 1]
    const oldValue = current[lastKey]

    if (oldValue !== value) {
      current[lastKey] = value
      this.notify(path, value)
    }
  },

  subscribe (path, callback) {
    if (!subscribers[path]) subscribers[path] = []
    subscribers[path].push(callback)

    return () => {
      subscribers[path] = subscribers[path].filter((sub) => sub !== callback)
    }
  },

  notify (path, value) {
    if (subscribers[path]) {
      subscribers[path].forEach((cb) => cb(value))
    }

    if (path.includes('.')) {
      const parentPath = path.substring(0, path.lastIndexOf('.'))
      this.notify(parentPath, this.get(parentPath))
    }
  },

  initStacks () {
    _state.files.forEach((file) => {
      if (!_state.stacks[file.id]) {
        _state.stacks[file.id] = Utils.createStack(file.code)
      }
    })
  },

  getStack (fileId) {
    if (!_state.stacks[fileId]) {
      _state.stacks[fileId] = Utils.createStack('')
    }
    return _state.stacks[fileId]
  }
}
