var Ball = require('./ball');
var Library = require('library');

var RemoteDevice   = Library.Device;
var Binding 	   = Library.Binding;
var TouchToSpin    = Library.TouchToSpin;
var MotionStrategy = Library.MotionToImpulseBasic;
var TouchToJump    = Library.TouchToJump;

var SandBox		   = Library.Sandbox;

var lastFrame = new Date().getTime();

var sandbox;
var device;
var ball;
var basicBinding = new Binding();
basicBinding.addStrategy(TouchToJump);
basicBinding.addStrategy(MotionStrategy);

window.gameLoop = function() {
	var time = new Date().getTime();
	requestAnimationFrame(gameLoop);
	var dTime = (time - lastFrame) / 1000;
	if (dTime > 1/15) { dTime = 1/15; }
	sandbox.stepSimulation(dTime);
	lastFrame = time;
};

function init() {

	var qr = require('qr-code');
	var dataURI = qr('http://www.google.com');
	var img = new Image();
	img.src = dataURI;
	document.body.appendChild(img);

	var canvas = document.getElementById('sandbox');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	sandbox = new SandBox(canvas, 100, {x: 0, y: 0});
	sandbox.debug(true);
	sandbox.onDebugStep = debugStep;

	device = new RemoteDevice('ballBox','ballController');
	ball = new Ball();

	sandbox.addBody(ball);
	basicBinding.bindBodyToDevice(ball, device);

	requestAnimationFrame(gameLoop);
}

function debugStep() {
	//if (ball.debugData && ball.debugData !== '') console.log(ball.debugData);
	//console.log(ball.b2Body.GetLinearVelocity().y);
};

window.addEventListener("load", init);


//RequestAnimationFrame (if not already attached to window)

var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	window.cancelAnimationFrame = 
	window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = function(callback, element) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
			timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};
}

if (!window.cancelAnimationFrame) {
	window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};
}