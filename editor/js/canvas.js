const CONFIG = {
    canvas_selector: '#editor',
    redrawer_selector: '#redrawer',
    width: 1024,
    height: 640
}

var Canvas = new function () {
    var self = this;
    this.canvas = $(CONFIG.canvas_selector);
    this.redrawerCanvas = $(CONFIG.redrawer_selector);
    if (this.canvas.length === 0 || this.redrawerCanvas.length === 0) {
	console.error('Canvas selector does not match any canvas in the document.');
	return;
    }

    this.canvas = this.canvas[0];
    this.redrawerCanvas = this.redrawerCanvas[0];
    this.ctx = this.canvas.getContext('2d');
    this.redrawerCtx = this.redrawerCanvas.getContext('2d');
};

function downloadCanvas(link, canvasId, filename) {
    link.href = $(CONFIG.canvas_selector)[0].toDataURL();
    link.download = filename;
}

$('#download').click(function () {
    ToolManager.selectedTool.disable();
    downloadCanvas(this, 'canvas', 'obrazok.png');
});