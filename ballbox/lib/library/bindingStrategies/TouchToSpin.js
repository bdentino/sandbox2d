module.exports = TouchToSpin;

function TouchToSpin(body, device) {
	this.body = body;
	this.device = device;
	this.transform = {
		'touchStart' : this.startSpin,
		'touchEnd'   : this.stopSpin
	};

	if (!TouchToSpin.deviceState[this.device])
		TouchToSpin.deviceState[this.device] = {
			touching: false
		};

	if (TouchToSpin.deviceState[this.device].touching) {
		this.startSpin();
	}
}

TouchToSpin.prototype.startSpin = function(eventData) {
	this.body.b2Body.m_angularDamping = 0;
	this.body.b2Body.ApplyTorque(0.01);
	TouchToSpin.deviceState[this.device].touching = true;
};

TouchToSpin.prototype.stopSpin = function(eventData) {
	this.body.b2Body.m_angularDamping = 0.5;
	this.body.b2Body.ApplyTorque(-0.01);
	TouchToSpin.deviceState[this.device].touching = false;
};

TouchToSpin.deviceState = {}