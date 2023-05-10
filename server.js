const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const amqp = require('amqplib');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const queue = 'mensagem';

app.use((req, res, next) => {
  res.locals.mensagem = '';
  next();
});

app.get('/', (req, res) => {
  res.render('front');
});

app.post('/', async (req, res) => {
  const mensagem = req.body.mensagem;

  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queue);

    channel.sendToQueue(queue, Buffer.from(mensagem));

    console.log(`Mensagem enviada: ${mensagem}`);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error(error);
  }

  res.locals.mensagem = 'Mensagem enviada: ' + mensagem;
  res.render('front');
});

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000.');
});
