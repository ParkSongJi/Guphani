import multer from 'multer';
import path from 'path';
import fs from 'fs';

// uploads 폴더가 존재하는지 확인하고, 없으면 생성하는 함수
function ensureUploadsFolder() {
    const dir = '../../client/img/uploads/';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

// uploads 폴더 확인 및 생성
ensureUploadsFolder();

// Multer 설정
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../../client/img/uploads/');
    },
    filename: function(req, file, cb) {
        // 파일 확장자
        const ext = path.extname(file.originalname);

        // 파일명 (확장자 제외)
        const basename = path.basename(file.originalname, ext);

        // 안전한 파일명 생성: 공백과 특수문자를 '-'로 대체
        const safeBasename = basename.replace(/[\s\W-]+/g, '-');

        // 최종 파일명: 시간값 + 안전한 파일명 + 확장자
        cb(null, Date.now() + '-' + safeBasename + ext);
    }
});

export const uploadMiddleware = multer({ storage: storage });

export async function upload(req, res){
    if (!req.file) {
        return res.status(400).send('No image file provided.');
    }
    // const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const imageUrl = `${req.file.filename}`;
    res.status(200).json({ url: imageUrl });
}

export default {uploadMiddleware, upload};
