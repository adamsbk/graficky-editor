var Bucket = function (context, redrawerCtx) {
    var self = AbstractTool(context, redrawerCtx);

    self.name = 'Plechovka';
    self.attrs = ['fillColorPicker'];

    var prevEvt = null;

    function matchColor(pos, r, g, b)
    {
	var imgData = self.ctx.getImageData(pos.X, pos.Y, 1, 1);
	//console.log(r, g, b);
	//console.log(pos.X, pos.Y);
	//console.log(data[0], data[1], data[2]);

	return (imgData.data[0] == r && imgData.data[1] == g && imgData.data[2] == b);
    }

    function fillPixel(pos, r, g, b, ncolor) {
	if (matchColor(pos, r, g, b)) {
	    self.ctx.fillStyle = self.addAlphaChannel(ncolor, 1);
	    //console.log(ncolor);
	    //console.log(pos.X, pos.Y);
	    self.ctx.fillRect(pos.X, pos.Y, 1, 1);
	    if (pos.X - 1 >= 0) {
		if (pos.Y - 1 >= 0) {
		    fillPixel({X: pos.X - 1,Y:pos.Y - 1}, r, g, b, ncolor);
		}
		if (pos.Y + 1 < CONFIG.height) {
		    fillPixel({X: pos.X - 1,Y:pos.Y + 1}, r, g, b, ncolor);
		}
	    }
	    if (pos.X + 1 < CONFIG.width) {
		if (pos.Y - 1 >= 0) {
		    fillPixel({X: pos.X + 1,Y:pos.Y - 1}, r, g, b, ncolor);
		}
		if (pos.Y + 1 < CONFIG.height) {
		    fillPixel({X: pos.X + 1,Y:pos.Y + 1}, r, g, b, ncolor);
		}
	    }
	}
    }

    var paint = function (e) {
	var pos = {X: e.calcX, Y: e.calcY};
	var imgData = self.ctx.getImageData(pos.X, pos.Y, 1, 1);
	console.log(imgData.data[0], imgData.data[1], imgData.data[2]);
	fillPixel(pos, imgData.data[0], imgData.data[1], imgData.data[2], self.fillColor);
    };

    self.fillColorChanged = function (color) {
	self.fillColor = color;
	self.ctx.fillStyle = self.fillColor;
	self.reCtx.fillStyle = self.addAlphaChannel(self.fillColor, 0.5);
    };

    self.enable = function () {
    };



    self.dragStart = function (e) {
	prevEvt = e;
    };

    self.drag = function (e) {
    };

    self.dragEnd = function (e) {
	paint(e);
    };

    return self;
};