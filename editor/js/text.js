var Text = function(context, redrawerCtx) {
	var self = AbstractTool(context, redrawerCtx);
	
	self.attrs = ['lineColorPicker', 'penWidthSlider'];
	self.name = 'Text';
	self.penWidth = 16;

	var lineHeightMult = 1.2;
	var pos = {x: null, y: null};
	var ret = [''];
	var enabled = false;

	var paint = function(e) {
		self.clearCanvas();
		for (var i=0; i<ret.length; i++) {
			self.ctx.fillText(ret[i], pos.x, pos.y + i * self.penWidth * lineHeightMult);
		}
	};

	var repaint = function() {
		self.clearCanvas();
		for (var i=0; i<ret.length; i++) {
			self.reCtx.fillText(ret[i], pos.x, pos.y + i * self.penWidth * lineHeightMult);
		}
	};

	var timer = null;
	var drawCursor = function() {
		if (timer) {
			window.clearInterval(timer);
			timer = null;
		}
		var count = 0;
		timer = window.setInterval(function() {
			if( count%2 === 0) {
				var fromTop = (ret.length-1) * self.penWidth * lineHeightMult;
				var textWidth = self.reCtx.measureText(ret[ret.length-1]).width;
				self.reCtx.beginPath();
				self.reCtx.moveTo(pos.x + textWidth, fromTop + pos.y-self.penWidth);
				self.reCtx.lineTo(pos.x + textWidth, fromTop + pos.y+self.penWidth/3);
				self.reCtx.closePath();
				self.reCtx.stroke();
            }
			else {
				self.clearCanvas();
				repaint();
			}
			count++;
        },600);
	};

	self.penWidthChanged = function(value) {
		self.penWidth = value;
		self.ctx.font = self.penWidth + "px Verdana";
		self.reCtx.font = self.penWidth + "px Verdana";
		repaint();
	};

	self.lineColorChanged = function(color) {
		self.lineColor = color;
		self.ctx.fillStyle = self.lineColor;
		self.reCtx.fillStyle = self.addAlphaChannel(self.lineColor, 0.5);
	};

	self.enable = function() {
		enabled = true;
		pos.x = null;
		pos.y = null;
		ret = '';
		self.ctx.fillStyle = self.lineColor;
		self.reCtx.fillStyle = self.addAlphaChannel(self.lineColor, 0.5);
		self.penWidthChanged(16);
		self.reCtx.strokeStyle = '#000';
		self.reCtx.lineWidth = 1;
	};

	self.disable = function() {
		if (timer) {
			window.clearInterval(timer);
			timer = null;
			self.clearCanvas();
		}
		enabled = false;
		paint();
	};

	self.click = function(e) {
		paint();
		pos.x = e.calcX;
		pos.y = e.calcY;
		drawCursor();
		ret = [''];
	};

	self.keyPressed = function(e) {
		if (!enabled) {
			return;
		}
		if (pos.x===null || pos.y===null) {
			return;
		}
		if (e.which < 32 && e.which !== 13 && e.which !== 8) {
			return;
		}
		if (e.which === 13) {
			ret.push('');
		} else if (e.which === 8) {
			if (ret[ret.length-1].length > 0) {
				ret[ret.length-1] = ret[ret.length-1].slice(0, -1);
			} else if (ret.length > 1) {
				ret.pop();
			}
		} else {
			if (e.which === 32) {
				e.preventDefault();
			}
			ret[ret.length-1] += String.fromCharCode(e.which);
		}
		repaint();
	}

	$(document).keypress(self.keyPressed);

	return self;
};