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

	var addPosToEventObj = function(e) {
		var rect = self.canvas.getBoundingClientRect();
		e.calcX = e.clientX - rect.left;
	    e.calcY = e.clientY - rect.top;
	};

	this.sliderChanged = function(value) {
		if (self.selectedTool.hasOwnProperty('sliderChanged')) {
	    	self.selectedTool.sliderChanged(value);
	    }
	};

	this.colorChanged = function(color) {
		if (self.selectedTool.hasOwnProperty('colorChanged')) {
	    	self.selectedTool.colorChanged(color);
	    }
	}

	var dragStart = false;
	$(this.canvas).mousedown(function (e) {
		dragStart = true;
	    addPosToEventObj(e);
	    if (self.selectedTool.hasOwnProperty('dragStart')) {
	    	self.selectedTool.dragStart(e);
	    }
	}).mousemove(function (e) {
	    addPosToEventObj(e);
	    if (dragStart && self.selectedTool.hasOwnProperty('drag')) {
	    	self.selectedTool.drag(e);
	    }
	}).mouseup(function (e) {
		dragStart = false;
	    addPosToEventObj(e);
	    if (self.selectedTool.hasOwnProperty('dragEnd')) {
	    	self.selectedTool.dragEnd(e);
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

$(function() {
	$( "#slider" ).slider({
		min: 1,
		max: 50,
		value: 5,
		change: function( event, ui ) {
			Canvas.sliderChanged(ui.value);
		}
	});
	//trigger slidechange
	$('#slider').slider( 'value', $('#slider').slider('value') );

	$("#colorpicker").spectrum({
		color: '#FF0000',
		preferredFormat: "hex",
		showInput: true,
		showPalette: true,
		palette: [["red", "rgba(0, 255, 0, .5)", "rgb(0, 0, 255)"]],
		move: function(color) {
			Canvas.colorChanged(color.toRgbString());
		}
	});
});

