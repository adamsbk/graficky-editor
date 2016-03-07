const CONFIG = {
	canvas_selector: '#editor'
}

var Canvas = new function() {
	this.canvas = $(CONFIG.canvas_selector);
	if (this.canvas.length === 0) {
		console.error('Canvas selector does not match any canvas in the document.');
		return;
	}
	this.canvas = this.canvas[0];
	this.ctx = this.canvas.getContext('2d');
};