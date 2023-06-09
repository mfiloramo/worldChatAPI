// MODULE IMPORTS
import express from 'express';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import WebSocket from 'ws';

// ROUTE IMPORTS
import { translationRouter } from './routes/translationRouter';
import { usersRouter } from './routes/usersRouter';
import { participantsRouter } from './routes/participantsRouter';
import { messagesRouter } from './routes/messagesRouter';
import { conversationsRouter } from './routes/conversationsRouter';
import { validateAccessToken } from './middleware/validateAccessToken';

// GLOBAL VARIABLES
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;

// CORS OPTIONS
const corsOptions: CorsOptions = {
  origin: ['http://localhost:4200', 'https://orange-tree-0d3c88e0f.3.azurestaticapps.net'],
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type',  'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
};

// MIDDLEWARE CONFIGURATION
app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors(corsOptions));

// SERVER ROUTES -- ENABLE validateAccessToken MIDDLEWARE FOR ALL ROUTES
app
  .use('/api/translate', translationRouter)
  .use('/api/users', usersRouter)
  .use('/api/participants', participantsRouter)
  .use('/api/messages', messagesRouter)
  .use('/api/conversations', conversationsRouter);

// HANDLE PREFLIGHT REQUESTS
app.options('*', cors(corsOptions));

// WILDCARD ENDPOINT
app.use('*', (req, res) => {
  res.status(404).send('Resource not found');
});

// WEBSOCKET SERVER
wss.on('connection', (ws: WebSocket) => {
  // INDICATE CLIENT CONNECTION
  console.log('Client connected...');

  // BROADCAST WEBSOCKET DATA TO CLIENTS
  ws.on('message', (message: WebSocket.Data) => {
    wss.clients.forEach((client: WebSocket.WebSocket): void => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    // INDICATE CLIENT DISCONNECTION
    console.log('Client disconnected...');
  });
});

// RUN EXPRESS SERVER
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}...`);
});