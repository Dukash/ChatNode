const amqp = require('amqplib');

const queue = 'mensagem';

async function receiveMessage() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue(queue);

  console.log('Aguardando mensagens...');

  channel.consume(queue, (msg) => {
    console.log(`Mensagem recebida: ${msg.content.toString()}`);
  }, { noAck: true });
}

receiveMessage();
