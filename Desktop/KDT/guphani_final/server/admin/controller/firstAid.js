import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as firstAidRepository from '../data/firstAid.js';
import { config } from '../config.js';
import multer from 'multer'
import path from 'path';
import fs from 'fs';

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, '../../client/img/uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Buffer.from(file.originalname, 'binary').toString('utf-8'));  // 이 부분을 수정
//     },
// });

// const upload = multer({ storage: storage });

// export async function uploadImg(req, res, next) {
//     try {
//         // 파일 업로드를 처리하기 위해 multer를 사용
//         upload.single('file')(req, res, (err) => {
//             console.log(req.file);
//             if (err) {
//                 console.error('파일 업로드 중 에러 발생', err);
//                 return res.status(500).json({ error: '파일 업로드 중 에러 발생' });
//             }

//             // 업로드된 파일 정보 확인
//             req.file.originalname = Buffer.from(req.file.originalname, 'binary').toString('utf-8');
//             // 업로드된 이미지에 대한 응답 생성 (원하는 형식으로 수정)
//             res.json({
//                 url: path.join(req.file.originalname),
//             });
//         });
//     } catch (error) {
//         console.error('이미지 업로드 중 에러 발생', error);
//         res.status(500).json({ error: '이미지 업로드 중 에러 발생' });
//     }
// }

// 응급처치 작성
export async function create(req, res) {
    const { title, contents, youtube } = req.body;
    const firstAid = await firstAidRepository.createfirstAid({
        title,
        contents,
        youtube
    })
    console.log(firstAid);
    return res.status(201).json(firstAid)
}

// 응급처치 전체보기
export async function getfirstAids(req, res) {
    const { title, contents, startDate, endDate} = req.query;
    const page = Number(req.query.page || 1); // 값이 없다면 기본값으로 1 사용
    const perPage = Number(req.query.perPage || 10);

    try {
        const query = { title, contents, startDate, endDate };
        const data = await firstAidRepository.getAll(query, page, perPage);

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching firstAids:', error);
        return res.status(500).json({ error: 'Error fetching firstAids' });
    }
}

// 사용자 응급처치 전체보기
export async function userGetfirstAids(req, res) {
    const data = await firstAidRepository.userGetAll();
    console.log('사용자 응급처치 들어옴');
    if(!data){
        return res.status(500).json({message:'응급처치이 없습니다.'});
    }
    return res.status(200).json( data );

}

// 응급처치 상세보기
export async function getfirstAid(req, res, next) {
    const { id } = req.query;
    const firstAid = await firstAidRepository.getById(id);
    console.log(id);
    if(firstAid){
        return res.status(200).json(firstAid)
    }else{
        return res.status(404).json({message:'게시글을 찾을 수 없습니다.'})
    }
}

// 응급처치 수정
export async function updatefirstAid(req, res, next) {   
    const id = req.params.id;
    const {title, contents, youtube} = req.body;
    const firstAid = firstAidRepository.getById(id);
    if(!firstAid){
        return res.status(404).json({message:'게시글이 없습니다.'})
    }
    const update = await firstAidRepository.update(id, {title, contents, youtube})
    return res.status(200).json(update)
}

// 응급처치 삭제
export async function deletefirstAid(req, res) {
    const id = req.params.id;
    const firstAid = await firstAidRepository.getById(id)

    if(!firstAid){
        return res.status(400).json({message:"게시물이 없습니다."})
    }
    const del = await firstAidRepository.remove(id);
    res.sendStatus(200);
}

// 응급처치 삭제
export async function deletefirstAids(req, res) {
    const datas = req.body;
    const del = await firstAidRepository.removes(datas.ids);
    res.sendStatus(200);
}