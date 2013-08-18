var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

module.exports = Renderer;

function Renderer(canvas, scale) {
	if (!(this instanceof Renderer)) return new Renderer(canvas, scale);
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.scale = scale || 80;

	this.debugRenderer = new b2DebugDraw();
	this.debugRenderer.SetSprite(this.context);
	this.debugRenderer.SetDrawScale(this.scale);
	this.debugRenderer.SetFillAlpha(0.3);
	this.debugRenderer.SetLineThickness(1.0);
	this.debugRenderer.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
};

Renderer.prototype.render = function(world) {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	var bodies = world.GetBodyList();

	this.context.save();
	this.context.scale(this.scale, this.scale);
	while (bodies) {
		var body = bodies.GetUserData();
		if (body) {
			body.draw(this.context);
		}

		body = body.GetNext();
	}
	this.context.restore();
}

Renderer.prototype.renderDebug = function(world) {
	world.SetDebugDraw(this.debugRenderer);
	world.DrawDebugData();
}