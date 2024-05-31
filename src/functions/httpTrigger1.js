const { app } = require('@azure/functions');

var azure_iot_device_ampq = require('azure-iot-device-amqp');
var Message = require('azure-iot-device').Message;

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'world';
        client.open(connectCallback);
        return { body: `Hello, ${name}!` };
    }
});

//The IOT hub connection string
var connStr = '[IoT Hub Device Connection string]';

var client = azure_iot_device_ampq.clientFromConnectionString(connStr);
 
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}
 
var i = 0;
 
var connectCallback = function (err) {
  if (err) {
    console.log('Could not connect to IoT Hub: ' + err);
  } else {
    console.log('Client connected to IoT Hub');
 
    client.on('message', function (msg) {
      client.complete(msg, printResultFor('completed'));
 
      if ( msg.data[0] == 42) {
        console.log("\x1b[33m",'Command = ' + msg.data);
        console.log("\x1b[0m", '------------------');
      } else {
        console.log("\x1b[31m",'Command = ' + msg.data);
        console.log("\x1b[0m", '------------------');
      }
    });
 
    // Create a message and send it to the IoT Hub every second
    setInterval(function(){
      i++;
 
      var data = JSON.stringify({ numberOfCycles: i });
      var message = new Message(data);
 
      console.log("Telemetry sent: " + message.getData());
      client.sendEvent(message, printResultFor('send'));
    }, 2000);
  }
};
 
console.log("\x1b[31m",'NodeJs IoTHub DEMO');
console.log("\x1b[0m", '==================');
 
