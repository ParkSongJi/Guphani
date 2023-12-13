import Mongoose from "mongoose";
import {useVirtualId} from "../db/database.js";

const userSchema = new Mongoose.Schema({
    userid: { type: String, required: true },
    userpw: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    birthday: { type: String, required: true },
    HP: { type: String, required: true },
    signUpDate: { type: Date, default: Date.now },
    GuardianHP: { type: String, required: false },
    isGuardian: { type: String, required:false},
    status: { type: String, default: 1, required: true},
    isAdmin: { type:String, default:'N', required: true }
});

const diseaseSchema = new Mongoose.Schema({
    diseaseName: {type:String, required:false}
})
const allergySchema = new Mongoose.Schema({
    allergyName: {type:String, required:false}
})
const medicationSchema = new Mongoose.Schema({
    medicationName: {type:String, required:false}
})


useVirtualId(userSchema);
useVirtualId(diseaseSchema);
useVirtualId(allergySchema);
useVirtualId(medicationSchema);
const user = Mongoose.model('user', userSchema)
const disease = Mongoose.model('disease', diseaseSchema)
const allergy = Mongoose.model('allergy', allergySchema)
const medication = Mongoose.model('medication', medicationSchema)


export async function findByuserid(userid){
    return user.findOne({userid });
}

export async function findBydiseaseName(diseaseName){
    return disease.findOne({diseaseName});
}
export async function findByallergyName(allergyName){
    return disease.findOne({allergyName});
}
export async function findBymedicationName(medicationName){
    return disease.findOne({medicationName});
}

export async function findById(id){
    return user.findById(id); 
}

export async function createuser(userData) {
    const { userid, userpw, name, gender, birthday, HP, relationshipWithGuardian, GuardianHP, isGuardian } = userData;
    const signUpDate = new Date(); // 가입 날짜를 현재 날짜로 설정
    const status = 1;
    const isAdmin = 'N';
    const newuser = new user({ userid, userpw, name, gender, birthday, HP, signUpDate, relationshipWithGuardian, GuardianHP, isGuardian, status, isAdmin });
    return newuser.save().then((data) => data);
}

export async function createdisease(diseaseData) {
    const {diseaseName} = diseaseData;
    const newdisease = new disease({diseaseName})
    return newdisease.save().then((data => data));
}
export async function createallergy(allergyData) {
    const {allergyName} = allergyData;
    const newallergy = new allergy({allergyName})
    return newallergy.save().then((data => data));
}
export async function createmedication(medicationData) {
    const {medicationName} = medicationData;
    const newmedication = new medication({medicationName})
    return newmedication.save().then((data => data));
}
export async function getByuserid(userid) {
    return user.find({ userid: userid}).sort({ createdAt: -1 });
}

// export async function createDisease(diseaseSchema) {
//     const { diseaseNumber, diseaseName} = diseaseSchema;
//     const newDisease = new Disease({diseaseNumber, diseaseName});
//     return newDisease.save().then((data => data.id))
// }