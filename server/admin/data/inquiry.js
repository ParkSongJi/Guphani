import Mongoose from "mongoose";
import MongoDb from 'mongodb';
const ObjectId = MongoDb.ObjectId;

const inquirySchema = new Mongoose.Schema({
    userId: {type:String, required: true },
    name: {type:String, required: true},
    title: {type:String, required: true },
    contents: {type:String, required: true },
    sort: {type:String, required: true},
    answerStatus: {type:String, require:true},
    answerContents: {type:String},
    answerDate: {type:String}
},
{ timestamps: true }
);


const inquiry = Mongoose.model('inquiry', inquirySchema)

// 사용자 문의사항
export async function userGetByUserId(id) {
    const data = await inquiry.find({userId:id}).sort({createdAt : -1})
    return data;
}

// 문의사항작성
export async function createInquiry(inquiryData) {
    const {userId ,title, contents, sort, name} = inquiryData;
    console.log(userId ,title, contents, sort, name);
    const newInquiry = new inquiry({userId, name, title, contents, sort, answerStatus:'N', answerContents: ''});
    return newInquiry.save().then((data) => { return data});
}

// 문의사항 조회
export async function getAll(query, page, limit) {
    const skip = (page - 1) * limit;
    try {
        // MongoDB에서 검색 후 정렬 및 페이징 적용
        const data = await inquiry.find(query)
            .sort({createdAt : -1})
            .skip(skip)
            .limit(limit);

        const total = await inquiry.countDocuments(query);
        const totalPage = Math.ceil(total / limit);
        return { data, totalPage, total };
    } catch (error) {
        console.error(error); 
        throw error;
    }
}

// 문의사항 전체조회
export async function getAllInquirys(query, page, limit) {
    const skip = (page - 1) * limit;
    return inquiry.find(query)
        .skip(skip)
        .limit(limit);
}


export async function countInquirys(query) {
    const total = await inquiry.countDocuments(query);
    return total
}

// 문의사항 디테일
export async function getById(id) {
    return inquiry.findById(id);
}

// 답변작성
export async function answer(inquiryData) {
    const {id, answerContents, answerDate} = inquiryData;
    return inquiry.findOneAndUpdate(new ObjectId(id),{
        answerContents,
        answerDate,
        answerStatus:'Y'},
        {
        returnDocument:'after'}
        )
}

// 문의사항 수정
export async function update(id, inquiryData) {
    const {title, contents, sort} = inquiryData 
    console.log(contents, '문의사항 수정');
    return inquiry.findByIdAndUpdate(
        id,
        { title, contents, sort },
        {
            returnDocument: 'after'
        }
    )
}

// 문의사항 삭제
export async function remove(id) {
    return inquiry.findByIdAndDelete(id)
}

export async function removes(ids) {
    // 배열에 있는 모든 ID 값을 가진 데이터를 삭제합니다.
    return inquiry.deleteMany({ _id: { $in: ids } });
}