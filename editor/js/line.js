var Line = function(context, redrawerCtx) {
	var self = AbstractTool(context, redrawerCtx);
	
	self.name = 'Čiara',
	self.width = 15,
	self.color = 'rgb(0,0,0)';

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
		self.width = value;
		self.ctx.lineWidth = self.width;
		self.reCtx.lineWidth = self.width;
	};

	self.lineColorChanged = function(color) {
		self.color = color;
		self.ctx.strokeStyle = self.color;
		self.reCtx.strokeStyle = self.addAlphaChannel(self.color, 0.5);
	};

	self.enable = function() {
		self.ctx.strokeStyle = self.color;
		self.reCtx.strokeStyle = self.addAlphaChannel(self.color, 0.5);
		self.ctx.lineWidth = self.width;
		self.reCtx.lineWidth = self.width;
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