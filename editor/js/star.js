var Star = function(context, redrawerCtx) {
    var self = AbstractTool(context, redrawerCtx);
    
    self.name = 'Hviezda',
    self.width = 15,
    self.color = 'rgb(0,0,0)';
    self.fillColor = 'rgb(0,0,0)';

    var prevEvt = null;
    var params = {spikes: null, innerRadius: null};

    var drawStar = function(context, cx, cy, spikes, outerRadius, innerRadius) {
        var rot = Math.PI / 2 * 3;
        var x = cx;
        var y = cy;
        var step = Math.PI / spikes;

        context.beginPath();
        context.moveTo(cx, cy - outerRadius)
        for (i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            context.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            context.lineTo(x, y);
            rot += step;
        }
        context.lineTo(cx, cy - outerRadius);
        context.closePath();
        context.stroke();
        context.fill();

    };

    var paint = function(e, context) {
        var outerRadius =  Math.sqrt(Math.pow(prevEvt.calcX - e.calcX, 2) + Math.pow(prevEvt.calcY - e.calcY, 2));
        var innerRadius = outerRadius * params.innerRadius;
        drawStar(context || self.ctx, prevEvt.calcX, prevEvt.calcY, params.spikes, outerRadius, innerRadius);
    };

    var repaint = function(e) {
        self.clearCanvas();
        paint(e, self.reCtx)
    }

    self.sliderChanged = function(value) {
        self.width = value;
        self.ctx.lineWidth = self.width;
        self.reCtx.lineWidth = self.width;
    };

    self.lineColorChanged = function(color) {
        self.color = color;
        self.ctx.strokeStyle = self.color;
        self.reCtx.strokeStyle = self.addAlphaChannel(self.color, 0.5);
    };

    self.fillColorChanged = function(color) {
        self.fillColor = color;
        self.ctx.fillStyle = self.fillColor;
        self.reCtx.fillStyle = self.addAlphaChannel(self.fillColor, 0.5);
    };

    self.enable = function() {
        self.ctx.strokeStyle = self.color;
        self.reCtx.strokeStyle = self.addAlphaChannel(self.color, 0.5);
        self.ctx.lineWidth = self.width;
        self.reCtx.lineWidth = self.width;
        self.ctx.lineCap = "round";
        self.reCtx.lineCap = "round";
    };

    self.dragStart = function(e) {
        params.spikes = Math.floor(self.getRandomInRange(5,13));
        params.innerRadius = self.getRandomInRange(0.35, 0.65);
        prevEvt = e;
    };

    self.drag = function(e) {
        repaint(e);
    };

    self.dragEnd = function(e) {
        self.clearCanvas();
        paint(e);
    };

    return self;
};