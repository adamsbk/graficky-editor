var Pen = function(context) {
	var self = AbstractTool(context);

	self.attrs = ['lineColorPicker', 'penWidthSlider'];
	self.name = 'Pero';

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

	var paintPoint = function(e) {
		self.ctx.beginPath();
		self.ctx.moveTo(e.calcX, e.calcY);
		self.ctx.arc(e.calcX, e.calcY, self.penWidth/2, 0, 2 * Math.PI, true);
		self.ctx.fill();
	}

	self.penWidthChanged = function(value) {
		self.penWidth = value;
		self.ctx.lineWidth = self.penWidth;
	};

	self.lineColorChanged = function(color) {
		self.lineColor = color;
		self.ctx.strokeStyle = self.lineColor;
		self.ctx.fillStyle = self.lineColor;
	};

	self.enable = function() {
		self.ctx.strokeStyle = self.lineColor;
		self.ctx.fillStyle = self.lineColor;
		self.ctx.lineWidth = self.penWidth;
		self.ctx.lineCap = "round";
	};

	self.dragStart = function(e) {
		prevEvt = e;
		paintPoint(e);
	};

	self.drag = function(e) {
		paint(e);
		prevEvt = e;
	};

	self.dragEnd = function(e) {
		prevEvt = e;
		paint(e);
		interPoint.x = null;
	};

	return self;
};