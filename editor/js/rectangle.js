var Rectangle = function (context, redrawerCtx) {
    var self = AbstractTool(context, redrawerCtx);

    self.name = 'Štvoruholník',
	    self.width = 15,
	    self.color = 'rgb(0,0,0)',
	    self.fillColor = 'rgb(0,0,0)';

    var prevEvt = null;

    var paint = function (e) {
	self.ctx.beginPath();
	self.ctx.rect(prevEvt.calcX, prevEvt.calcY, e.calcX - prevEvt.calcX, e.calcY - prevEvt.calcY);
	self.ctx.stroke();
	context.fill();
    };

    var repaint = function (e) {
	self.clearCanvas();

	self.reCtx.beginPath();
	self.reCtx.rect(prevEvt.calcX, prevEvt.calcY, e.calcX - prevEvt.calcX, e.calcY - prevEvt.calcY);
	self.reCtx.stroke();
	context.fill();
    }

    self.sliderChanged = function (value) {
	self.width = value;
	self.ctx.lineWidth = self.width;
	self.reCtx.lineWidth = self.width;
    };

    self.lineColorChanged = function (color) {
	self.color = color;
	self.ctx.strokeStyle = self.color;
	self.reCtx.strokeStyle = self.addAlphaChannel(self.color, 0.5);
    };

    self.fillColorChanged = function (color) {
	self.fillColor = color;
	self.ctx.fillStyle = self.fillColor;
	self.reCtx.fillStyle = self.addAlphaChannel(self.fillColor, 0.5);
    };

    self.enable = function () {
	self.ctx.strokeStyle = self.color;
	self.reCtx.strokeStyle = self.addAlphaChannel(self.color, 0.5);
	self.ctx.lineWidth = self.width;
	self.reCtx.lineWidth = self.width;
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

    return self;
};