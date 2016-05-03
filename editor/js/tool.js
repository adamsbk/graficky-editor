function AbstractTool(context, redrawerCtx) {
    var tool = {};
    tool.ctx = context;
    tool.reCtx = redrawerCtx || null;

    tool.penWidth = 15,
    tool.lineColor = '#000000';
    tool.fillColor = 'rgb(0,0,0)';
    tool.attrs = ['lineColorPicker', 'fillColorPicker', 'penWidthSlider'];

    tool.name = 'Abstract Tool';

    tool.addAlphaChannel = function (color, alpha) {
	   return color.replace('rgb', 'rgba').replace(')', ',' + alpha + ')');
    };

    tool.clearCanvas = function (context, x, y, width, height) {
	if (!tool.reCtx && !context) {
	    return;
	}
	if (!context) {
	    tool.reCtx.clearRect(x || 0, y || 0, width || CONFIG.width, height || CONFIG.height);
	} else {
	    context.clearRect(x || 0, y || 0, width || CONFIG.width, height || CONFIG.height);
	}
    };

    tool.getRandomInRange = function (min, max) {
	return Math.random() * (max - min) + min;
    };


    return tool;
}