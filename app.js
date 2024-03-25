const express = require('express');
const http = require('http');
const WebSocket = require('ws');
// const logger = require('morgan');
const cors = require('cors');
const tgbot = require('./tgBot');
const { WSClients } = require('./config');
// const tokenRouter = require('./routes/API/token');

const app = express();
tgbot.launch();
tgbot.catch((err, ctx) => {
  console.log('Telegraf bot catch err:');
  console.log('err', err);
  console.log('ctx', ctx);
});
const server = http.createServer(app);
const wss = new WebSocket.Server({ server ,path: '/ws'});


app.use(cors());
app.use(express.json());

app.get('/nodes/snapshot/:node', (req, res) => {
  const nodeName = req.params.node;

  // Проверяем, есть ли уже объект с указанным nodeName в массиве WSClients
  const keys = Object.keys(WSClients);

  // Проверяем, есть ли ключ с указанным nodeName
  if (keys.includes(nodeName)) {
    // Если найдено совпадение, возвращаем статус 200
    console.log(`Client with nodeName ${nodeName} found`);
    const wsObject = WSClients[nodeName];
    console.log(wsObject);
    wsObject.send('Hello loh!')
    return res.status(200).end();
  }

  // Если объект с указанным nodeName не найден, отправляем статус 404
  res.status(404).end()
});

// app.use('/get/token', tokenRouter);



// Перенаправляем все WebSocket-запросы на соответствующий обработчик

wss.on('connection', function connection(ws) {
  let wsName
  console.log('WebSocket connection established');
  
  // Добавляем соединение в массив клиентов
 
  // console.log('clients',WSClients);

  // Обработчик для входящих сообщений от клиента
  ws.on('message', function incoming(message) {
    const msg = message.toString()
    console.log('received from client:', msg);
    if (msg.includes('wsName:')) {
      const parts = msg.split(':');
       wsName = parts[1].trim();
      WSClients[wsName] = ws
      // console.log(WSClients);
    }
 
    
  });

  // Отправка сообщения клиенту
  ws.send('Hello from WebSocket server!');
  
  // Обработчик отключения клиента
  ws.on('close', function() {
    console.log('WebSocket connection closed');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    // Удаляем отключенное соединение из массива клиентов
    delete WSClients[wsName]
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
  });
});

server.listen(8080, () => {
  console.log(`Server running. Use our API on PORT: 8080`);
});


module.exports = {
  WSClients
};
