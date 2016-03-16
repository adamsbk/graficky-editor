var ToolManager = new function () {
    var self = this;
    var tools = {
	pen: new Pen(Canvas.ctx),
	line: new Line(Canvas.ctx, Canvas.redrawerCtx),
	star: new Star(Canvas.ctx, Canvas.redrawerCtx),
	rectangle: new Rectangle(Canvas.ctx, Canvas.redrawerCtx),
	ellipse: new Ellipse(Canvas.ctx, Canvas.redrawerCtx)
    };
    console.log(self);
    this.selectedTool = tools['pen'];
    this.selectedTool.switch();

    var addPosToEventObj = function (e) {
	var rect = Canvas.canvas.getBoundingClientRect();
	e.calcX = e.clientX - rect.left;
	e.calcY = e.clientY - rect.top;
    };

    this.sliderChanged = function (value) {
	if (self.selectedTool.hasOwnProperty('sliderChanged')) {
	    self.selectedTool.sliderChanged(value);
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
    $(Canvas.redrawerCanvas).mousedown(function (e) {
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
	$("#slider").slider("value", self.selectedTool.width);
    });

    $("#slider").slider({
	min: 1,
	max: 50,
	value: 5,
	change: function (event, ui) {
	    self.sliderChanged(ui.value);
	}
    });
    //trigger slidechange
    $('#slider').slider('value', $('#slider').slider('value'));

    $("#linecolorpicker").spectrum({
	color: '#FF0000',
	preferredFormat: "hex",
	showInput: true,
	showPalette: true,
	palette: [["red", "rgba(0, 255, 0, .5)", "rgb(0, 0, 255)"]],
	move: function (color) {
	    self.lineColorChanged(color.toRgbString());
	}
    });

    $("#fillcolorpicker").spectrum({
	color: '#FF0000',
	preferredFormat: "hex",
	showInput: true,
	showPalette: true,
	palette: [["red", "rgba(0, 255, 0, .5)", "rgb(0, 0, 255)", "rgba(0, 0, 0, 0)",]],
	move: function (color) {
	    self.fillColorChanged(color.toRgbString());
	}
    });
};