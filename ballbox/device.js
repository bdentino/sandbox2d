function init() {
    if (sandboxId === undefined || deviceId === undefined) {
        return;
    }

    alert('sandbox ' + sandboxId);
    alert('device ' + deviceId);
    var broadcastChannel = IO('http://ws.mat.io:80/' + sandboxId + "/");
    alert(broadcastChannel);
    var privateChannel = broadcastChannel.channel(deviceId);
    
    broadcastChannel.emit( 'deviceConnect', { 'id' : deviceId } );
    
}

window.addEventListener('load', init);