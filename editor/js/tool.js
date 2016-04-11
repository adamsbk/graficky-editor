function AbstractTool(context, redrawerCtx) {
    var tool = {};
    tool.ctx = context;
    tool.reCtx = redrawerCtx || null;
    tool.name = 'Abstract Tool';

    tool.addAlphaChannel = function (color, alpha) {
	return color.replace('rgb', 'rgba').replace(')', ',' + alpha + ')');
    };

    tool.clearCanvas = function (context, x, y, width, height) {
	if (!tool.reCtx && !context) {
	    return;
	}
	if (!context) {
	    tool.reCtx.clearRect(x || 0, y || 0, width || 1024, height || 640);
	} else {
	    context.clearRect(x || 0, y || 0, width || 1024, height || 640);
	}
    };

    tool.getRandomInRange = function (min, max) {
	return Math.random() * (max - min) + min;
    };


    return tool;
}