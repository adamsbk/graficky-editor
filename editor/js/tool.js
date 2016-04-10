function AbstractTool(context, redrawerCtx) {
	var tool = {};
	tool.ctx = context;
	tool.reCtx = redrawerCtx || null;
	tool.name = 'Abstract Tool';

	tool.addAlphaChannel = function(color, alpha) {
		return color.replace('rgb', 'rgba').replace(')', ','+ alpha +')');
	};

	tool.clearCanvas = function() {
		if (!tool.reCtx) {
			return;
		}
		tool.reCtx.clearRect(0, 0, 1024, 640);
	};

	tool.getRandomInRange = function(min, max) {
		return Math.random() * (max - min) + min;
	};


	return tool;
}