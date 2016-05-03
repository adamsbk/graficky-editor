var Seal = function (context, redrawerCtx) {
    var self = AbstractTool(context, redrawerCtx);

    self.attrs = [];
    self.name = 'Pečiatka';
    self.images = ['res/img/cat.png', 'res/img/car.png', 'res/img/heart_sk.png', 'res/img/barretr-Pencil-300px.png',
		    'res/img/star.png', 'res/img/rainbow.png'];

    var prevEvt = null;


    var paint = function (e) {
    };

    self.enable = function () {
	$('#seal_images').show(200);
    };

    self.disable = function () {
	$('#seal_images').hide(200);
    };

    self.drawImage = function (src) {
	var img = new Image();
	img.src = src;
	var tempCtx = document.getElementById('transformations').getContext('2d');
	self.clearCanvas(tempCtx);
	//tempCtx.drawImage(img, parseInt($('#resizable-layer').css('left')), parseInt($('#resizable-layer').css('top')));
	tempCtx.drawImage(img, 0, 0);
	ToolManager.switchToCutOut(img.width, img.height);
    }

    for (i in self.images) {
	$('#seal_images').append('<img class="imageChoosed" src="' + self.images[i] + '">');
    };

    return self;
};

