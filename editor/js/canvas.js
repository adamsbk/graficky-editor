const CONFIG = {
    canvas_selector: '#editor',
    redrawer_selector: '#redrawer',
    width: 1024,
    height: 640
}

var Canvas = new function () {
    var self = this;
    this.canvas = $(CONFIG.canvas_selector);
    this.redrawerCanvas = $(CONFIG.redrawer_selector);
    if (this.canvas.length === 0 || this.redrawerCanvas.length === 0) {
	console.error('Canvas selector does not match any canvas in the document.');
	return;
    }

    this.canvas = this.canvas[0];
    this.redrawerCanvas = this.redrawerCanvas[0];
    this.ctx = this.canvas.getContext('2d');
    this.redrawerCtx = this.redrawerCanvas.getContext('2d');
};

function downloadCanvas(link, canvasId, filename) {
    var resizableLayer = $('#resizable-layer');
    var wwidth = parseInt(resizableLayer.css('width'));
    var hheight = parseInt(resizableLayer.css('height'));
    var newCanvas = $('#saveImage')
	    .attr('width', wwidth)
	    .attr('height', hheight);
    var newCtx = newCanvas[0].getContext('2d');
    newCtx.drawImage(
	    Canvas.canvas,
	    -parseInt(resizableLayer.css('left')),
	    -parseInt(resizableLayer.css('top'))
	    );
    link.href = newCanvas[0].toDataURL();
    link.download = filename;
}

$('#download').click(function () {
    if (ToolManager.selectedTool.hasOwnProperty('disable')) {
	ToolManager.selectedTool.disable();
    }
    downloadCanvas(this, 'canvas', 'obrazok.png');
    if (ToolManager.selectedTool.hasOwnProperty('enable')) {
	ToolManager.selectedTool.enable();
    }
});

$('#paper').click(function () {
    if (ToolManager.selectedTool.hasOwnProperty('disable')) {
	ToolManager.selectedTool.disable();
    }
    $(CONFIG.canvas_selector)[0].getContext('2d').clearRect(0, 0, CONFIG.width, CONFIG.height);
    $(CONFIG.redrawer_selector)[0].getContext('2d').clearRect(0, 0, CONFIG.width, CONFIG.height);

    if (ToolManager.selectedTool.hasOwnProperty('enable')) {
	ToolManager.selectedTool.enable();
    }
});

$('#back').click(function () {
    if (ToolManager.selectedTool.hasOwnProperty('disable')) {
	ToolManager.selectedTool.disable();
    }

    var ctx = $(CONFIG.canvas_selector)[0].getContext('2d');
    var backCtx = $('#backUp')[0].getContext('2d');
    ctx.clearRect(0, 0, CONFIG.width, CONFIG.height);
    ctx.drawImage(backCtx.canvas, 0, 0, CONFIG.width, CONFIG.height);
    if (ToolManager.selectedTool.hasOwnProperty('enable')) {
	ToolManager.selectedTool.enable();
    }
});

$(document).on('click', '.imageChoosed', function (e) {
    e.stopPropagation();
    if (ToolManager.selectedTool.hasOwnProperty('drawImage')) {
	ToolManager.selectedTool.drawImage($(this).attr('src'));
    }
});

$('[data-toggle="tooltip"]').tooltip({'placement': 'bottom'});

var prevPos = {left: 0, top: 0};
$("#resizable-layer").resizable({
    containment: ".canvas-layers",
    handles: "all",
    resize: function (event, ui) {
	if (ToolManager.selectedTool === ToolManager.tools.cutout) {
	    var cutoutUi = $('#cutout-ui');
	    cutoutUi.css({
		'left': (parseInt(cutoutUi.css('left')) - ui.position.left + prevPos.left) + 'px',
		'top': (parseInt(cutoutUi.css('top')) - ui.position.top + prevPos.top) + 'px',
	    });
	    prevPos.left = ui.position.left;
	    prevPos.top = ui.position.top;
	}
    }
});
