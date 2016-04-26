var Line = function(context, redrawerCtx) {
	var self = AbstractTool(context, redrawerCtx);
	
	self.attrs = ['lineColorPicker', 'penWidthSlider'];
	self.name = 'Čiara';

	var prevEvt = null;

	var paint = function(e) {
		self.ctx.beginPath();
		self.ctx.moveTo(prevEvt.calcX, prevEvt.calcY);
		self.ctx.lineTo(e.calcX, e.calcY);
		self.ctx.stroke();
	};

	var repaint = function(e) {
		self.clearCanvas();
		
		self.reCtx.beginPath();
		self.reCtx.moveTo(prevEvt.calcX, prevEvt.calcY);
		self.reCtx.lineTo(e.calcX, e.calcY);
		self.reCtx.stroke();
	}

	self.sliderChanged = function(value) {
		self.penWidth = value;
		self.ctx.lineWidth = self.penWidth;
		self.reCtx.lineWidth = self.penWidth;
	};

	self.lineColorChanged = function(color) {
		self.lineColor = color;
		self.ctx.strokeStyle = self.lineColor;
		self.reCtx.strokeStyle = self.addAlphaChannel(self.lineColor, 0.5);
	};

	self.enable = function() {
		self.ctx.strokeStyle = self.lineColor;
		self.reCtx.strokeStyle = self.addAlphaChannel(self.lineColor, 0.5);
		self.ctx.lineWidth = self.penWidth;
		self.reCtx.lineWidth = self.penWidth;
		self.ctx.lineCap = "round";
		self.reCtx.lineCap = "round";
	};

	self.dragStart = function(e) {
		prevEvt = e;
	};

	self.drag = function(e) {
		repaint(e);
	};

	self.dragEnd = function(e) {
		self.clearCanvas();
		paint(e);
	};

	return self;
};