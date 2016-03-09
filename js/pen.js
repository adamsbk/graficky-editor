var Pen = function(context) {
	var self = this;
	var ctx = context;
	var prevEvt = null;
	var interPoint = {x: null, y: null};

	this.name = 'Pero',
	this.width = 15,
	this.color = '#000000';


	var paint = function(e) {
		ctx.beginPath();
		if (interPoint.x === null) {
			ctx.moveTo(prevEvt.calcX, prevEvt.calcY);
		} else {
			ctx.moveTo(interPoint.x, interPoint.y);
		}
		interPoint.x = (prevEvt.calcX + e.calcX)/2;
		interPoint.y = (prevEvt.calcY + e.calcY)/2;
		ctx.quadraticCurveTo(prevEvt.calcX, prevEvt.calcY, interPoint.x, interPoint.y);
		ctx.stroke();
	};

	var paintPoint = function(e) {
		ctx.beginPath();
		ctx.moveTo(e.calcX, e.calcY);
		ctx.arc(e.calcX, e.calcY, self.width/2, 0, 2 * Math.PI, true);
		ctx.fill();
	}

	this.sliderChanged = function(value) {
		this.width = value;
		ctx.lineWidth = this.width;
	};

	this.colorChanged = function(color) {
		this.color = color;
		ctx.strokeStyle = this.color;
		ctx.fillStyle = this.color;
		console.log(this.color);
	};

	this.switch = function() {
		ctx.strokeStyle = this.color;
		ctx.fillStyle = this.color;
		ctx.lineWidth = this.width;
		ctx.lineCap = "round";
	};

	this.dragStart = function(e) {
		prevEvt = e;
		paintPoint(e);
	};

	this.drag = function(e) {
		paint(e);
		prevEvt = e;
	};

	this.dragEnd = function(e) {
		prevEvt = e;
		paint(e);
		//paintPoint(e);
		interPoint.x = null;
	};
};