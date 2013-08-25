var IO = require('io');
var Binding = require('./binding');

module.exports = Device;

function Device(room,id) {
	if (!(this instanceof Device)) return new Device(id);
	this.socket = IO('http://ws.mat.io:80/'+room+'/').channel(id);

	window.addEventListener('deviceorientation', this.onRotation.bind(this));
	window.addEventListener('touchstart', this.onTouchStart.bind(this));
	window.addEventListener('touchend', this.onTouchEnd.bind(this));
	window.addEventListener('devicemotion', this.onMotion.bind(this));
};

//Local Device//

Device.prototype.onRotation = function(rotationEvent) {
	this.socket.emit('rotation', { 
		"alpha" : rotationEvent.alpha,
		"beta"	: rotationEvent.beta,
		"gamma" : rotationEvent.gamma
	});
};

Device.prototype.onTouchStart = function(touchEvent) {
	this.socket.emit('touchStart', {});
};

Device.prototype.onTouchEnd = function(touchEvent) {
	this.socket.emit('touchEnd', {
		"touches" : touchEvent.touches
	});
};

Device.prototype.onMotion = function(motionEvent) {
	this.socket.emit('motion', {
		"acceleration" : motionEvent.acceleration,
		"accelerationIncludingGravity" : motionEvent.accelerationIncludingGravity,
		"rotationRate" : motionEvent.rotationRate,
		"interval" : motionEvent.interval
	});
};

//Remote Device//

Device.prototype.on = function(eventType, callback) {
	this.socket.on(eventType, callback);
};