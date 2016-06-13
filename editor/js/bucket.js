var Bucket = function (context, redrawerCtx) {
    var self = AbstractTool(context, redrawerCtx);

    self.name = 'Plechovka';
    self.attrs = ['fillColorPicker'];

    var prevEvt = null;

    var stack = [];
    var visited = new Array(CONFIG.width);
    for (var i = 0; i < CONFIG.width; i++) {
	visited[i] = new Array(CONFIG.height);
    }
    var imgData;
    
    function matchColor(pos, r, g, b, a)
    {
	//console.log(r, g, b);
	//console.log(pos.X, pos.Y);
	//console.log(imgData.data[0], imgData.data[1], imgData.data[2]);
	var index = (CONFIG.width * pos.Y + pos.X) * 4;
	return (imgData.data[index] === r && imgData.data[index + 1] === g && imgData.data[index + 2] === b && imgData.data[index + 3] === a);
    }

    function fillPixel(r, g, b, a) {
	while (stack.length) {
	    var pos = stack.pop();
	    self.ctx.fillRect(pos.X, pos.Y, 1, 1);
	    if (matchColor(pos, r, g, b, a)) {
		if (pos.X - 1 >= 0) {
		    if (pos.Y - 1 >= 0) {
			if (!visited[pos.X - 1][pos.Y - 1]) {
			    stack.push({X: pos.X - 1, Y: pos.Y - 1});
			    visited[pos.X - 1][pos.Y - 1] = true;
			}
		    }
		    if (pos.Y + 1 < CONFIG.height) {
			if (!visited[pos.X - 1][pos.Y + 1]) {
			    stack.push({X: pos.X - 1, Y: pos.Y + 1});
			    visited[pos.X - 1][pos.Y + 1] = true;
			}
		    }
		}
		if (pos.X + 1 < CONFIG.width) {
		    if (pos.Y - 1 >= 0) {
			if (!visited[pos.X + 1][pos.Y - 1]) {
			    stack.push({X: pos.X + 1, Y: pos.Y - 1});
			    visited[pos.X + 1][pos.Y - 1] = true;
			}
		    }
		    if (pos.Y + 1 < CONFIG.height) {
			if (!visited[pos.X + 1][pos.Y + 1]) {
			    stack.push({X: pos.X + 1, Y: pos.Y + 1});
			    visited[pos.X + 1][pos.Y + 1] = true;
			}
		    }
		}
	    }
	}
    }

    var paint = function (e) {
	imgData = self.ctx.getImageData(0, 0, CONFIG.width, CONFIG.height);
	var pos = {X: e.calcX, Y: e.calcY};
	var imgDat = self.ctx.getImageData(pos.X, pos.Y, 1, 1);
	self.ctx.fillStyle = self.addAlphaChannel(self.fillColor, 1);
	stack.push(pos);
	visited[pos.X][pos.Y] = true;
	fillPixel(imgDat.data[0], imgDat.data[1], imgDat.data[2], imgDat.data[3]);
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