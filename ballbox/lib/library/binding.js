module.exports = Binding

function Binding(strategies) {
	this.strategies = strategies || [];
}

Binding.prototype.addStrategy = function(bindingStrategy) {
	this.strategies.push(bindingStrategy);
};

Binding.prototype.removeStrategy = function(bindingStrategy) {
	var index = this.strategies.indexOf(bindingStrategy);
	if (index >= 0)
		this.strategies[eventType].splice(index, 1);
};

Binding.prototype.bindBodyToDevice = function(body, device) {
	this.strategies.forEach( function(strategy) {
		var instance = new strategy(body, device);
		for (var eventType in instance.transform) {
			device.on(eventType, instance.transform[eventType].bind(instance));
		}
	});
};