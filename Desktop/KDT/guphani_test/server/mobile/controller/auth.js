import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

export async function signup(req, res) {
    const { userid, userpw, name, gender, birthday, HP, relationshipWithGuardian, GuardianHP, isGuardian } = req.body;
    const found = await userRepository.findByuserid(userid);
    if (found) {
        return res.status(409).json({ message: `${userid}이 이미 가입되었음`});
    }

    const hashed = await bcrypt.hash(userpw, config.bcrypt.saltRounds);
    const user = await userRepository.createuser({
        userid,
        userpw: hashed,
        name,
        gender,
        birthday,
        HP,
        relationshipWithGuardian,
        GuardianHP,
        isGuardian
    });
    const token = createJwtToken(user);
    res.status(201).json({token, user});
}
export async function signup2(req, res) {
    const { diseaseName, allergyName, medicationName } = req.body;
    const foundD = await userRepository.findBydiseaseName(diseaseName);
    const foundA = await userRepository.findByallergyName(allergyName);
    const foundM = await userRepository.findBymedicationName(medicationName);
    if (foundD) {
        return res.status(409).json({ message: `${diseaseName}이 이미 있음`});
    }
    const disease = await userRepository.createdisease({diseaseName});
    res.status(201).json({disease});
    if (foundA) {
        return res.status(409).json({ message: `${allergyName}이 이미 있음`});
    }
    const allergy = await userRepository.createallergy({allergyName});
    res.status(201).json({allergy});
    if (foundM) {
        return res.status(409).json({ message: `${medicationName}이 이미 있음`});
    }
    const medication = userRepository.createmedication({medicationName});
    res.status(201).json({medication});
}
export async function login(req, res) {
    const { userid, userpw } = req.body;
    const user = await userRepository.findByuserid(userid)
    if(!user) {
        return res.status(401).json({message: '사용자를 찾을 수 없습니다'})
    }

    const isValiduserpw = bcrypt.compareSync(userpw, user.userpw)
    if(!isValiduserpw) {
        return res.status(401).json({message: '비밀번호가 틀렸습니다'})
    }

    const token = createJwtToken(user.id)
    res.status(200).json({token, userid})

}

// 새로운 이름(newName) 및 성별(newGender) 정보를 저장합니다.
export async function updateInfo(req, res) {
    const { userid, newName, newGender } = req.body; 
    const user = await userRepository.findByuserid(userid);
    try {
        user.name = newName;
        user.gender = newGender;
        await user.save();

        const token = createJwtToken(user.id); // 새로운 JWT 토큰 생성
        res.status(200).json({ token, userid, message: '회원 정보가 업데이트되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '회원 정보를 업데이트하는 중 오류가 발생했습니다.' });
    }
}

function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec});
}

export async function me(req, res, next) {
    const userid = await userRepository.findById(req.userid);
    if (!userid) {
        return res.status(404).json({ message: '사용자를 찾을 수 없음'});
    }
    res.status(200).json( { token: req.token, userid: users.userid });
}