import Mongoose from "mongoose";
import { noticeVirtualId } from "../db/database.js";

const noticeSchema = new Mongoose.Schema({
    title: {type:String, required: true },
    contents: {type:String, required: true }
},
{ timestamps: true }
);

noticeVirtualId(noticeSchema);

const notice = Mongoose.model('notice', noticeSchema)

// 공지사항작성
export async function createNotice(noticeData) {
    const { title, contents } = noticeData;
    const newNotice = new notice({title, contents});
    return newNotice.save().then((data) => data);
}

export async function getAll(search) {
    const { title, contents, date } = search;
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
    if (date && date.start && date.end) {
        query.createdAt = {
            $gte: new Date(date.start),
            $lte: new Date(date.end),
        };
    }

    // MongoDB에서 검색 후 정렬
    return notice.find(query).sort({ createdAt: -1 });
}

// 공지사항 디테일
export async function getById(id) {
    return notice.findById(id);
}

// 공지사항 수정
export async function update(id, noticeData) {
    const {title, contents} = noticeData 
    return notice.findByIdAndUpdate(
        id,
        { title, contents },
        {
            returnDocument: 'after'
        }
    )
}

// 공지사항 삭제
export async function remove(id) {
    return notice.findByIdAndDelete(id)
}