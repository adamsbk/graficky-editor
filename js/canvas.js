const CONFIG = {
    canvas_selector: '#editor'
}

var Canvas = new function () {
    var self = this;
    this.canvas = $(CONFIG.canvas_selector);
    if (this.canvas.length === 0) {
	console.error('Canvas selector does not match any canvas in the document.');
	return;
    }

    this.canvas = this.canvas[0];
    this.ctx = this.canvas.getContext('2d');
    var tools = {pen: new Pen(this.ctx)};

    this.initialize = function () {
	this.selectedTool = tools['pen'];
	self.selectedTool.switch();

	var dragStart = false;
	$(this.canvas).mousedown(function (e) {
		dragStart = true;
	    var rect = self.canvas.getBoundingClientRect();
		e.calcX = e.clientX - rect.left;
	    e.calcY = e.clientY - rect.top;
	    if (self.selectedTool.hasOwnProperty('dragStart')) {
	    	self.selectedTool.dragStart(e);
	    }
	}).mousemove(function (e) {
	    var rect = self.canvas.getBoundingClientRect();
	    e.calcX = e.clientX - rect.left;
	    e.calcY = e.clientY - rect.top;
	    if (dragStart && self.selectedTool.hasOwnProperty('drag')) {
	    	self.selectedTool.drag(e);
	    }
	}).mouseup(function (e) {
		dragStart = false;
	    var rect = self.canvas.getBoundingClientRect();
	    e.calcX = e.clientX - rect.left;
	    e.calcY = e.clientY - rect.top;
	    if (self.selectedTool.hasOwnProperty('dragend')) {
	    	self.selectedTool.dragend(e);
	    }
	});
	$(".tool").click(function (e) {
	    self.selectedTool = tools[$(this).data("tool")];
	    if (self.selectedTool.hasOwnProperty('switch')) {
	    	self.selectedTool.switch();
	    }
	});
    }
};

Canvas.initialize();

function downloadCanvas(link, canvasId, filename) {
	link.href = $(CONFIG.canvas_selector)[0].toDataURL();
	link.download = filename;
}

$('#download').click(function() {
	downloadCanvas(this, 'canvas', 'obrazok.png');
})

