// --- State Management ---

const defaultFiles = [
  {
    id: "long-star",
    name: "long.star",
    path: "src/long.star",
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
}`,
  },
  {
    id: "short-star",
    name: "short.star",
    path: "src/short.star",
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
}`,
  },
];

let filesState =
  JSON.parse(localStorage.getItem("starling_files")) || defaultFiles;

let canvasState = JSON.parse(localStorage.getItem("starling_canvas")) || {
  x: 0,
  y: 0,
  scale: 1,
};

// --- DOM Elements ---
const canvasViewport = document.getElementById("canvas-viewport");
const canvasWorld = document.getElementById("canvas-world");
const fileTreeEl = document.getElementById("file-tree");

// --- Initialization ---
function init() {
  renderFileTree();
  renderCanvas();
  applyCanvasTransform();
  setupCanvasInteractions();
}

// --- File Tree Logic ---
function renderFileTree() {
  fileTreeEl.innerHTML = "";
  filesState.forEach((file) => {
    const indent = (file.path.split("/").length - 1) * 16;
    const item = document.createElement("div");
    item.className = "file-tree-item";
    item.style.paddingLeft = `${12 + indent}px`;
    item.innerHTML = `<span class="file-icon">📄</span> ${file.name}`;
    item.onclick = () => flyToContainer(file.id);
    fileTreeEl.appendChild(item);
  });
}

// --- Canvas Rendering ---
function renderCanvas() {
  const existing = canvasWorld.querySelectorAll(".file-container");
  existing.forEach((el) => el.remove());

  filesState.forEach((file) => {
    const container = document.createElement("div");
    container.className = "file-container";
    container.id = file.id;
    container.style.left = `${file.x}px`;
    container.style.top = `${file.y}px`;

    container.innerHTML = `
  <div class="container-header" data-id="${file.id}">
  <div class="window-controls">
  <div class="dot"></div><div class="dot"></div><div class="dot"></div>
  </div>
  <div class="container-title" style="margin-left: 12px;">${file.name}</div>
  <div class="window-controls">
  <span style="font-size: 14px; cursor: pointer;">✕</span>
  </div>
  </div>
  <div class="module source-editor-container">
  <div class="module-header">
  Source Editor
  </div>
  <textarea class="source-editor">${file.code}</textarea>
  </div>
  </div>`;

    canvasWorld.appendChild(container);

    // Events
    const header = container.querySelector(".container-header");
    setupContainerDrag(container, header, file.id);

    const textarea = container.querySelector(".source-editor");

    textarea.addEventListener("input", () => {
      file.code = textarea.value;
      localStorage.setItem("starling_files", JSON.stringify(filesState));
    });
  });
}

// --- Canvas Interactions (Pan & Zoom) ---
function applyCanvasTransform() {
  canvasWorld.style.transform = `translate(${canvasState.x}px, ${canvasState.y}px) scale(${canvasState.scale})`;
}
function saveCanvasState() {
  localStorage.setItem("starling_canvas", JSON.stringify(canvasState));
}
function setupCanvasInteractions() {
  let isPanning = false;
  let startX, startY;
  canvasViewport.addEventListener("mousedown", (e) => {
    if (e.target === canvasViewport || e.target === canvasWorld) {
      isPanning = true;
      startX = e.clientX - canvasState.x;
      startY = e.clientY - canvasState.y;
      canvasViewport.style.cursor = "grabbing";
    }
  });
  window.addEventListener("mousemove", (e) => {
    if (isPanning) {
      e.preventDefault();
      canvasState.x = e.clientX - startX;
      canvasState.y = e.clientY - startY;
      applyCanvasTransform();
      saveCanvasState();
    }
  });
  window.addEventListener("mouseup", () => {
    isPanning = false;
    canvasViewport.style.cursor = "grab";
  });
  canvasViewport.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const zoomIntensity = 0.001;
      const delta = -e.deltaY * zoomIntensity;
      const newScale = Math.min(Math.max(0.2, canvasState.scale + delta), 3);
      canvasState.scale = newScale;
      applyCanvasTransform();
      saveCanvasState();
    },
    { passive: false },
  );
}

// --- Container Drag Logic ---
function setupContainerDrag(container, header, fileId) {
  let isDragging = false;
  let startX, startY;
  let initialLeft, initialTop;
  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    const file = filesState.find((f) => f.id === fileId);
    initialLeft = file.x;
    initialTop = file.y;
    startX = (e.clientX - canvasState.x) / canvasState.scale;
    startY = (e.clientY - canvasState.y) / canvasState.scale;
    e.stopPropagation();
  });
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const currentMouseX = (e.clientX - canvasState.x) / canvasState.scale;
    const currentMouseY = (e.clientY - canvasState.y) / canvasState.scale;
    const dx = currentMouseX - startX;
    const dy = currentMouseY - startY;
    const file = filesState.find((f) => f.id === fileId);
    file.x = initialLeft + dx;
    file.y = initialTop + dy;
    container.style.left = `${file.x}px`;
    container.style.top = `${file.y}px`;
  });
  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      localStorage.setItem("starling_files", JSON.stringify(filesState));
    }
  });
}

// --- Camera Fly-to Animation ---
function flyToContainer(fileId) {
  const file = filesState.find((f) => f.id === fileId);
  if (!file) return;
  const viewportW = canvasViewport.clientWidth;
  const viewportH = canvasViewport.clientHeight;
  const fileW = 700;
  const fileH = 500;
  const targetX =
    viewportW / 2 -
    file.x * canvasState.scale -
    (fileW * canvasState.scale) / 2;
  const targetY =
    viewportH / 2 -
    file.y * canvasState.scale -
    (fileH * canvasState.scale) / 2;
  animateCanvasTo(targetX, targetY);
}
function animateCanvasTo(targetX, targetY) {
  const startX = canvasState.x;
  const startY = canvasState.y;
  const duration = 600;
  const startTime = performance.now();
  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    canvasState.x = startX + (targetX - startX) * ease;
    canvasState.y = startY + (targetY - startY) * ease;
    applyCanvasTransform();
    if (progress < 1) requestAnimationFrame(step);
    else saveCanvasState();
  }
  requestAnimationFrame(step);
}

init();

function newFile() {
  let date = new Date();
  filesState.push({
    id: `new-star-${date}`,
    name: `${date}.star`,
    path: `src/${date}.star`,
    x: 150,
    y: 150,
    code: `define 0, +, equals, implies, <, >, term, formula, provable;`,
  });
  renderFileTree();
  renderCanvas();
}

let downloading = () => {
  const data = JSON.stringify(filesState);
  const blob = new Blob([data], { type: "application/json" });
  const jsonObjectUrl = URL.createObjectURL(blob);
  const filename = "canvas.json";
  const anchorEl = document.createElement("a");
  anchorEl.href = jsonObjectUrl;
  anchorEl.download = filename;
  anchorEl.click();
  URL.revokeObjectURL(jsonObjectUrl);
};

document.getElementById("newFile").addEventListener("click", newFile);

document.getElementById("download").addEventListener("click", downloading);
