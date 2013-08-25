var express = require('express');
var app = express();

var Polyglot = require('node-polyglot');
var translator = new Polyglot();
console.log(Polyglot);
console.log(translator);

app.set('title', 'SandBox2d');

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
		res.send('this is not the sandbox you\'re looking for...');
		return;
	}

	var body = translator.t('greeting', { _: 'Hello %{uid}.', uid: req.params.id });
	res.setHeader('Content-Type', 'text/plain');
	res.setHeader('Content-Length', body.length);
	res.end(body);
});

app.listen(5050);
console.log('listening on port 5050');


/* Sandbox API */
var uid = require('uid');
var sandboxes = {};

function createSandbox() {
	var sandboxId = uid();
	while (sandboxExists(sandboxId)) { sandboxId = uid(); }
	sandboxes[sandboxId] = {};
	return sandboxId;
}

function sandboxExists(id) {
	console.log(sandboxes);
	return sandboxes[id] !== undefined;
}

function getSandbox(id) {
	if (!sandboxExists(id)) return;
	return sandboxes[id];
}