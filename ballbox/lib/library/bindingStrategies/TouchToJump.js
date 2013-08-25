var b2Vec2 = Box2D.Common.Math.b2Vec2;

module.exports = TouchToJump;

function TouchToJump(body, device) {
	this.body = body;
	this.device = device;
	this.transform = {
		'touchEnd'   : this.jump
	};
}

TouchToJump.prototype.jump = function(eventData) {
	this.body.b2Body.m_linearDamping = 1.5;
	this.body.b2Body.ApplyImpulse(new b2Vec2(0,-1), this.body.b2Body.GetWorldCenter());
};
