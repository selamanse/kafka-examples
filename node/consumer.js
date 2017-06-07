var Kafka = require('node-rdkafka');
var Transform = require('stream').Transform;

var consumer = new Kafka.KafkaConsumer({
    'metadata.broker.list': 'localhost',
    //'security.protocol': 'ssl',
    //'ssl.key.location': 'service.key',
    //'ssl.certificate.location': 'service.cert',
    //'ssl.ca.location': 'ca.pem',
    'group.id': 'testgroup',
    'enable.auto.commit': false
}, {
  'auto.offset.reset': 'earliest' //https://cwiki.apache.org/confluence/display/KAFKA/FAQ#FAQ-Whydoesmyconsumernevergetanydata?
});


consumer.on('ready', function() {
    console.log("ready")
    // Subscribe to the librdtesting-01 topic
    // This makes subsequent consumes read from that topic.
    consumer.subscribe(['testtopic']);

    consumer.consume();
  })
  .on('data', function(data) {
    console.log('Message found!  Contents below.');
    console.log(data.value.toString());
  });

consumer.on('error', function(err) {
  console.log(err);
});

console.log("connect")
consumer.connect();

//stopping this example after 30s
setTimeout(function() {
  consumer.disconnect();
}, 30000);
