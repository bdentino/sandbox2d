var express = require('express');
var app = express();
app.engine('html', require('jade').__express);
app.engine('jade', require('jade').__express);
var device = require('express-device');

var Polyglot = require('node-polyglot');
var translator = new Polyglot();

app.set('title', 'SandBox2d');
app.set('view engine', 'jade');
app.set('views', __dirname + '/ballbox');

app.use(device.capture());
app.use("/sandbox/box2d", express.static(__dirname + '/ballbox/box2d'));
app.use("/sandbox/build", express.static(__dirname + '/ballbox/build'));

app.get('/', function(req, res) {
	res.redirect('/sandbox');
});

app.get('/sandbox', function(req, res) {
	var sandboxId = createSandbox();
	res.redirect('/sandbox/' + sandboxId);
});

app.get('/sandbox/:id', function(req, res) {
	if (!sandboxExists(req.params.id)) {
		res.status(404);
		res.send( translator.t('sandboxNotFound', {
            _ : 'This is not the sandbox you are looking for...'   
		}));
		return;
	}
    var body;
    if (req.device.type === 'desktop' || req.device.type === 'tv') {
        res.render('index', { 'sandboxId' : req.params.id });
        return;
    }
    else if (req.device.type === 'phone' || req.device.type === 'tablet') {
        var deviceId = getNextDeviceIdForSandbox(req.params.id);
        console.log('connecting device ' + deviceId);
        res.render('device', { 'deviceId' : deviceId, 'sandboxId' : req.params.id });
        return;
    }
    else {
        body = translator.t('deviceNotSupported', { 
            _ : 'Sorry, but sandbox2d does not yet support the type of device from which you are trying to connect.' 
        });
    }
	res.setHeader('Content-Type', 'text/plain');
	res.setHeader('Content-Length', body.length);
	res.end(body);
});

app.listen(5050);

/* Sandbox API */
var uid = require('uid');
var sandboxes = {};

function createSandbox() {
	var sandboxId = uid(3);
	while (sandboxExists(sandboxId)) { sandboxId = uid(3); }
	sandboxes[sandboxId] = { deviceCount : 0 };
	return sandboxId;
}

function sandboxExists(id) {
	return sandboxes[id] !== undefined;
}

function getSandbox(id) {
	if (!sandboxExists(id)) return;
	return sandboxes[id];
}

function getNextDeviceIdForSandbox(id) {
    if (!sandboxExists(id)) return;
    getSandbox(id).deviceCount++;
    return getSandbox(id).deviceCount;
}