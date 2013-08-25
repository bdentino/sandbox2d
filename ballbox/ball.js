var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

module.exports = Ball;

function Ball(properties) {
	if (!(this instanceof Ball)) return new Ball(properties);
	this.properties = properties || {};
	for (var property in this.propertyDefaults) {
		this.properties[property] = this.properties[property] || this.propertyDefaults[property]
	}

	this.bodyDefinition = new b2BodyDef();

	for (var property in this.bodyDefaults) {
		this.bodyDefinition[property] = this.properties[property] || this.bodyDefaults[property]
	}
	this.bodyDefinition.userData = this;
	this.bodyDefinition.type = b2Body.b2_dynamicBody;

	this.fixtureDefinition = new b2FixtureDef();
	for (var property in this.fixtureDefaults) {
		this.fixtureDefinition[property] = 
			this.properties[property] || this.fixtureDefaults[property];
	}

	this.fixtureDefinition.shape = new b2CircleShape(this.properties.radius);
}

Ball.prototype.addToWorld = function(world, position, velocity) {
	position = position || { x: 0, y: 0 }
	velocity = velocity || { x: 0, y: 0 }
	this.bodyDefinition.position = new b2Vec2(position.x, position.y);
	this.bodyDefinition.linearVelocity = new b2Vec2(velocity.x, velocity.y);
	this.b2Body = world.CreateBody(this.bodyDefinition);
	this.b2Body.CreateFixture(this.fixtureDefinition);
}

Ball.prototype.propertyDefaults = {
	radius: 0.2
};

Ball.prototype.fixtureDefaults = {
	density: 2,
	friction: 1,
	restitution: 0.1
};

Ball.prototype.bodyDefaults = {
	active: true,
	allowSleep: true,
	angle: 0,
	angularVelocity: 0,
	awake: true,
	bullet: false,
	fixedRotation: false,
}