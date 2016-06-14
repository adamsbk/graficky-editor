var Bucket = function (context, redrawerCtx) {
    var self = AbstractTool(context, redrawerCtx);

    self.name = 'Plechovka';
    self.attrs = ['fillColorPicker'];

    var prevEvt = null;

    var stack = [];
    var visited = null;
    var imgData;
    
    function matchColor(index, r, g, b, a)
    {
	//console.log(pos.X, pos.Y);
	return (imgData.data[index] === r && imgData.data[index + 1] === g && imgData.data[index + 2] === b && (imgData.data[index+3] === a || (a===0 && imgData.data[index+3] < 192 || a===255 && imgData.data[index+3] >= 192)));
    }

    function fillPixel(r, g, b, a) {
	while (stack.length) {
	    var pos = stack.pop();
	    if (!visited[pos.X][pos.Y]) {

		    var pixelPos = (pos.Y * CONFIG.width + pos.X) * 4;
		    //self.ctx.fillRect(pos.X, pos.Y, 1, 1);
		    if (matchColor(pixelPos, r, g, b, a)) {
		    	paintPixel(pixelPos);
		    	visited[pos.X][pos.Y] = true;

			    if (pos.Y - 1 >= 0) {
				    stack.push({X: pos.X, Y: pos.Y - 1});
			    }
			    if (pos.Y + 1 < CONFIG.height) {
				    stack.push({X: pos.X, Y: pos.Y + 1});
			    }
			    if (pos.X - 1 >= 0) {
				    stack.push({X: pos.X - 1, Y: pos.Y});
			    }
			    if (pos.X + 1 < CONFIG.width) {
				    stack.push({X: pos.X + 1, Y: pos.Y});
			    }
		    }
		}
	}
    }

    var paintPixel = function(pixelPos) {
    	imgData.data[pixelPos] = self.fillColor.r;
		imgData.data[pixelPos+1] = self.fillColor.g;
		imgData.data[pixelPos+2] = self.fillColor.b;
		imgData.data[pixelPos+3] = 255;
    };

    var paint = function (e) {
    visited = new Array(CONFIG.width);
	    for (var i = 0; i < CONFIG.width; i++) {
		visited[i] = new Array(CONFIG.height);
	}

	imgData = self.ctx.getImageData(0, 0, CONFIG.width, CONFIG.height);
	var pos = {X: parseInt(e.calcX), Y: parseInt(e.calcY)};
	stack.push(pos);
	var pixelPos = (pos.Y * CONFIG.width + pos.X) * 4;
	fillPixel(imgData.data[pixelPos], imgData.data[pixelPos+1], imgData.data[pixelPos+2], imgData.data[pixelPos+3]);
	self.ctx.putImageData(imgData, 0, 0);
    };

    self.fillColorChanged = function (color) {
    	var spectr = $("#fillColorPicker").spectrum("get");
    	self.fillColor = spectr.toRgb();
    };

    self.enable = function () {
    	var spectr = $("#fillColorPicker").spectrum("get");
    	self.fillColor = spectr.toRgb();
    	self.fillColor.a = spectr.getAlpha();
    };

    self.click = function (e) {
		paint(e);
    };

    return self;
};