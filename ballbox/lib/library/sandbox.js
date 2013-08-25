
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2World = Box2D.Dynamics.b2World;

var Renderer 	= require('./renderer');

module.exports = Sandbox

function Sandbox(canvas, pixelsPerMeter, gravity) {
	this.renderer = new Renderer(canvas, pixelsPerMeter);

	gravity = new b2Vec2(gravity.x, gravity.y);
	this.world = new b2World(gravity, true);
	this.dTimeRemaining = 0;
	this.stepAmount = 1/60;
	this.debugMode = false;

	this.width = canvas.width / pixelsPerMeter;
	this.height = canvas.height / pixelsPerMeter;

	this.buildWalls(canvas.width, canvas.height, pixelsPerMeter);
}

Sandbox.prototype.stepSimulation = function(dTime) {
	this.dTimeRemaining += dTime;
	while (this.dTimeRemaining > this.stepAmount) {
		this.dTimeRemaining -= this.stepAmount;
		this.world.Step(this.stepAmount, 8, 3);
		this.world.ClearForces();
	}
	if (this.debugMode) {
		this.renderer.renderDebug(this.world);
		if (this.onDebugStep) {
			this.onDebugStep();
		}
	}
	else {
		this.renderer.render(this.world);
	}
};

Sandbox.prototype.debug = function(debug) {
	this.debugMode = debug;
};

Sandbox.prototype.addBody = function(body) {
	var position = {};
	position.x = this.width / 2;
	position.y = this.height / 2;
	var velocity = { x: 0, y: 0 }
	body.addToWorld(this.world, position, velocity);
}

Sandbox.prototype.buildWalls = function() {
	var leftWallDef = new b2BodyDef();
	leftWallDef.position = new b2Vec2(0,this.height / 2);
	leftWallDef.type = b2Body.b2_staticBody;
	var leftWall = this.world.CreateBody(leftWallDef);
	
	var rightWallDef = new b2BodyDef();
	rightWallDef.position = new b2Vec2(this.width, this.height / 2);
	rightWallDef.type = b2Body.b2_staticBody;
	var rightWall = this.world.CreateBody(rightWallDef);

	var verticalWallDef = new b2FixtureDef();
	verticalWallDef.shape = new b2PolygonShape();
	verticalWallDef.shape.SetAsBox(0.25, this.height / 2);
	leftWall.CreateFixture(verticalWallDef);
	rightWall.CreateFixture(verticalWallDef);


	var topWallDef = new b2BodyDef();
	topWallDef.position = new b2Vec2(this.width / 2,0);
	topWallDef.type = b2Body.b2_staticBody;
	var topWall = this.world.CreateBody(topWallDef);

	var bottomWallDef = new b2BodyDef();
	bottomWallDef.position = new b2Vec2(this.width / 2, this.height);
	bottomWallDef.type = b2Body.b2_staticBody;
	var bottomWall = this.world.CreateBody(bottomWallDef);

	var horizontalWallDef = new b2FixtureDef();
	horizontalWallDef.shape = new b2PolygonShape();
	horizontalWallDef.shape.SetAsBox(this.width / 2, 0.25);
	topWall.CreateFixture(horizontalWallDef);
	bottomWall.CreateFixture(horizontalWallDef);
}