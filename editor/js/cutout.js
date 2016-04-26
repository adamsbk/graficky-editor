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
	    self.clearCanvas();
	    self.reCtx.beginPath();
	    self.reCtx.setLineDash([12, 8]);
	    self.reCtx.rect(prevEvt.calcX, prevEvt.calcY, e.calcX - prevEvt.calcX, e.calcY - prevEvt.calcY);
	    self.reCtx.stroke();
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

    self.sliderChanged = function (value) {

    };
    self.lineColorChanged = function (color) {

    };
    self.fillColorChanged = function (color) {

    };
    self.enable = function () {
	self.reCtx.strokeStyle = self.addAlphaChannel(self.color, 1);
	self.reCtx.lineWidth = self.width;
    };
    self.disable = function () {
	paste();
	self.cuted = false;
	$('#redrawer').css('cursor', 'crosshair');
    }

    self.dragStart = function (e) {
	if (!self.cuted) {
	    prevEvt = e;
	}
    };
    self.drag = function (e) {
	if (!self.cuted) {
	    repaint(e);
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
	    $('#redrawer').css('cursor', 'move');
	    self.image_height = Math.abs(e.calcY - prevEvt.calcY);
	    self.image_width = Math.abs(e.calcX - prevEvt.calcX);
	    self.transX = e.calcX - self.image_width/2;
	    self.transY = e.calcY - self.image_height/2;
	}
    };
    self.translate = function (e) {
	if (self.cuted) {
	    self.transX = e.calcX;
	    self.transY = e.calcY;
	    repaint();
	}
    }

    self.rotationChanged = function (value) {
	if (self.cuted) {
	    self.prev_angle = self.angle;
	    self.angle = value;
	    repaint();
	    self.prev_angle = self.angle;
	}
    }

    self.scalingChanged = function (value) {
	if (self.cuted) {
	    self.prev_scale = self.scale;
	    self.scale = value;
	    repaint();
	    self.prev_scale = self.scale;
	}
    }

    $("#rotationSlider").slider({
	min: -179,
	max: 180,
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