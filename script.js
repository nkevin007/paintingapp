
const canvas = new fabric.Canvas('drawingCanvas', { isDrawingMode: true });
let state = [];
let mods = 0;

function setBrush() {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = document.getElementById('colorPicker').value;
  canvas.freeDrawingBrush.width = parseInt(document.getElementById('brushSize').value, 10);
}

function setEraser() {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = '#ffffff';
}

document.getElementById('colorPicker').onchange = () => {
  canvas.freeDrawingBrush.color = document.getElementById('colorPicker').value;
};

document.getElementById('brushSize').oninput = () => {
  canvas.freeDrawingBrush.width = parseInt(document.getElementById('brushSize').value, 10);
};

canvas.on('object:added', function () {
  if (!mods) {
    updateModifications(true);
  }
});

function updateModifications(savehistory) {
  if (savehistory === true) {
    const myjson = JSON.stringify(canvas);
    state.push(myjson);
  }
}

function undo() {
  if (state.length > 1) {
    state.pop();
    canvas.loadFromJSON(state[state.length - 1], () => {
      canvas.renderAll();
    });
  }
}

function redo() {
  alert("Redo not implemented yet!");
}

function clearCanvas() {
  canvas.clear();
  state = [];
}

function saveProject() {
  const json = canvas.toJSON();
  localStorage.setItem('paintingapp-save', JSON.stringify(json));
  alert('Project saved!');
}

function loadProject() {
  const json = localStorage.getItem('paintingapp-save');
  if (json) {
    canvas.loadFromJSON(JSON.parse(json), () => {
      canvas.renderAll();
      alert('Project loaded!');
    });
  } else {
    alert('No saved project found.');
  }
}

function exportPNG() {
  const dataURL = canvas.toDataURL({ format: 'png' });
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'my_drawing.png';
  link.click();
}
