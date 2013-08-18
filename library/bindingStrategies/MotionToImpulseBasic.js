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
	var energy = quadSum(accel.z);
	this.body.debugData = '';

	// if (Math.abs(accel.z) > 2) {
	// 	console.log('energy = ' + (energy | 0) + 
	// 		';  accel.z = ' + (accel.z | 0) + 
	// 		';  upDown = ' + this.upDown);
	// }
	if (energy < 5) {
		// phone is not moving...make the body slow down and stop controlling
		b2Body.m_linearDamping = 1.5;
		if (this.upDown != 0)
			this.upDown = (Math.abs(this.upDown) - 1) * (Math.abs(this.upDown) / this.upDown);
		return;
	}

	if (accel.z > 0) { this.upDown = Math.min(this.upDown + 1, maxMemory); }
	if (accel.z < 0) { this.upDown = Math.max(this.upDown - 1, -maxMemory); }

	if (accel.z > 0 && this.upDown < 0) return; //filter out noise
	if (accel.z < 0 && this.upDown > 0) return; //filter out noise

	var impulse = new b2Vec2(accel.x / 10.0, accel.z / 10.0);
	impulse.x = 0;
	impulse.y = impulse.y;

	if (impulse.y > 0) this.body.debugData = 'moving down: ' + ((impulse.y * 10) | 0);
	if (impulse.y < 0) this.body.debugData = 'moving up:   ' + ((impulse.y * 10) | 0);

	b2Body.ApplyImpulse(impulse, b2Body.GetWorldCenter());
}

var quadSum = function() {
	var sum = 0;
	for (var i = 0; i < arguments.length; i++) {
    	sum += (arguments[i] * arguments[i]);
  	}
	return Math.sqrt(sum);
}