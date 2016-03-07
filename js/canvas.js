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
	this.selectedTool =
		this.canvas.mousedown(function (e) {
		    var rect = self.canvas.getBoundingClientRect();
		    e.calcX = e.clientX - rect.left;
		    e.calcY = e.clientY - rect.top;
		    this.selectedTool.dragStart(e);
		}).mousemove(function (e) {
	    var rect = self.canvas.getBoundingClientRect();
	    e.calcX = e.clientX - rect.left;
	    e.calcY = e.clientY - rect.top;
	    this.selectedTool.drag(e);
	}).mouseup(function (e) {
	    var rect = self.canvas.getBoundingClientRect();
	    e.calcX = e.clientX - rect.left;
	    e.calcY = e.clientY - rect.top;
	    this.selectedTool.dragend(e);
	});
	$(".tool").click(function (e) {
	    $anchor = $this;
	    this.selectedTool = tools[$(this).data("tool")];
	    this.selectedTool.switch();
	});
    }
};

Canvas.initialize();