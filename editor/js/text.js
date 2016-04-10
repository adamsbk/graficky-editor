var Text = function(context, redrawerCtx) {
	var self = AbstractTool(context, redrawerCtx);
	
	self.name = 'Text';
	self.width = 15;
	self.color = 'rgb(0,0,0)';

	var pos = {x: null, y: null};
	var ret = '';
	var enabled = false;

	var paint = function(e) {
		self.clearCanvas();
		self.ctx.fillText(ret, pos.x, pos.y);
	};

	var repaint = function() {
		self.clearCanvas();
		self.reCtx.fillText(ret, pos.x, pos.y);
	}

	self.colorChanged = function(color) {
		self.color = color;
		self.ctx.fillStyle = self.color;
		self.reCtx.fillStyle = self.addAlphaChannel(self.color, 0.5);
	};

	self.enable = function() {
		enabled = true;
		pos.x = null;
		pos.y = null;
		ret = '';
		self.ctx.font = "16px Verdana";
		self.reCtx.font = "16px Verdana";
	};

	self.disable = function() {
		enabled = false;
		paint();
	};

	self.click = function(e) {
		paint();
		pos.x = e.calcX;
		pos.y = e.calcY;
		ret = '';
	};

	self.keyPressed = function(e) {
		if (pos.x===null || pos.y===null) {
			return;
		}
		if (!((e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122) || e.charCode===32)) {
			return;
		}
		ret += e.key;
		repaint();
	}

	$(document).keypress(self.keyPressed);

	return self;
};