# This script connects to Kafka and send a few messages

from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers="localhost",
    #security_protocol="SSL",
    #ssl_cafile="ca.pem",
    #ssl_certfile="service.cert",
    #ssl_keyfile="service.key",
)

for i in range(1, 4):
    message = "message number {}".format(i)
    print("Sending: {}".format(message))
    producer.send("testtopic_python", message.encode("utf-8"))

# Wait for all messages to be sent
producer.flush()
