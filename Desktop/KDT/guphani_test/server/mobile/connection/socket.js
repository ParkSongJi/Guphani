import { Server } from "socket.io";
import jwt from 'jsonwebtoken';
import { config } from "../config.js";

class Socket{
    constructor(server){
        this.io=new Server(server,{
            cors:{
                origin:'*'
            }
        });
        this.io.use((socket,next)=>{
            const token=socket.handshake.auth.token;
            if(!token){
                return next(new Error('인증 에러!'));
            }
            jwt.verify(token,config.jwt.secretKey,(error,decoded)=>{
                if (error){
                    return next(new Error('인증 에러!'));
                }
                next();
            })
        })
        this.io.on('connection',(socket)=>{
            console.log('클라이언트 접속!');
        })
    }
}

let socket;

export function initSocket(server){
    if(!socket){
        socket=new Socket()
    }
}

export function getSocketIO(){
    if(!socket){
        throw new Error('먼저 init를 실행해야 함!');
    }
    return socket.io;
}