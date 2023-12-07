import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import authRouter from './router/auth.js'
import {config} from './config.js'
import {initSocket} from './connection/socket.js'
import { connectDB } from './db/database.js';


const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors())
app.use('/user', authRouter)
app.use((req, res, next) => {
    res.sendStatus(404);
});

connectDB().then(() =>{
    const server=app.listen(config.host.port);
    initSocket(server);
}).catch(console.error);