var Eraser = function(context, redrawerCtx) {
	var self = AbstractTool(context, redrawerCtx);

	self.attrs = ['penWidthSlider'];
	self.name = 'Guma';

	var prevEvt = null;
	var interPoint = {x: null, y: null};


	var paint = function(e) {
		self.ctx.beginPath();
		if (interPoint.x === null) {
			self.ctx.moveTo(prevEvt.calcX, prevEvt.calcY);
		} else {
			self.ctx.moveTo(interPoint.x, interPoint.y);
		}
		interPoint.x = (prevEvt.calcX + e.calcX)/2;
		interPoint.y = (prevEvt.calcY + e.calcY)/2;
		self.ctx.quadraticCurveTo(prevEvt.calcX, prevEvt.calcY, interPoint.x, interPoint.y);
		self.ctx.stroke();
	};

	var repaint = function(e) {
		self.clearCanvas();
		self.reCtx.beginPath();
		var radius = self.penWidth/2;
		self.reCtx.arc(e.calcX, e.calcY, radius, 0, 2 * Math.PI, false);
		self.reCtx.stroke();
	};

	var paintPoint = function(e) {
		self.ctx.beginPath();
		self.ctx.moveTo(e.calcX, e.calcY);
		self.ctx.arc(e.calcX, e.calcY, self.penWidth/2, 0, 2 * Math.PI, true);
		self.ctx.fill();
	};

	self.penWidthChanged = function(value) {
		self.penWidth = value;
		self.ctx.lineWidth = self.penWidth;
	};

	self.enable = function() {
		self.ctx.globalCompositeOperation="destination-out";
		self.ctx.lineWidth = self.penWidth;
		self.ctx.lineCap = "round";
		self.reCtx.strokeStyle = '#aaa';
		self.reCtx.lineWidth = 1;
		$('#listen-events').addClass('eraser');
	};

	self.disable = function() {
		self.clearCanvas();
		self.ctx.globalCompositeOperation="source-over";
		$('#listen-events').removeClass('eraser');
	};

	self.dragStart = function(e) {
		prevEvt = e;
		paintPoint(e);
	};

	self.drag = function(e) {
		paint(e);
		prevEvt = e;
	};

	self.mouseMove = function(e) {
		repaint(e);
	};

	self.mouseLeave = function(e) {
		self.clearCanvas();
	};

	self.dragEnd = function(e) {
		prevEvt = e;
		paint(e);
		interPoint.x = null;
	};

	return self;
};