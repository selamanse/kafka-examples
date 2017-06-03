var Kafka = require('node-rdkafka');

var producer = new Kafka.Producer({
    'metadata.broker.list': '127.0.0.1:2181',
    //'security.protocol': 'ssl',
    //'ssl.key.location': 'service.key',
    //'ssl.certificate.location': 'service.cert',
    //'ssl.ca.location': 'ca.pem',
    'dr_cb': true  //delivery report callback
});

var topicName = 'testtopic';

//logging debug messages, if debug is enabled
producer.on('event.log', function(log) {
  console.log(log);
});

//logging all errors
producer.on('error', function(err) {
  console.error('Error from producer');
  console.error(err);
});

//counter to stop this sample after maxMessages are sent
var counter = 0;
var maxMessages = 10;

producer.on('delivery-report', function(report) {
  console.log('delivery-report: ' + JSON.stringify(report));
  counter++;
});

//Wait for the ready event before producing
producer.on('ready', function(arg) {
  console.log('producer ready.' + JSON.stringify(arg));

  //Create a Topic object with any options our Producer
  //should use when producing to that topic.
  var topic = producer.Topic(topicName, {
   // Make the Kafka broker acknowledge our message (optional)
   'request.required.acks': 1
  });

  for (var i = 0; i < maxMessages; i++) {
    var value = new Buffer('value-' +i);
    var key = "key-"+i;
    // if partition is set to -1, librdkafka will use the default partitioner
    var partition = -1;
    producer.produce(topic, partition, value, key);
  }

  //need to keep polling for a while to ensure the delivery reports are received
  var pollLoop = setInterval(function() {
      producer.poll();
      if (counter === maxMessages) {
        clearInterval(pollLoop);
        producer.disconnect();
      }
    }, 1000);

});

producer.on('disconnected', function(arg) {
  console.log('producer disconnected. ' + JSON.stringify(arg));
});

//starting the producer
producer.connect();
