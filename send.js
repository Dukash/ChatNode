const amqp = require('amqplib');

const queue = 'mensagem';

async function sendMessage(msg) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue(queue);

  channel.sendToQueue(queue, Buffer.from(msg));

  console.log(`Mensagem enviada: ${msg}`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendMessage(process.argv[2]);
