// --- State Management ---

// Default state for files
const defaultFiles = [
  {
    id: "main-star",
    name: "Main.star",
    path: "src/Main.star",
    x: 100,
    y: 100,
    code: `<span class="kwd">import</span> starling.core

<span class="kwd">function</span> <span class="fn">prove_identity</span>(x) {
<span class="com"># Check initial state</span>
<span class="kwd">assert</span> x == x;
<span class="kwd">return</span> <span class="str">Success</span>;
}

<span class="kwd">lemma</span> <span class="fn">reflection</span>() {
<span class="kwd">forall</span> a. a == a;
}`,
  },
  {
    id: "parser-star",
    name: "Parser.star",
    path: "src/Parser.star",
    x: 800,
    y: 500,
    code: `<span class="kwd">module</span> parser

<span class="kwd">struct</span> <span class="fn">Token</span> {
<span class="kwd">type</span>: string;
<span class="kwd">value</span>: string;
<span class="kwd">loc</span>: SourceRange;
}

<span class="kwd">function</span> <span class="fn">lex</span>(input) {
<span class="com"># Tokenization logic</span>
<span class="kwd">return</span> tokens;
}`,
  },
];

// Load state or use default
let filesState =
  JSON.parse(localStorage.getItem("starling_files")) || defaultFiles;

// Canvas View State
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

  // Simple grouping by folder (hardcoded logic for demo)
  const folders = {
    src: { name: "src", files: [] },
    core: { name: "core", files: [] }, // Just to show structure if needed
  };

  filesState.forEach((file) => {
    const parts = file.path.split("/");
    const folder = parts.length > 1 ? parts[0] : "root";

    // For this demo, we just list them with slight indentation based on path depth
    const indent = (file.path.split("/").length - 1) * 16;

    const item = document.createElement("div");
    item.className = "file-tree-item";
    item.style.paddingLeft = `${12 + indent}px`;
    item.innerHTML = `
          <span class="file-icon">📄</span>
          ${file.name}
      `;
    item.onclick = () => flyToContainer(file.id);
    fileTreeEl.appendChild(item);
  });
}

// --- Canvas Rendering ---

function renderCanvas() {
  // Remove existing containers
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
                   <span style="font-size: 14px; cursor: pointer;">✎</span>
              </div>
          </div>

          <div class="module">
              <div class="module-header">
                  Source Editor
              </div>
              <div class="source-editor">
                  ${file.code}
              </div>
          </div>

          <div style="display: flex; border-top: 1px solid var(--color-border);">
              <!-- Debugger Modules Stacked/Horizontal -->
              <div style="flex: 1; border-right: 1px solid var(--color-border);">
                  <div class="module-header">Memory</div>
                  <div class="debugger-module">
                      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                          <span>Heap: 12.4MB</span>
                          <span>Stable</span>
                      </div>
                      <div class="memory-bar"><div class="memory-fill"></div></div>
                  </div>
              </div>
              <div style="flex: 1;">
                  <div class="module-header">Stack Trace</div>
                  <div class="debugger-module">
                      <div class="stack-item"><span class="stack-num">0:</span> main()</div>
                      <div class="stack-item"><span class="stack-num">1:</span> solve_lemma()</div>
                      <div class="stack-item"><span class="stack-num">2:</span> check_ident()</div>
                  </div>
              </div>
          </div>

          <div class="module" style="background: #1A1A24; color: white; border-top: none;">
              <div class="module-header" style="background: rgba(255,255,255,0.1); color: #aaa;">Terminal</div>
              <div class="debugger-module">
                  <div>$ starling verify Main.star</div>
                  <div class="terminal-text">>> Verification success. (0.012s)</div>
              </div>
          </div>
      `;

    canvasWorld.appendChild(container);

    // Add drag listener to header
    const header = container.querySelector(".container-header");
    setupContainerDrag(container, header, file.id);
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
    // Only pan if clicking on the background, not a container
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

      // Zoom towards mouse pointer logic (simplified for this demo to center zoom)
      // A more robust implementation adjusts x/y based on mouse offset
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
    // Get current transform values
    const rect = container.getBoundingClientRect();
    // We need to account for scale when dragging
    // Easier approach: Use the file state coordinates

    const file = filesState.find((f) => f.id === fileId);
    initialLeft = file.x;
    initialTop = file.y;

    // Mouse position relative to the scaled canvas
    // mouseX = (event.clientX - canvasX) / scale
    startX = (e.clientX - canvasState.x) / canvasState.scale;
    startY = (e.clientY - canvasState.y) / canvasState.scale;

    e.stopPropagation(); // Prevent canvas panning
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

  // Target: Center the file in the viewport
  const viewportW = canvasViewport.clientWidth;
  const viewportH = canvasViewport.clientHeight;

  // Assuming file width is approx 600px (from CSS)
  const fileW = 600;
  const fileH = 400; // Approx height

  // Calculate target canvas translation
  // We want: file.x + translateX = viewport_center_x
  // translateX = viewport_center_x - file.x
  // Note: Need to account for scale if we were zooming, assuming scale=1 for simplicity here or handling it

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
  const duration = 600; // ms
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);

    canvasState.x = startX + (targetX - startX) * ease;
    canvasState.y = startY + (targetY - startY) * ease;

    applyCanvasTransform();

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      saveCanvasState();
    }
  }

  requestAnimationFrame(step);
}

// Run
init();
