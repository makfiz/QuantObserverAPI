const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const tgbot = require('./tgBot');
const { WSClients } = require('./config');

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

wss.on('connection', function connection(ws) {
  let wsName
  ws.on('message', function incoming(message) {
    const msg = message.toString()
    console.log('received from client:', msg);
    if (msg.includes('wsName:')) {
      const parts = msg.split(':');
       wsName = parts[1].trim();
      WSClients[wsName] = ws
    }

    if (msg == "Ping") {
      ws.send('Pong');
    }
 
    
  });
  ws.send('Hello from WebSocket server!');
  ws.on('close', function() {
    console.log(`WebSocket connection with ${wsName} closed`);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            

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
