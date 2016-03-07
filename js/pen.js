var Pen = function(context) {
	
	var ctx = context;
	var previousEvt = null;

	this.name = 'Pero',
	this.width = 3,
	this.color = '#000000';


	var paint = function(e) {
		ctx.beginPath();
		ctx.moveTo(previousEvt.calcX, previousEvt.calcY);
		ctx.lineTo(e.calcX, e.calcY);
		ctx.stroke();
	}

	this.switch = function() {
		ctx.strokeStyle = this.color;
		ctx.lineWidth = this.width;
	}

	this.dragStart = function(e) {
		previousEvt = e;
		paint(e);
	};

	this.drag = function(e) {
		paint(e);
		previousEvt = e;
	}
};