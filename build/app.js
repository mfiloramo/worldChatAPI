"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// MODULE IMPORTS
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = __importDefault(require("ws"));
// ROUTE IMPORTS
const translationRouter_1 = require("./routes/translationRouter");
const usersRouter_1 = require("./routes/usersRouter");
const participantsRouter_1 = require("./routes/participantsRouter");
const messagesRouter_1 = require("./routes/messagesRouter");
const conversationsRouter_1 = require("./routes/conversationsRouter");
// GLOBAL VARIABLES
const app = (0, express_1.default)();
const wss = new ws_1.default.Server({ port: 8080 });
const PORT = process.env.PORT || 3000;
// CORS OPTIONS
const corsOptions = {
    origin: ['http://localhost:4200', 'https://orange-tree-0d3c88e0f.3.azurestaticapps.net'],
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
};
// APPLICATION DEPENDENCIES
app
    .use(express_1.default.json())
    .use(express_1.default.urlencoded({ extended: false }))
    .use(body_parser_1.default.urlencoded({ extended: true }))
    .use((0, cors_1.default)(corsOptions));
// TODO: ADD validateAccessToken MIDDLEWARE FOR EACH ROUTE
// ROUTES
app.use('/api/translate', translationRouter_1.translationRouter);
app.use('/api/users', usersRouter_1.usersRouter);
app.use('/api/participants', participantsRouter_1.participantsRouter);
app.use('/api/messages', messagesRouter_1.messagesRouter);
app.use('/api/conversations', conversationsRouter_1.conversationsRouter);
// HANDLE PREFLIGHT REQUESTS
app.options('*', (0, cors_1.default)(corsOptions));
// WILDCARD ENDPOINT
app.use('*', (req, res) => {
    res.status(404).send('Resource not found');
});
// WEBSOCKET SERVER
wss.on('connection', (ws) => {
    // SET CORS HEADERS
    // const headers: any = {
    //   "Access-Control-Allow-Origin": process.env.CLIENT_URI,
    //   "Access-Control-Allow-Credentials": true,
    //   "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    // };
    // Object.keys(headers).forEach((key) => {
    //   ws.set(key, headers[key]);
    // });
    // INDICATE CLIENT CONNECTION
    console.log('Client connected...');
    // BROADCAST WEBSOCKET DATA TO CLIENTS
    ws.on('message', (message) => {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === ws_1.default.OPEN) {
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
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}...`);
});
