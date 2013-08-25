var b2Vec2 = Box2D.Common.Math.b2Vec2;

module.exports = MotionToImpulseBasic

/*
	Assumes phone is held in static position
	x:>, y:o, z:^

	maps up, down
*/

var maxMemory = 5;

function MotionToImpulseBasic(body, device) {
	this.body = body;
	this.device = device;
	this.transform = {
		'motion' : this.moveBody
	};

	this.upDown = 0;
	this.leftRight = 0;
	this.memory = [];
};

MotionToImpulseBasic.prototype.moveBody = function(eventData) {
	var accel = eventData.acceleration;
	var b2Body = this.body.b2Body;
	var energy = quadSum(accel.z, accel.x);
	this.body.debugData = '';

	if (energy < 5) {
		// phone is not moving...make the body slow down and stop controlling
		b2Body.m_linearDamping = 1.5;
		b2Body.m_angularDamping = 1.5;
		if (this.upDown != 0)
			this.upDown = (Math.abs(this.upDown) - 1) * (Math.abs(this.upDown) / this.upDown);
		if (this.leftRight != 0)
			this.leftRight = (Math.abs(this.leftRight) - 1) * (Math.abs(this.leftRight) / this.leftRight);
		return;
	}

	if (accel.z > 0) { this.upDown = this.upDown + 1; }
	if (accel.z < 0) { this.upDown = this.upDown - 1; }

	if (accel.z > 0 && this.upDown < 0) return; //filter out noise
	if (accel.z < 0 && this.upDown > 0) return; //filter out noise

	if (accel.x > 0) { this.leftRight = this.leftRight + 1; }
	if (accel.x < 0) { this.leftRight = this.leftRight - 1; }

	if (accel.x > 0 && this.leftRight < 0) return; //filter out noise
	if (accel.x < 0 && this.leftRight > 0) return; //filter out noise

	var impulse = new b2Vec2(accel.x / -.1, accel.z / .1);
	impulse.x = impulse.x;
	impulse.y = impulse.y;

	if (impulse.x > 0) this.body.debugData = 'moving right: ' + ((impulse.x * 10) | 0);
	if (impulse.x < 0) this.body.debugData = 'moving left:   ' + ((impulse.x * 10) | 0);

	b2Body.ApplyForce(impulse, b2Body.GetWorldCenter());
}

var quadSum = function() {
	var sum = 0;
	for (var i = 0; i < arguments.length; i++) {
    	sum += (arguments[i] * arguments[i]);
  	}
	return Math.sqrt(sum);
}