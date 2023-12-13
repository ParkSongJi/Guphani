import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as inquiryRepository from '../data/inquiry.js';
import { config } from '../config.js';


// 문의사항 작성
export async function create(req, res) {
    console.log('문의사항 들어옴');
    const { userId, title, contents, sort } = req.body;
    const name = req.id.name;
    const inquiry = await inquiryRepository.createInquiry({
        userId,
        title,
        contents,
        sort,
        name
    })
    console.log(inquiry);
    return res.status(201).json(inquiry)
}

// 문의사항 전체보기
export async function getInquirys(req, res) {
    const { name, contents, sort, answerStatus } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // const title = req.query.title || '';

    const query = {};

    // 작성자 이름으로 검색
    if (name) {
        query.name = { $regex: new RegExp(name, 'i') };
    }

    // 내용으로 검색
    if (contents) {
        query.contents = { $regex: new RegExp(contents, 'i') };
    }

    // 답변유무으로 검색
    if (answerStatus) {
        query.answerStatus = { $regex: new RegExp(answerStatus, 'i') };
    }

    // 문의분류로 검색
    if (sort) {
        query.sort = { $regex: new RegExp(sort, 'i') };
    }


    try {
        const totalInquirys = await inquiryRepository.countInquirys(query);
        const totalPages = Math.ceil(totalInquirys / limit);
        const inquirys = await inquiryRepository.getAll(query, page, limit);

        res.status(200).json({ inquirys, totalPages });
    } catch (error) {
        console.error(error); // 오류를 로깅
        res.status(500).json({ message: '서버 오류 발생' });
    }
}
    

// 사용자 문의사항 전체보기
export async function userGetinquirys(req, res) {
    const id = req.id._id
    const data = await inquiryRepository.userGetByUserId(id);

    if(!data){
        return res.status(500).json({message:'문의사항이 없습니다.'});
    }
    return res.status(200).json( data );
}

// 문의사항 상세보기
export async function getInquiry(req, res, next) {
    const { id } = req.query;
    const inquiry = await inquiryRepository.getById(id);
    if(inquiry){
        return res.status(200).json(inquiry)
    }else{
        return res.status(404).json({message:'게시글을 찾을 수 없습니다.'})
    }
}

// 관리자 답변 작성
export async function setAnswer(req, res, next) {
    const {id, answerContents, answerDate} = req.body
    const answer = await inquiryRepository.answer({id, answerContents, answerDate})
    console.log(answer);
    if(!answer){
        return res.send(404).json({message:'게시글을 찾을 수 없습니다.'})
    }
    return res.status(200).json(answer)
}

// 문의사항 수정
export async function updateInquiry(req, res, next) {   
    const id = req.params.id;
    const {title, contents, sort} = req.body;
    console.log(title, contents, sort);
    const inquiry = inquiryRepository.getById(id);
    if(!inquiry){
        return res.status(404).json({message:'게시글이 없습니다.'})
    }
    const update = await inquiryRepository.update(id, {title, contents, sort})
    return res.status(200).json(update)
}

// 문의사항 삭제
export async function deleteInquiry(req, res) {
    console.log('문의사항 삭제');
    const id = req.params.id;
    const inquiry = await inquiryRepository.getById(id)

    if(!inquiry){
        return res.status(400).json({message:"게시물이 없습니다."})
    }
    const del = await inquiryRepository.remove(id);
    res.sendStatus(200);
}

// 문의사항 삭제
export async function deleteInquirys(req, res) {
    const datas = req.body;
    console.log(datas);
    const del = await inquiryRepository.removes(datas.ids);
    res.sendStatus(200);
}