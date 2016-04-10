var Pen = function(context) {
	var self = AbstractTool(context);

	self.name = 'Pero',
	self.width = 15,
	self.color = '#000000';

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
		self.ctx.arc(e.calcX, e.calcY, self.width/2, 0, 2 * Math.PI, true);
		self.ctx.fill();
	}

	self.sliderChanged = function(value) {
		self.width = value;
		self.ctx.lineWidth = self.width;
	};

	self.lineColorChanged = function(color) {
		self.color = color;
		self.ctx.strokeStyle = self.color;
		self.ctx.fillStyle = self.color;
	};

	self.enable = function() {
		self.ctx.strokeStyle = self.color;
		self.ctx.fillStyle = self.color;
		self.ctx.lineWidth = self.width;
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
		//paintPoint(e);
		interPoint.x = null;
	};

	return self;
};