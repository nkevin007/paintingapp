const layerCount = 3;
const canvases = [];
let currentLayer = 0;

const container = document.getElementById('canvas-container');

// Create multiple stacked canvases
for (let i = 0; i < layerCount; i++) {
  const canvasEl = document.createElement('canvas');
  canvasEl.width = container.clientWidth;
  canvasEl.height = container.clientHeight;
  canvasEl.id = 'canvas-' + i;
  canvasEl.style.zIndex = i;
  container.appendChild(canvasEl);

  const fabricCanvas = new fabric.Canvas(canvasEl, {
    isDrawingMode: i === 0
  });

  canvases.push(fabricCanvas);
}

let activeCanvas = canvases[0];

// Set brush mode
function setBrush() {
  activeCanvas.isDrawingMode = true;
  activeCanvas.freeDrawingBrush.color = document.getElementById('colorPicker').value;
  activeCanvas.freeDrawingBrush.width = parseInt(document.getElementById('brushSize').value, 10);
}

// Set eraser mode
function setEraser() {
  activeCanvas.isDrawingMode = true;
  activeCanvas.freeDrawingBrush.color = '#1e1e2f'; // match background color
}

// Update brush on color/size change
document.getElementById('colorPicker').onchange = setBrush;
document.getElementById('brushSize').oninput = setBrush;

// Switch active layer
function switchLayer(index) {
  currentLayer = parseInt(index);
  canvases.forEach((c, i) => {
    c.isDrawingMode = i === currentLayer;
  });
  activeCanvas = canvases[currentLayer];
  setBrush();
}

// Clear all layers
function clearCanvas() {
  canvases.forEach(c => c.clear());
}

// Save all layers
function saveProject() {
  const layers = canvases.map(c => c.toJSON());
  localStorage.setItem('paintingapp-layers', JSON.stringify(layers));
  alert('Project saved!');
}

// Load layers from local storage
function loadProject() {
  const json = localStorage.getItem('paintingapp-layers');
  if (!json) return alert('No saved project.');
  const layers = JSON.parse(json);
  layers.forEach((data, i) => {
    canvases[i].loadFromJSON(data, () => canvases[i].renderAll());
  });
  alert('Project loaded!');
}

// Merge and export all layers as PNG
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
