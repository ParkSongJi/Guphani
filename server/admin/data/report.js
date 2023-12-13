import {User} from './auth.js'



export async function generateEmergencyMessage(id) {
    try {
      // MongoDB에서 _id를 사용하여 유저 문서를 찾습니다.
      const user = await User.findOne({id:id});
  
      // 유저 정보를 필요한 형태의 문자열로 조합하여 반환합니다.
      const { name, birthdate, bloodType, underlyingDisease, allergyName, medicationName } = user;
  
      // 메시지 생성
      const emergencyMessage = `이름: ${name}\n나이: ${birthdate}\n혈액형: ${bloodType}형\n특이사항: ${underlyingDisease}, ${allergyName}, ${medicationName} 복용중\n긴급상황입니다.`;
  
      // 생성한 메시지 반환
      return emergencyMessage;
    } catch (error) {
      // 에러 처리
      console.error('Error:', error.message);
      return null;
    }
  }