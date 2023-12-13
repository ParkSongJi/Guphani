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


// 비교 
userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

const User = mongoose.model('User', userSchema);

export { User };