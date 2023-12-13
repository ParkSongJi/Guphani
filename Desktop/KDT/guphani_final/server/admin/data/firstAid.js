import Mongoose from "mongoose";
import { firstAidVirtualId } from "../db/database.js";

const firstAidSchema = new Mongoose.Schema({
    title: {type:String, required: true },
    youtube: {type:String},
    contents: {type:String, required: true }
},
{ timestamps: true }
);

firstAidVirtualId(firstAidSchema);

const firstAid = Mongoose.model('firstAid', firstAidSchema)

// 사용자 응급처치
export async function userGetAll() {
    const data = await firstAid.find()
    return data;
}

// 응급처치작성
export async function createfirstAid(firstAidData) {
    const { title, contents, youtube } = firstAidData;
    const newfirstAid = new firstAid({title, contents, youtube});
    return newfirstAid.save().then((data) => { return data});
}

export async function getAll(query, page, perPage) {
    const { title, contents, startDate, endDate } = query;
    const queryObj = {};

    // 제목으로 검색
    if (title) {
        queryObj.title = { $regex: new RegExp(title, 'i') };
    }

    // 내용으로 검색
    if (contents) {
        queryObj.contents = { $regex: new RegExp(contents, 'i') };
    }

    // 날짜로 검색
    if (startDate && endDate) {
        queryObj.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    // MongoDB에서 검색 후 정렬 및 페이징 적용
    const data = await firstAid.find(queryObj)
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage);

    // 검색 조건이 없으면 전체 게시글 수, 있으면 해당 조건에 맞는 게시글 수를 가져옴
    const total = await firstAid.countDocuments(queryObj);
    const totalPage = Math.ceil(total / perPage);
    return { data, totalPage, total };
}

// 응급처치 디테일
export async function getById(id) {
    return firstAid.findById(id);
}

// 응급처치 수정
export async function update(id, firstAidDatas) {
    const {title, contents, youtube } = firstAidDatas
    return firstAid.findByIdAndUpdate(
        id,
        { title, contents, youtube },
        {
            returnDocument: 'after'
        }
    )
}

// 응급처치 삭제
export async function remove(id) {
    return firstAid.findByIdAndDelete(id)
}

// 응급처치 선택삭제
export async function removes(ids) {
    // 배열에 있는 모든 ID 값을 가진 데이터를 삭제합니다.
    return firstAid.deleteMany({ _id: { $in: ids } });
}