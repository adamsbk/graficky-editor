var ToolManager = new function () {
    var self = this;
    var tools = {
	pen: new Pen(Canvas.ctx),
	line: new Line(Canvas.ctx, Canvas.redrawerCtx),
	star: new Star(Canvas.ctx, Canvas.redrawerCtx),
	rectangle: new Rectangle(Canvas.ctx, Canvas.redrawerCtx),
	ellipse: new Ellipse(Canvas.ctx, Canvas.redrawerCtx),
	text: new Text(Canvas.ctx, Canvas.redrawerCtx),
	cutout: new Cutout(Canvas.ctx, Canvas.redrawerCtx)
    };
    this.selectedTool = tools['pen'];

    var addPosToEventObj = function (e) {
	var rect = Canvas.canvas.getBoundingClientRect();
	e.calcX = e.clientX - rect.left;
	e.calcY = e.clientY - rect.top;
    };

    var setAttributes = function () {
	var visibleElems = [];
	$.each(self.selectedTool.attrs, function (index, value) {
	    visibleElems.push('.tool-additions > .' + value);

	    switch (value) {
		case 'penWidthSlider':
		    $("#penWidthSlider").slider("value", self.selectedTool.penWidth);
		    break;
		case 'lineColorPicker':
		    $("#lineColorPicker").spectrum("set", self.selectedTool.lineColor);
		    break;
		case 'fillColorPicker':
		    $("#fillColorPicker").spectrum("set", self.selectedTool.fillColor);
		    break;
		case 'rotationSlider':
		    $('#rotationSlider').slider("value", self.selectedTool.angle);
		    break;
		case 'scalingSlider':
		    $('#scalingSlider').slider("value", self.selectedTool.scale);
	    }
	});
	$('.tool-additions > .attr').addClass('hide');
	$(visibleElems.join()).removeClass('hide');
    };

    this.penWidthChanged = function (value) {
	if (self.selectedTool.hasOwnProperty('penWidthChanged')) {
	    self.selectedTool.penWidthChanged(value);
	}
    };

    this.lineColorChanged = function (color) {
	if (self.selectedTool.hasOwnProperty('lineColorChanged')) {
	    self.selectedTool.lineColorChanged(color);
	}
    }

    this.fillColorChanged = function (color) {
	if (self.selectedTool.hasOwnProperty('fillColorChanged')) {
	    self.selectedTool.fillColorChanged(color);
	}
    }

    var dragStart = false;
    $('#listen-events').mousedown(function (e) {
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
    }).click(function (e) {
	addPosToEventObj(e);
	if (self.selectedTool.hasOwnProperty('click')) {
	    self.selectedTool.click(e);
	}
    });
    $("#editor-tools > .tool").click(function (e) {
	$("#editor-tools > .tool.active").removeClass('active');
	$(this).addClass('active');

	if (self.selectedTool.hasOwnProperty('disable')) {
	    self.selectedTool.disable();
	}

	self.selectedTool = tools[$(this).data("tool")];
	if (self.selectedTool.hasOwnProperty('enable')) {
	    self.selectedTool.enable();
	}
	setAttributes();
    });

    $("#penWidthSlider").slider({
	min: 1,
	max: 50,
	value: 15,
	change: function (event, ui) {
	    self.penWidthChanged(ui.value);
	}
    });
    //trigger slidechange
    $('#penWidthSlider').slider('value', $('#penWidthSlider').slider('value'));

    $("#lineColorPicker").spectrum({
	color: '#FF0000',
	preferredFormat: "hex",
	showInput: true,
	showPalette: true,
	palette: [["black", "white", "yellow", "orange", "red", "green", "pink", "violet", "cyan", "blue"]],
	move: function (color) {
	    self.lineColorChanged(color.toRgbString());
	}
    });

    $("#fillColorPicker").spectrum({
	color: '#FF0000',
	preferredFormat: "hex",
	showInput: true,
	showPalette: true,
	palette: [["black", "white", "yellow", "orange", "red", "green", "pink", "violet", "cyan", "blue"]],
	move: function (color) {
	    self.fillColorChanged(color.toRgbString());
	}
    });
    $("#editor-tools > .tool#pen").click();
};
