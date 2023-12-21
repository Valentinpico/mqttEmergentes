const mqtt = require("mqtt");

// Datos del servidor MQTT
const mqtt_server = "broker.emqx.io";
const mqtt_port = 1883;
const mqtt_topic_sub = "movimiento/01";

// Conexión al servidor MQTT
const client = mqtt.connect(`mqtt://${mqtt_server}:${mqtt_port}`);

// Evento cuando la conexión es exitosa
client.on("connect", () => {
  console.log("Conexión exitosa al servidor MQTT");
  // Suscribirse al tema
  client.subscribe(mqtt_topic_sub, (err) => {
    if (!err) {
      console.log(`Suscrito al tema: ${mqtt_topic_sub}`);
    }
  });
});

// Evento cuando se recibe un mensaje en el tema suscrito
client.on("message", async (topic, message) => {
    console.log("Mensaje recibido desde el servidor MQTT");   
  if (topic === mqtt_topic_sub) {
    
    const data = await JSON.parse(message.toString());
     sendDataToAPI(data);
  }
});

// Manejar errores de conexión
client.on("error", (error) => {
  console.error(`Error de conexión al servidor MQTT: ${error}`);
});

function sendDataToAPI(data) {
  console.log(data);
  fetch("http://localhost:3001/clima", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));
}
