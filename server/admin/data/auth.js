import mongoose from "mongoose";

// 스키마 생성 
const userSchema = new mongoose.Schema({
    // 기본 입력값
    id: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: String,
    gender: String,
    birthdate: String,
    phoneNumber: String,
    isAdmin: String,
    isUser: String,
    joinDate: { type: Date, default: Date.now }, 
    
    // 추가 입력값 
    guardianPhoneNumber : { type: String, required: false }, 
    guardianRelationship : { type: String, required: false }, 
    bloodType : { type: String, required: false }, 
    underlyingDisease : { type: Array, required: false },
    allergy : { type: Array, required: false },
    medication: { type: Array, required: false },
});

const User = mongoose.model('User', userSchema);
// 비교 
userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

// 문의사항 조회
export async function getAll(query, page, limit) {
    const skip = (page - 1) * limit;
    try {
        // MongoDB에서 검색 후 정렬 및 페이징 적용
        const data = await User.find(query)
            .sort({createdAt : -1})
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);
        const totalPage = Math.ceil(total / limit);
        return { data, totalPage, total };
    } catch (error) {
        console.error(error); 
        throw error;
    }
}

// 문의사항 전체조회
export async function getAllUsers(query, page, limit) {
    const skip = (page - 1) * limit;
    return User.find(query)
        .skip(skip)
        .limit(limit);
}


export async function countUsers(query) {
    const total = await User.countDocuments(query);
    return total
}

export async function removes(ids) {
    // 배열에 있는 모든 ID 값을 가진 데이터를 삭제합니다.
    return User.updateMany({ _id: { $in: ids }, isUser:'N' });
}

export { User };