var Ellipse = function (context, redrawerCtx) {
    var self = AbstractTool(context, redrawerCtx);

    self.name = 'Elipsa';

    var prevEvt = null;

    var drawEllipse = function (context, centerX, centerY, width, height) {
	context.beginPath();
	width *= 2;
	height *= 2;

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

    return self;
};