import express from "express";
import {body} from 'express-validator'
import {validate} from '../middleware/validator.js'
import * as authController from '../controller/auth.js'
import {isAuth} from '../middleware/auth.js';
const router = express.Router();
const validateCredential = [
    body('userid')
        .trim()
        .notEmpty()
        .withMessage('아이디는 반드시 입력해야 함')
        .isAlphanumeric() // 영문자/소문자로 구성됐는지 확인
        .withMessage('아이디는 영어 소문자와 숫자만 포함해야 함')
        .isLength({min:4, max:12})
        .withMessage('아이디는 4자에서 12자 사이여야 함'),
    body('userpw')
        .trim()
        .matches(/^(?=.*[a-zA-Z])(?=.*\d|.*[\W_])[a-zA-Z\d\W_]{6,20}$/)
        .withMessage('userpw는 영문자(대소문자 상관없이), 숫자, 특수문자 중 2가지 이상을 조합하여 6~20자 이어야 함'),
    body('userpw_check')
        .custom((value, { req }) => {
            if (value !== req.body.userpw) {
                throw new Error('userpw와 일치하지 않습니다');
            }
            return true;
        })
        .notEmpty()
        .withMessage('userpw_check는 반드시 입력해야 함'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('이름을 입력하세요')
        .matches(/^[a-zA-Z가-힣]+$/)
        .withMessage('이름은 한글 또는 영어로만 이루어져야 합니다'),
    body('birthday')
        .trim()
        .notEmpty()
        .withMessage('생년월일을 입력하세요')
        .isNumeric()
        .withMessage('생년월일이 올바르지 않습니다.')
        .isLength({ min: 8, max: 8 })
        .withMessage('생년월일이 올바르지 않습니다.'),
    body('HP')
        .trim()
        .notEmpty()
        .withMessage('휴대폰 번호를 입력하세요')
        .matches(/^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/)
        .withMessage('휴대폰 번호를 확인해주세요. (예: 010-1234-5678)'),
    validate
]
const validateSignup = [
    ...validateCredential,
    body('userid').notEmpty().withMessage('ID는 반드시 입력'),
    validate
]


// 회원정보 수정에 대한 유효성 검사를 수행하는 미들웨어
const validateUpdateinfo = [
    body('newName').notEmpty().withMessage('새로운 이름을 입력'),
    validate
]


// 회원가입
router.post('/regist',validateSignup, authController.signup)
// 회원가입 추가정보
router.post('/regist2', authController.signup2)
// 로그인  
router.post('/login',validateCredential, authController.login)
// 회원정보 수정
router.put('/info', isAuth, validateUpdateinfo, authController.updateInfo);
// JWT 확인
router.get('/me', isAuth, authController.me)
export default router;