# This script receives messages from a Kafka topic
from kafka import KafkaConsumer

consumer = KafkaConsumer(
    "testtopic_python",
    bootstrap_servers="localhost",
    client_id="testclient_python",
    group_id="test-group-python",
    #security_protocol="SSL",
    #ssl_cafile="ca.pem",
    #ssl_certfile="service.cert",
    #ssl_keyfile="service.key"
)

for msg in consumer:
    print("Received: {}".format(msg.value))
