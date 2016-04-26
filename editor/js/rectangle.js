var Rectangle = function (context, redrawerCtx) {
    var self = AbstractTool(context, redrawerCtx);

    self.name = 'Štvoruholník',
	self.ShiftPressed = false;

    var prevEvt = null;

    var paint = function (e) {
	self.ctx.beginPath();
	if (self.ShiftPressed) {
	    self.ctx.rect(prevEvt.calcX, prevEvt.calcY, e.calcX - prevEvt.calcX, e.calcX - prevEvt.calcX);
	} else {
	    self.ctx.rect(prevEvt.calcX, prevEvt.calcY, e.calcX - prevEvt.calcX, e.calcY - prevEvt.calcY);
	}
	self.ctx.fill();
	self.ctx.stroke();
    };

    var repaint = function (e) {
	self.clearCanvas();

	self.reCtx.beginPath();
	if (self.ShiftPressed) {
	    self.reCtx.rect(prevEvt.calcX, prevEvt.calcY, e.calcX - prevEvt.calcX, e.calcX - prevEvt.calcX);
	} else {
	    self.reCtx.rect(prevEvt.calcX, prevEvt.calcY, e.calcX - prevEvt.calcX, e.calcY - prevEvt.calcY);
	}
	self.reCtx.fill();
	self.reCtx.stroke();

    }

    self.penWidthChanged = function (value) {
	self.penWidth = value;
	self.ctx.lineWidth = self.penWidth;
	self.reCtx.lineWidth = self.penWidth;
    };

    self.lineColorChanged = function (color) {
	self.lineColor = color;
	self.ctx.strokeStyle = self.lineColor;
	self.reCtx.strokeStyle = self.addAlphaChannel(self.lineColor, 0.5);
    };

    self.fillColorChanged = function (color) {
	self.fillColor = color;
	self.ctx.fillStyle = self.fillColor;
	self.reCtx.fillStyle = self.addAlphaChannel(self.fillColor, 0.5);
    };

    self.enable = function () {
	self.ctx.strokeStyle = self.lineColor;
	self.reCtx.strokeStyle = self.addAlphaChannel(self.lineColor, 0.5);
	self.ctx.fillStyle = self.fillColor;
    self.reCtx.fillStyle = self.addAlphaChannel(self.fillColor, 0.5);
	self.ctx.lineWidth = self.penWidth;
	self.reCtx.lineWidth = self.penWidth;
	self.ctx.lineCap = "round";
	self.reCtx.lineCap = "round";
    };



    self.dragStart = function (e) {
	prevEvt = e;
    };

    self.drag = function (e) {
	repaint(e);
    };

    self.dragEnd = function (e) {
	self.clearCanvas();
	paint(e);
    };

    self.keyUp = function (e) {
	if (e.keyCode == 16) {
	    self.ShiftPressed = false;
	}
    }

    self.keyDown = function (e) {
	if (e.keyCode == 16) {
	    self.ShiftPressed = true;
	}
    }

    $(document).keyup(self.keyUp);
    $(document).keydown(self.keyDown);


    return self;
};