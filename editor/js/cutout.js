var Cutout = function (context, redrawerCtx) {
	var self = AbstractTool(context, redrawerCtx);

	self.attrs = ['rotationSlider', 'scalingSlider'];
	self.name = 'Výrez',
	self.width = 1,
	self.color = 'rgb(0,0,0)',
	self.fillColor = 'rgb(0,0,0)',
	self.cuted = false,
	self.angle = 0,
	self.scale = 1,
	self.transX = 0,
	self.transY = 0,
	self.image_width = 0,
	self.image_height = 0;

	var cutoutUi = $('#cutout-ui');
	var isScaledByUi = false;
	var scalePrevEvt = null;
	var dragDropScale = {x: 0, y: 0};
	$('#cutout-scale').mousedown(function() {
		isScaledByUi = true;
	});
	var isRotatedByUi = false;
	var dragDropRotationPrev = null;
	$('#cutout-rotate').mousedown(function() {
		isRotatedByUi = true;
	});

	var prevEvt = null;
	var posEvt = null;
	var cut = function (e) {
		self.reCtx.drawImage(self.ctx.canvas, prevEvt.calcX, prevEvt.calcY, e.calcX - prevEvt.calcX, e.calcY - prevEvt.calcY, prevEvt.calcX, prevEvt.calcY, e.calcX - prevEvt.calcX, e.calcY - prevEvt.calcY);
		var tempCtx = document.getElementById('transformations').getContext('2d');
		self.clearCanvas(tempCtx);
		tempCtx.drawImage(self.ctx.canvas, prevEvt.calcX, prevEvt.calcY, e.calcX - prevEvt.calcX, e.calcY - prevEvt.calcY, prevEvt.calcX, prevEvt.calcY, e.calcX - prevEvt.calcX, e.calcY - prevEvt.calcY);
		self.clearCanvas(self.ctx, prevEvt.calcX, prevEvt.calcY, e.calcX - prevEvt.calcX, e.calcY - prevEvt.calcY);
	};

	var paste = function () {
		self.ctx.drawImage(self.reCtx.canvas, 0, 0, CONFIG.width, CONFIG.height);
		self.clearCanvas(self.reCtx);
	}

	var repaint = function (e) {
		if (!self.cuted) {
			/*self.clearCanvas();
			self.reCtx.beginPath();
			self.reCtx.setLineDash([12, 8]);
			self.reCtx.rect(prevEvt.calcX, prevEvt.calcY, e.calcX - prevEvt.calcX, e.calcY - prevEvt.calcY);
			self.reCtx.stroke();*/
		} else {
			var tempCtx = document.getElementById('transformations').getContext('2d');
			self.clearCanvas(self.reCtx);
			self.reCtx.save();
			self.reCtx.translate(self.transX - prevEvt.calcX - self.image_width/2, self.transY - prevEvt.calcY - self.image_height/2);
			self.reCtx.translate((prevEvt.calcX + self.image_width/2), (prevEvt.calcY + self.image_height/2));
			self.reCtx.rotate(((self.angle) / 180) * Math.PI);
			self.reCtx.scale(self.scale, self.scale);
			self.reCtx.translate(-1*(prevEvt.calcX + self.image_width/2), -1*(prevEvt.calcY + self.image_height/2));
			self.reCtx.drawImage(tempCtx.canvas, 0, 0, CONFIG.width, CONFIG.height);
			self.reCtx.restore();
		}
	}

	self.enable = function () {
		self.angle = 0,
		self.scale = 1,
		self.transX = 0,
		self.transY = 0,
		self.reCtx.strokeStyle = self.addAlphaChannel(self.color, 1);
		self.reCtx.lineWidth = self.width;
	};
	self.disable = function () {
		paste();
		self.cuted = false;
		cutoutUi.css('transform', 'none').addClass('hide');
		$('#redrawer').css('cursor', 'crosshair');
	}

	self.dragStart = function (e) {
		if (!self.cuted) {
			prevEvt = e;
			cutoutUi.css({
				'left': prevEvt.calcX,
				'top': prevEvt.calcY
			}).removeClass('hide');
		} else if (isScaledByUi) {
			scalePrevEvt = e;
			var mapToStartingPointX = self.image_width*(self.scale - 1)/2;
			var mapToStartingPointY = self.image_height*(self.scale - 1)/2;
			dragDropScale.x = e.calcX;
			dragDropScale.y = e.calcY;
			dragDropScale.x += e.calcX > self.transX ? - mapToStartingPointX : mapToStartingPointX;
			dragDropScale.y += e.calcY > self.transY ? - mapToStartingPointY : mapToStartingPointY;
		} else if (isRotatedByUi) {
			dragDropRotationPrev = e.calcX;
		}
	};
	self.drag = function (e) {
		if (!self.cuted) {
			repaint(e);

			cutoutUi.css({
				'width': Math.abs(e.calcX - prevEvt.calcX),
				'height': Math.abs(e.calcY - prevEvt.calcY),
				'left': Math.min(e.calcX, prevEvt.calcX),
				'top': Math.min(e.calcY, prevEvt.calcY)
			});
		} else if (isScaledByUi) {
			var scaleDist = Math.sqrt(
				(dragDropScale.x-e.calcX)*(dragDropScale.x-e.calcX) +
				(dragDropScale.y-e.calcY)*(dragDropScale.y-e.calcY)
			);
			if (
				(e.calcX-self.transX) * (e.calcX-self.transX) + (e.calcY-self.transY) * (e.calcY-self.transY) <
				(self.image_width/2) * (self.image_width/2) + (self.image_height/2) * (self.image_height/2)
			) {
				scaleDist = -scaleDist;
			}
			self.scalingChanged((self.image_width+2*scaleDist) / self.image_width);
		} else if (isRotatedByUi) {
			var rotateBy = e.calcX - dragDropRotationPrev;
			self.rotationChanged((self.angle + rotateBy) % 360);
			dragDropRotationPrev = e.calcX;
		} else {
			self.translate(e);
		}
	};
	self.dragEnd = function (e) {
		if (!self.cuted) {
			self.clearCanvas();
			posEvt = e;
			cut(e);
			self.cuted = true;
			self.image_height = Math.abs(e.calcY - prevEvt.calcY);
			self.image_width = Math.abs(e.calcX - prevEvt.calcX);
			self.transX = e.calcX - self.image_width/2;
			self.transY = e.calcY - self.image_height/2;

			$('listen-events').css('cursor', 'move');
			cutoutUi.css({
				'width': self.image_width,
				'height': self.image_height,
				'left': Math.min(e.calcX, prevEvt.calcX),
				'top': Math.min(e.calcY, prevEvt.calcY)
			});
		} else if (isScaledByUi) {
			isScaledByUi = false;
		} else if (isRotatedByUi) {
			isRotatedByUi = false;
		} 
	};
	self.translate = function (e) {
		if (self.cuted) {
			self.transX = e.calcX;
			self.transY = e.calcY;
			cutoutUi.css({
				'left': e.calcX - self.image_width * self.scale/2,
				'top': e.calcY - self.image_height * self.scale/2
			});
			repaint();
		}
	}

	self.rotationChanged = function (value) {
		if (self.cuted) {
			self.prev_angle = self.angle;
			self.angle = value;
			cutoutUi.css('transform', 'rotate('+self.angle+'deg)');
			repaint();
			self.prev_angle = self.angle;
		}
	}

	self.scalingChanged = function (value) {
		if (self.cuted) {
			var newWidth = value * self.image_width;
			var newHeight = value * self.image_height;
			if (value < 0) {
				return;
			}
			self.prev_scale = self.scale;
			self.scale = value;
			cutoutUi.css({
				'left': parseFloat(cutoutUi.css('left')) - (newWidth - self.image_width * self.prev_scale)/2,
				'top': parseFloat(cutoutUi.css('top')) - (newHeight - self.image_height * self.prev_scale)/2,
				'width': newWidth,
				'height': newHeight
			});
			repaint();
			self.prev_scale = self.scale;
		}
	}

	$("#rotationSlider").slider({
		min: -360,
		max: 360,
		value: 0,
		change: function (event, ui) {
			self.rotationChanged(ui.value);
		}
	});
    //trigger slidechange
    $('#rotationSlider').slider('value', $('#rotationSlider').slider('value'));
    $("#scalingSlider").slider({
    	min: 0.1,
    	max: 2,
    	value: 1,
    	step: 0.1,
    	change: function (event, ui) {
    		self.scalingChanged(ui.value);
    	}
    });
    //trigger slidechange
    $('#scalingSlider').slider('value', $('#scalingSlider').slider('value'));
    return self;
};