import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as noticeRepository from '../data/notice.js';
import { config } from '../config.js';

const paging = (page, totalPost) => {
    const maxPost = 10; // (1)
    const maxPage = 10; // (2)
    let currentPage = page ? parseInt(page) : 1; // (3)
    const hidePost = page === 1 ? 0 : (page - 1) * maxPost; // (4)
    const totalPage = Math.ceil(totalPost / maxPost); // (5)
    
    if (currentPage > totalPage) { // (6)
        currentPage = totalPage;
    }

    const startPage = Math.floor(((currentPage - 1) / maxPage)) * maxPage + 1; // (7)
    let endPage = startPage + maxPage - 1; // (8)

    if (endPage > totalPage) { // (9)
        endPage = totalPage;
    }

    return { startPage, endPage, hidePost, maxPost, totalPage, currentPage }; // (10)
};

export const pagingController = async (req, res, next) => {
    console.log('Paging Controller Invoked'); // 디버깅을 위한 로그

    const { page } = req.query;
    try {
        const totalPost = await Post.countDocuments({});
        if (!totalPost) {
            throw Error();
        }
        let {
            startPage,
            endPage,
            hidePost,
            maxPost,
            totalPage,
            currentPage
        } = paging(page, totalPost);
        const board = await Post.find({})
            .sort({ createAt: -1 })
            .skip(hidePost)
            .limit(maxPost);
        res.render("home", {
            board,
            currentPage,
            startPage,
            endPage,
            maxPost,
            totalPage,
        });
    } catch (error) {
        res.render("home", { board: [] });
    }
};


// 공지사항 작성
export async function create(req, res) {
    const { title, contents } = req.body;
    const notice = await noticeRepository.createNotice({
        title,
        contents
    })
    res.status(201).json(notice)
}

// 공지사항 전체보기
export async function getNotices(req, res) {
    const { title, contents, startDate, endDate } = req.query;
    const data = await noticeRepository.getAll({ title, contents, date: { start: startDate, end: endDate } });
    return res.status(200).json(data);
}

// 공지사항 상세보기
export async function getNotice(req, res, next) {
    const id = req.params.id;
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