import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as noticeRepository from '../data/notice.js';
import { config } from '../config.js';
import multer from 'multer'
import path from 'path';
import fs from 'fs';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../../client/img/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Buffer.from(file.originalname, 'binary').toString('utf-8'));  // 이 부분을 수정
    },
});

const upload = multer({ storage: storage });

export async function uploadImg(req, res, next) {
    try {
        // 파일 업로드를 처리하기 위해 multer를 사용
        upload.single('file')(req, res, (err) => {
            console.log(req.file);
            if (err) {
                console.error('파일 업로드 중 에러 발생', err);
                return res.status(500).json({ error: '파일 업로드 중 에러 발생' });
            }

            // 업로드된 파일 정보 확인
            req.file.originalname = Buffer.from(req.file.originalname, 'binary').toString('utf-8');
            // 업로드된 이미지에 대한 응답 생성 (원하는 형식으로 수정)
            res.json({
                url: path.join(req.file.originalname),
            });
        });
    } catch (error) {
        console.error('이미지 업로드 중 에러 발생', error);
        res.status(500).json({ error: '이미지 업로드 중 에러 발생' });
    }
}

// 공지사항 작성
export async function create(req, res) {
    const { title, contents } = req.body;
    const notice = await noticeRepository.createNotice({
        title,
        contents
    })
    console.log(notice);
    return res.status(201).json(notice)
}


// 공지사항 전체보기
export async function getNotices(req, res) {
    const { contents, startDate, endDate } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const title = req.query.title || '';

    const query = {};

    // 제목으로 검색
    if (title) {
        query.title = { $regex: new RegExp(title, 'i') };
    }

    // 내용으로 검색
    if (contents) {
        query.contents = { $regex: new RegExp(contents, 'i') };
    }

    // 날짜로 검색
    if (startDate && endDate) {
        query.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    try {
        const totalNotices = await noticeRepository.countNotices(query);
        const totalPages = Math.ceil(totalNotices / limit);
        const notices = await noticeRepository.getAll(query, page, limit);

        res.status(200).json({ notices, totalPages });
    } catch (error) {
        console.error(error); // 오류를 로깅
        res.status(500).json({ message: '서버 오류 발생' });
    }
}
    
    // try {
    //     const data = await noticeRepository.getAll({ title, contents, date: { start: startDate, end: endDate } }, page, perPage);
    //     return res.status(200).json( {data, currPage} );
    // } catch (error) {
    //     console.error('Error fetching notices:', error);
    //     return res.status(500).json({ error: 'Error fetching notices' });
    // }

// 사용자 공지사항 전체보기
export async function userGetNotices(req, res) {
    const data = await noticeRepository.userGetAll();
    console.log('사용자 공지사항 들어옴');
    if(!data){
        return res.status(500).json({message:'공지사항이 없습니다.'});
    }
    return res.status(200).json( data );

}

// 공지사항 상세보기
export async function getNotice(req, res, next) {
    const { id } = req.query;
    const notice = await noticeRepository.getById(id);
    if(notice){
        return res.status(200).json(notice)
    }else{
        return res.status(404).json({message:'게시글을 찾을 수 없습니다.'})
    }
}

// 공지사항 수정
export async function updateNotice(req, res, next) {   
    const id = req.params.id;
    const {title, contents} = req.body;
    const notice = noticeRepository.getById(id);
    if(!notice){
        return res.status(404).json({message:'게시글이 없습니다.'})
    }
    const update = await noticeRepository.update(id, {title, contents})
    return res.status(200).json(update)
}

// 공지사항 삭제
export async function deleteNotice(req, res) {
    const id = req.params.id;
    const notice = await noticeRepository.getById(id)

    if(!notice){
        return res.status(400).json({message:"게시물이 없습니다."})
    }
    const del = await noticeRepository.remove(id);
    res.sendStatus(200);
}

// 공지사항 삭제
export async function deleteNotices(req, res) {
    const datas = req.body;
    const del = await noticeRepository.removes(datas.ids);
    res.sendStatus(200);
}