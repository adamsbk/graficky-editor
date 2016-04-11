var Cutout = function (context, redrawerCtx) {
    var self = AbstractTool(context, redrawerCtx);
    self.name = 'Výrez',
	    self.width = 1,
	    self.color = 'rgb(0,0,0)',
	    self.fillColor = 'rgb(0,0,0)',
	    self.cuted = false,
	    self.angle = 180,
	    self.scale = 1,
	    self.transX = 0;
    self.transY = 0;

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
	self.clearCanvas();
	self.reCtx.beginPath();
	self.reCtx.setLineDash([12, 8]);
	self.reCtx.rect(prevEvt.calcX, prevEvt.calcY, e.calcX - prevEvt.calcX, e.calcY - prevEvt.calcY);
	self.reCtx.stroke();
    }

    self.sliderChanged = function (value) {

    };
    self.lineColorChanged = function (color) {

    };
    self.fillColorChanged = function (color) {

    };
    self.enable = function () {
	self.reCtx.save();
	self.reCtx.strokeStyle = self.addAlphaChannel(self.color, 1);
	self.reCtx.lineWidth = self.width;
    };
    self.disable = function () {
	self.reCtx.restore();
	paste();
	self.cuted = false;
	$('#redrawer').css('cursor', 'crosshair');
    }

    self.dragStart = function (e) {
	prevEvt = e;
	self.transX = e.calcX;
	self.transY = e.calcY;
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
	}
    };
    self.translate = function (e) {
	var tempCtx = document.getElementById('transformations').getContext('2d');
	self.clearCanvas(self.reCtx);
	self.reCtx.translate(e.calcX - self.transX, e.calcY - self.transY);
	self.reCtx.drawImage(tempCtx.canvas, 0, 0, CONFIG.width, CONFIG.height);
	self.transX = e.calcX;
	self.transY = e.calcY;
    }

    self.rotationChanged = function (value) {
	if (self.cuted) {
	    var tempCtx = document.getElementById('transformations').getContext('2d');
	    self.clearCanvas(self.reCtx);
	    self.reCtx.translate((prevEvt.calcX + posEvt.calcX) / 2, (prevEvt.calcY + posEvt.calcY) / 2);
	    self.reCtx.rotate(((value - self.angle) / 180) * Math.PI);
	    self.reCtx.translate(-1 * ((prevEvt.calcX + posEvt.calcX) / 2), -1 * ((prevEvt.calcY + posEvt.calcY) / 2));
	    self.reCtx.drawImage(tempCtx.canvas, 0, 0, CONFIG.width, CONFIG.height);
	    self.angle = value;
	}
    }

    self.scalingChanged = function (value) {
	if (self.cuted) {
	    var tempCtx = document.getElementById('transformations').getContext('2d');
	    self.clearCanvas(self.reCtx);
	    self.reCtx.translate((prevEvt.calcX + posEvt.calcX) / 2, (prevEvt.calcY + posEvt.calcY) / 2);
	    self.reCtx.scale(value / self.scale, value / self.scale);
	    self.reCtx.translate(-1 * ((prevEvt.calcX + posEvt.calcX) / 2), -1 * ((prevEvt.calcY + posEvt.calcY) / 2));
	    self.reCtx.drawImage(tempCtx.canvas, 0, 0, CONFIG.width, CONFIG.height);
	    self.scale = value;
	}
    }


    $("#rotationSlider").slider({
	min: 1,
	max: 360,
	value: 180,
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