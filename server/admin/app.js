import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import bodyParser from 'body-parser';
import session from 'express-session';
import crypto from 'crypto';
import passport from 'passport';
import authRouter from './router/auth.js'
import noticeRouter from './router/notice.js'
import firstAidRouter from './router/firstAid.js'
import emergencyRouter from './router/emergency.js'
import pharmacyRouter from './router/pharmacy.js'
import ambulanceRouter from './router/ambulance.js'
import {config} from './config.js'
import { connectDB } from './db/database.js';
import {initSocket} from './connection/socket.js'


const app = express();

// Middleware
app.use(bodyParser.json());
const secretKey = crypto.randomBytes(32).toString('hex');
app.use(
    session({
        secret: secretKey,
        resave: false,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json({ limit: '70kb' }));

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// user
// app.use('/user', authRouter)
app.use('/auth', authRouter);

// 공지사항
app.use('/admin/notice/', noticeRouter)
app.use('/notice/', noticeRouter)

// 응급처치
app.use('/admin/firstAid/', firstAidRouter)
app.use('/firstAid/', firstAidRouter)

// 응급실 & 특수응급
app.use('/emergency' ,emergencyRouter)
// 사설구급차
app.use('/ambulance', ambulanceRouter)
// 약국
app.use('/pharmacy', pharmacyRouter);
// 이미지 업로드
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
    res.sendStatus(404);
});

connectDB().then(() =>{
    const server=app.listen(config.host.port);
    console.log('db연결');
    initSocket(server) 
}).catch(console.error);