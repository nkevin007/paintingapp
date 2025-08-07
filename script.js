const layerCount = 3;
const canvases = [];
let currentLayer = 0;

const container = document.getElementById('canvas-container');

// Resize function that adjusts canvas size to fill space
function resizeCanvases() {
  const toolbarHeight = document.getElementById('toolbar').offsetHeight;
  const headerHeight = document.querySelector('header').offsetHeight;
  const footerHeight = document.querySelector('footer').offsetHeight;
  const padding = 30;

  const availableHeight = window.innerHeight - (toolbarHeight + headerHeight + footerHeight + padding);
  const availableWidth = window.innerWidth * 0.9;

  container.style.width = availableWidth + 'px';
  container.style.height = availableHeight + 'px';

  canvases.forEach(c => {
    const el = c.lowerCanvasEl;
    el.width = availableWidth;
    el.height = availableHeight;
    c.setWidth(availableWidth);
    c.setHeight(availableHeight);
    c.renderAll();
  });
}

// Initial canvas setup
for (let i = 0; i < layerCount; i++) {
  const canvasEl = document.createElement('canvas');
  canvasEl.id = 'canvas-' + i;
  canvasEl.style.position = 'absolute';
  canvasEl.style.zIndex = i;
  container.appendChild(canvasEl);

  const fabricCanvas = new fabric.Canvas(canvasEl, {
    isDrawingMode: i === 0
  });

  canvases.push(fabricCanvas);
}

let activeCanvas = canvases[0];
resizeCanvases(); // Call once
window.addEventListener('resize', resizeCanvases); // Resize on window resize

// Tool Functions
function setBrush() {
  activeCanvas.isDrawingMode = true;
  activeCanvas.freeDrawingBrush.color = document.getElementById('colorPicker').value;
  activeCanvas.freeDrawingBrush.width = parseInt(document.getElementById('brushSize').value, 10);
}

function setEraser() {
  activeCanvas.isDrawingMode = true;
  activeCanvas.freeDrawingBrush.color = '#1e1e2f'; // background color
}

document.getElementById('colorPicker').onchange = setBrush;
document.getElementById('brushSize').oninput = setBrush;

function switchLayer(index) {
  currentLayer = parseInt(index);
  canvases.forEach((c, i) => {
    c.isDrawingMode = i === currentLayer;
  });
  activeCanvas = canvases[currentLayer];
  setBrush();
}

function clearCanvas() {
  canvases.forEach(c => c.clear());
}

function saveProject() {
  const layers = canvases.map(c => c.toJSON());
  localStorage.setItem('paintingapp-layers', JSON.stringify(layers));
  alert('Project saved!');
}

function loadProject() {
  const json = localStorage.getItem('paintingapp-layers');
  if (!json) return alert('No saved project.');
  const layers = JSON.parse(json);
  layers.forEach((data, i) => {
    canvases[i].loadFromJSON(data, () => canvases[i].renderAll());
  });
  alert('Project loaded!');
}

function exportPNG() {
  const mergedCanvas = document.createElement('canvas');
  mergedCanvas.width = container.clientWidth;
  mergedCanvas.height = container.clientHeight;
  const ctx = mergedCanvas.getContext('2d');

  canvases.forEach(c => {
    ctx.drawImage(c.lowerCanvasEl, 0, 0);
  });

  const link = document.createElement('a');
  link.download = 'painting.png';
  link.href = mergedCanvas.toDataURL();
  link.click();
}
