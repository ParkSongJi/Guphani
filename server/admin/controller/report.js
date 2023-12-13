import { User } from '../data/auth.js'
import { generateEmergencyMessage } from '../data/report.js'

export async function createSMS(req, res, next) {
    try {
        const { id } = await User.findOne({ id: req.params.id });
        const emergencyMessage = await generateEmergencyMessage(id);
        res.json({ result: '성공', message: '문자 작성 완료', emergencyMessage });
        console.log(emergencyMessage)
    } catch (error) {
        console.error('에러가 발생했습니다:', error);
        res.json({ result: '실패', message: '에러발생했습니다.' });
    }
}