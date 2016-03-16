var Ellipse = function (context, redrawerCtx) {
    var self = AbstractTool(context, redrawerCtx);

    self.name = 'Elipsa',
	    self.width = 15,
	    self.color = 'rgb(0,0,0)';
    self.fillColor = 'rgb(0,0,0)';

    var prevEvt = null;

    var drawEllipse = function (context, centerX, centerY, width, height) {
	context.beginPath();

	context.moveTo(centerX, centerY - height / 2);

	context.bezierCurveTo(
		centerX + width / 2, centerY - height / 2,
		centerX + width / 2, centerY + height / 2,
		centerX, centerY + height / 2);

	context.bezierCurveTo(
		centerX - width / 2, centerY + height / 2,
		centerX - width / 2, centerY - height / 2,
		centerX, centerY - height / 2);

	context.closePath();
	context.stroke();
	context.fill();

    };

    var paint = function (e, context) {
	drawEllipse(context || self.ctx, prevEvt.calcX, prevEvt.calcY, e.calcX - prevEvt.calcX, e.calcY - prevEvt.calcY);
    };

    var repaint = function (e) {
	self.clearCanvas();
	paint(e, self.reCtx)
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

    self.switch = function () {
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