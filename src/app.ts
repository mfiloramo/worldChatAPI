// MODULE IMPORTS
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import WebSocket from 'ws';

// ROUTE IMPORTS
import { translationRouter } from "./routes/translationRouter";
import { usersRouter } from "./routes/usersRouter";
import { participantsRouter } from "./routes/participantsRouter";
import { messagesRouter } from "./routes/messagesRouter";
import { conversationsRouter } from "./routes/conversationsRouter";
import { validateAccessToken } from './middleware/validateAccessToken';

// GLOBAL VARIABLES
const app = express();
const wss = new WebSocket.Server({ port: 8080 });
const PORT = 3000;

// CORS OPTIONS
const corsOptions: object = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200,
  credentials: true
};

// APPLICATION DEPENDENCIES
app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors(corsOptions))

// ROUTE PROTECTION (MSAL)
app.use(validateAccessToken);

// APPLICATION ENDPOINTS
app.use('/api/translate', translationRouter);
app.use('/api/users', usersRouter);
app.use('/api/participants', participantsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/conversations', conversationsRouter);

// WEBSOCKET SERVER
wss.on('connection', (ws) => {
  // INDICATE CLIENT CONNECTION
  console.log('Client connected...');

  // BROADCAST WEBSOCKET DATA TO CLIENTS
  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // INDICATE CLIENT DISCONNECTION
  ws.on('close', () => {
    console.log('Client disconnected...');
  });
});

// RUN EXPRESS SERVER
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}...`);
});