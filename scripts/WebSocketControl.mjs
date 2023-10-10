import { server as WebSocketServer } from 'websocket';
import * as http from 'http';
//const fs = require('fs');
export class WebSocketControl {
    /*options = {
        key: '',
        cert: ''
    };*/
    server;
    wsServer;
    clock = {
        absoluteTime: "00:00:00",
        playing: false,
        description: ""
    }

    clockControlConnections = [];

    constructor(config) {

        let localThis = this;

        //this.options.key = fs.readFileSync(config.control.key);
        //this.options.cert = fs.readFileSync(config.control.cert);

        this.server = http.createServer(this.options, function (request, response) {
            console.log((new Date()) + ' Received request for ' + request.url);
            response.writeHead(404);
            response.end();
        });
        this.server.listen(config.websocket.port, "0.0.0.0", function () {
            console.log((new Date()) + ' Server is listening on port ' + config.websocket.port);
        });

        this.wsServer = new WebSocketServer({
            httpServer: this.server,
            autoAcceptConnections: false
        });

        this.wsServer.on('request', function (request) {
            if (!localThis.originIsAllowed(request.origin)) {
                // Make sure we only accept requests from an allowed origin
                request.reject();
                console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
                return;
            }

            if (request.requestedProtocols.length < 1) {
                console.log((new Date()) + ' Unspecified protocol for ' + request.remoteAddress);
                return;
            }
            switch (request.requestedProtocols[0]) {
                case 'clock-control':
                    localThis.handleClockControlRequest(request);
                    break;
            }

        });
    }

    originIsAllowed(origin) {
        //if (origin != 'http://127.0.0.1') return false;
        return true;
    }

    handleClockControlRequest(request) {

        let localThis = this;

        let connection = request.accept(request.requestedProtocols[0], request.origin);
        console.log((new Date()) + ' Connection accepted.');
        this.clockControlConnections.push(connection);
        connection.sendUTF(JSON.stringify(localThis.clock));

        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);
                try {
                    let value = JSON.parse(message.utf8Data);
                    if (value.hasOwnProperty('absoluteTime')) {
                        localThis.clock.absoluteTime = value.absoluteTime;
                    }
                    if (value.hasOwnProperty('playing'))
                        localThis.clock.playing = value.playing;

                    if (value.hasOwnProperty('description'))
                        localThis.clock.description = value.description;

                    localThis.sendToClockControl(JSON.stringify(localThis.clock));
                }
                catch (e) { console.log(e) }
            }
        });
        connection.on('close', function (reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            let newConnections = localThis.clockControlConnections.filter(function (value) {
                return connection != value;
            });
            if (newConnections)
                localThis.clockControlConnections = newConnections;
        });
    }

    sendToClockControl(content) {
        this.clockControlConnections.forEach(connection => {
            connection.sendUTF(content);
        })
    }

}