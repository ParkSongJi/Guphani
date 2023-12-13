import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import passport from 'passport';
import mongoose from 'mongoose';
import LocalStrategy from 'passport-local';
import { User } from '../data/auth.js'; 
import { config } from '../config.js';
import coolsms from 'coolsms-node-sdk';

// 인증번호
const apiKey = config.sms.sms_api;
const apiSecret = config.sms.sms_secret;

const sms = coolsms.default;
const messageService = new sms(apiKey, apiSecret);

export let verificationStorage = {}; // verificationStorage를 export합니다.

function generateVerificationCode(length) {
  const numbers = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return code;
}

export async function sendVerificationMessage(phoneNumber) {
    if (verificationStorage[phoneNumber]) {
        return { verificationCode: verificationStorage[phoneNumber] };
    }

    const verificationCode = generateVerificationCode(6);
    console.log(verificationCode)
    try {
        const params = {
            to: phoneNumber,
            from: config.sms.sendNumber,
            text: `인증 번호는 ${verificationCode}입니다.`
        };
        
        const response = await messageService.sendOne(params);
        verificationStorage[phoneNumber] = verificationCode;
        return { verificationCode, response };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export function getVerificationCode(phoneNumber) {
    return verificationStorage[phoneNumber];
}

export async function sendVerification(req, res) {
    const phoneNumber = req.body.phnumber;
    try {
        const { verificationCode } = await sendVerificationMessage(phoneNumber);
        // 실제 운영시에는 인증번호를 반환하지 않습니다.
        res.status(200).json({ message: '인증번호가 전송되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '인증번호 전송 실패', error: error.toString() });
    }
}

export async function verifyCode(req, res) {
    const { phnumber, verificationCode } = req.body;
    try {
        const storedCode = verificationStorage[phnumber];
        if (verificationCode === storedCode) {
            res.status(200).json({ message: '인증 성공' });
        } else {
            res.status(400).json({ message: '잘못된 인증번호' });
        }
    } catch (error) {
        res.status(500).json({ message: '인증 검증 실패', error: error.toString() });
    }
}


// Passport Local Strategy
passport.use(new LocalStrategy(
    { usernameField: 'id' },
    async (id, password, done) => {
        try {
        const user = await User.findOne({ id });

        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect password.' });
        }
        } catch (error) {
        return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return done(null, false);
    }

    const user = await User.findById(id);

    if (!user) {
    return done(null, false);
    }

    done(null, user);
} catch (err) {
    done(err, null);
}
});

// 중복검사
export async function findById(req, res) {
    const id = req.body 
    console.log(id);
    const found = await User.findOne({ id: id });

    if(found){
        return res.status(409).json({isUser:'Y'});
    }
    return res.status(200).json({isUser:'N'});
}

// 회원가입 
export async function AdminSignUp(req, res) {
    const { id, password, name, gender, birthdate, phoneNumber, isAdmin, isUser } = req.body;
    const found = await User.findOne({ id: id });
    if (found) {
        return res.status(409).json({ message: `${id}이 이미 가입되었음`});
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({
        id, 
        password: hashed, 
        name, 
        gender, 
        birthdate, 
        phoneNumber, 
        isAdmin, 
        isUser });
    await newUser.save(); 
    
    res.status(201).json( { id });
}

// 로그인 (관리자)
export async function adminSignIn(req, res) {
    const { id, password } = req.body;

  // Retrieve the hashed password from the database
    const user = await User.findOne({ id: id, isAdmin: 'Y' });

    if (!user) {
        return res.status(401).json({ message: '입력한 아이디가 일치하지 않습니다. 다시 로그인해주세요.' });
    }
    console.log(user);

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return res.status(401).json({ message: '입력한 비밀번호가 일치하지 않습니다. 다시 로그인해주세요.' });
    }

    const token = createJwtToken(user);
    res.status(200).json({user, token});
}

// 회원 정보 전체 수정 
export async function updateUser(req, res, next) {
    try {
        const { name, gender, birthdate, phoneNumber, isAdmin, isUser, 
            guardianPhoneNumber, guardianRelationship, bloodType, underlyingDisease, 
            allergy, medication } = req.body;
        
        const updatedUser = await User.findOneAndUpdate(
            { id: req.params.id }, // 아이디로 condition 필터
            { $set: { name, gender, birthdate, phoneNumber, isAdmin, isUser, guardianPhoneNumber, 
            guardianRelationship, bloodType, underlyingDisease, allergy, medication } }, // 회원 정보 중에서 수정할 부분 
            { new: true } // 값 출력 
        );

        if (!updatedUser) {
            res.json({ result: '실패', message: '회원이 없습니다' });
            return;
        }

        res.json({ result: '성공', message: '회원님의 정보가 업데이트 되었습니다. 확인해주세요.', user: updatedUser });
        } catch (error) {
        console.error('업데이트 할 때 에러가 발생했습니다:', error);
        res.json({ result: '실패', message: '회원정보 업데이트할 때 에러발생했습니다.' });
        }
}

// 회원정보 삭제
export async function deleteUser(req, res, next) {
    try {
        // Update isUser field to 'N' instead of deleting the user
        const updatedUser = await User.findOneAndUpdate(
            { id: req.params.id },
            { $set: { isUser: 'N' } },
            { new: true }
        );

        if (!updatedUser) {
            res.json({ result: '실패', message: '해당 회원을 찾을 수 없습니다' });
            return;
        }

        res.json({
            result: '성공',
            message: '회원님이 성공적으로 탈퇴하셨습니다. 다음 기회에 급하니를 찾아주세요.',
            user: updatedUser,
        });
    } catch (error) {
        console.error('회원 정보 탈퇴 중 에러 발생:', error);
        res.json({ result: '실패', message: '회원 정보 탈퇴 중 에러 발생' });
    }
    }

// 회원 정보 상세 조회
export async function searchUser(req, res, next) {
    try {
        const userInfo = await User.findOne({ id: req.params.id });
        
        if (!userInfo) {
            res.json({ result: '실패', message: '해당 회원을 찾을 수 없습니다' });
            return;
        }
        res.json({ result: '성공', message: '해당 회원 정보 조회 성공', user: userInfo });
    } catch (error) {
        console.error('회원 정보 조회 중 에러 발생:', error);
        res.json({ result: '실패', message: '회원 정보 조회 중 에러 발생' });
    }

}

// 회원 정보 전체 조회 
export async function searchAll(req, res, next) {
    try {
        const allUsers = await User.find();
        
        if (!allUsers || allUsers.length === 0) {
            res.json({ result: '실패', message: '회원을 찾을 수 없습니다' });
            return;
        }
        res.json({ result: '성공', message: '전체 회원 정보 조회 성공', users: allUsers });
    } catch (error) {
        console.error('전체 회원 정보 조회 중 에러 발생:', error);
        res.json({ result: '실패', message: '전체 회원 정보 조회 중 에러 발생' });
    }

}

// ----------------------------------------------------------------------

// 회원가입 (사용자/관리자)
export async function signUp(req, res) {
    const { id, password, name, birthdate, gender, phoneNumber } = req.body;

    const found = await User.findOne({ id: id });
    if (found) {
        return res.status(409).json({ message: `${id}이 이미 가입되었음, 다른 아이디로 회원가입해주세요`});
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({
        id, 
        password: hashed, 
        name, 
        birthdate, 
        gender, 
        phoneNumber, 
        isAdmin: "N", // Set default value as "N"
        isUser: "Y"   // Set default value as "Y"
    });
    await newUser.save(); 
    
    res.status(201).json( { id });
}

// 로그인 (사용자)
export async function signIn(req, res) {
    const { id, password } = req.body;

    // Retrieve the hashed password from the database
    const user = await User.findOne({ id: id, isUser: 'Y' });
    
    if (!user) {
        return res.status(401).json({ message: '입력한 아이디가 일치하지 않습니다. 다시 로그인해주세요.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return res.status(401).json({ message: '입력한 비밀번호가 일치하지 않습니다. 다시 로그인해주세요.' });
    }

    const token = createJwtToken(user);
    res.status(200).json({user, token});
}


function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
}


// validateCredential/ValidateSignup 만들어 주기 

// 추가 정보 입력 (사용자)
export async function addInfo(req, res, next) {
    const userId = req.params.id; 
    const newData = req.body; 

    try {

        const updatedUser = await User.findOneAndUpdate(
            { id: userId }, // 아이디로 condition 필터
            { $set: { 
                guardianPhoneNumber: newData.guardianPhoneNumber,
                guardianRelationship: newData.guardianRelationship,
                underlyingDisease: newData.underlyingDisease,
                allergy: newData.allergy,
                medication: newData.medication,
                bloodType: newData.bloodType
            } 
        },
            { new: true } // 값 출력 
        );

        if (!updatedUser) {
            res.json({ result: '실패', message: '회원이 없습니다' });
            return;
        }

        res.json({ result: '성공', message: '회원님의 추가 정보가 입력되었습니다. 확인해주세요.', user: updatedUser });
    } catch (error) {
        console.error('회원님의 추가 정보 입력할 때 에러가 발생했습니다:', error);
        res.json({ result: '실패', message: '회원님의 추가 정보를 업데이트할 때 에러발생했습니다.' });
    }
}


// 회원 탈퇴 (사용자)
export async function withdraw(req, res, next) {
    try {
        // Extract user ID from the token
        const userIdFromToken = req.id;

        // Compare user ID from token with the ID in the request parameters
        if (userIdFromToken !== req.params.id) {
            res.status(403).json({ result: '실패', message: '권한이 없습니다. 본인 계정만 탈퇴 가능합니다.' });
            return;
        }

        // Update isUser field to 'N' instead of deleting the user
        const updatedUser = await User.findOneAndUpdate(
            { id: req.params.id },
            { $set: { isUser: 'N' } },
            { new: true }
        );

        if (!updatedUser) {
            res.json({ result: '실패', message: '해당 회원을 찾을 수 없습니다' });
            return;
        }

        res.json({
            result: '성공',
            message: '회원님이 성공적으로 탈퇴하셨습니다. 다음 기회에 급하니를 찾아주세요.',
            user: updatedUser,
        });
    } catch (error) {
        console.error('회원 정보 탈퇴 중 에러 발생:', error);
        res.json({ result: '실패', message: '회원 정보 탈퇴 중 에러 발생' });
    }
}


// 회원 정보 수정 (사용자)
export async function updateMain(req, res, next) {
    try {
        const { name, birthdate, gender, phoneNumber } = req.body;

        // Extract user ID from the token
        const userIdFromToken = req.id;

        // Compare user ID from token with the ID in the request parameters
        if (userIdFromToken !== req.params.id) {
            res.status(403).json({ result: '실패', message: '권한이 없습니다. 본인 정보만 수정 가능합니다.' });
            return;
        }

        const updatedUser = await User.findOneAndUpdate(
            { id: req.params.id },
            { $set: { name, birthdate, gender, phoneNumber }},
            { new: true }
        );

        if (!updatedUser) {
            res.json({ result: '실패', message: '회원이 없습니다' });
            return;
        }
        res.json({ result: '성공', message: '회원님의 메인 정보가 업데이트 되었습니다. 확인해주세요.', user: updatedUser });
    } catch (error) {
        console.error('회원님의 메인 정보 업데이트 할 때 에러가 발생했습니다:', error);
        res.json({ result: '실패', message: '회원님의 메인 정보 업데이트할 때 에러발생했습니다.' });
    }
}

// 추가 정보 수정 (사용자)
export async function updateOther(req, res, next) {
    try {
        const { guardianPhoneNumber, guardianRelationship, bloodType, underlyingDisease, allergy, medication } = req.body;

        // Extract user ID from the token
        const userIdFromToken = req.id;

        // Compare user ID from token with the ID in the request parameters
        if (userIdFromToken !== req.params.id) {
            res.status(403).json({ result: '실패', message: '권한이 없습니다. 본인 정보만 수정 가능합니다.' });
            return;
        }

        const updatedOtherUser = await User.findOneAndUpdate(
            { id: req.params.id },
            { $set: { guardianPhoneNumber, guardianRelationship, bloodType, underlyingDisease, allergy, medication }},
            { new: true }
        );

        if (!updatedOtherUser) {
            res.json({ result: '실패', message: '회원이 없습니다' });
            return;
        }

        res.json({ result: '성공', message: '회원님의 추가 정보가 업데이트 되었습니다. 확인해주세요.', user: updatedOtherUser });
    } catch (error) {
        console.error('회원님의 추가 정보 업데이트 할 때 에러가 발생했습니다:', error);
        res.json({ result: '실패', message: '회원님의 추가 정보 업데이트할 때 에러발생했습니다.' });
    }
}
