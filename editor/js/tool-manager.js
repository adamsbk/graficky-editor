var ToolManager = new function () {
    var self = this;
    self.tools = {
	pen: new Pen(Canvas.ctx),
	line: new Line(Canvas.ctx, Canvas.redrawerCtx),
	star: new Star(Canvas.ctx, Canvas.redrawerCtx),
	rectangle: new Rectangle(Canvas.ctx, Canvas.redrawerCtx),
	ellipse: new Ellipse(Canvas.ctx, Canvas.redrawerCtx),
	text: new Text(Canvas.ctx, Canvas.redrawerCtx),
	eraser: new Eraser(Canvas.ctx, Canvas.redrawerCtx),
	cutout: new Cutout(Canvas.ctx, Canvas.redrawerCtx),
	seal: new Seal(Canvas.ctx, Canvas.redrawerCtx)
    };
    this.selectedTool = self.tools['pen'];

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
		    break;
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
    
    self.switchToCutOut = function(width, height){
	$("#editor-tools > .tool.active").removeClass('active');
	$('#cutout').addClass('active');

	if (self.selectedTool.hasOwnProperty('disable')) {
	    self.selectedTool.disable();
	}
	
	self.selectedTool = self.tools[$('#cutout').data("tool")];
	if (self.selectedTool.hasOwnProperty('enable')) {
	    self.selectedTool.enable();
	}
	if (self.selectedTool.hasOwnProperty('setImage')) {
	    self.selectedTool.setImage(width, height);
	}
	setAttributes();
    }

    var dragStart = false;
    $('#listen-events').mousedown(function (e) {
	dragStart = true;
	if (self.selectedTool.hasOwnProperty('dragStart')) {
	    addPosToEventObj(e);
	    self.selectedTool.dragStart(e);
	}
    }).mousemove(function (e) {
	if (dragStart && self.selectedTool.hasOwnProperty('drag')) {
	    addPosToEventObj(e);
	    self.selectedTool.drag(e);
	}
	if (self.selectedTool.hasOwnProperty('mouseMove')) {
	    addPosToEventObj(e);
	    self.selectedTool.mouseMove(e);
	}
    }).mouseup(function (e) {
	dragStart = false;
	if (self.selectedTool.hasOwnProperty('dragEnd')) {
	    addPosToEventObj(e);
	    self.selectedTool.dragEnd(e);
	}
    }).click(function (e) {
	if (self.selectedTool.hasOwnProperty('click')) {
	    addPosToEventObj(e);
	    self.selectedTool.click(e);
	}
    }).mouseleave(function (e) {
	if (self.selectedTool.hasOwnProperty('mouseLeave')) {
	    addPosToEventObj(e);
	    self.selectedTool.mouseLeave(e);
	}
    });
    $("#editor-tools > .tool").click(function (e) {
	$("#editor-tools > .tool.active").removeClass('active');
	$(this).addClass('active');

	if (self.selectedTool.hasOwnProperty('disable')) {
	    self.selectedTool.disable();
	}

	self.selectedTool = self.tools[$(this).data("tool")];
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
