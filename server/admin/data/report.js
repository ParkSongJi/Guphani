import {User} from './auth.js'

export async function generateEmergencyMessage(id) {
  try {
    // MongoDB에서 id를 사용하여 유저 정보를 찾음.
    const user = await User.findOne({ id: id });
    let emergencyMessage = '';

    if (user) {
      if (user.name) {
        emergencyMessage += `이름: ${user.name} /`;
      }
      if (user.birthdate) {
        emergencyMessage += `생년월일: ${user.birthdate} /`;
      }
      if (user.bloodType) {
        emergencyMessage += `혈액형: ${user.bloodType}형 /`;
      }
      // underlyingDisease가 값이 비어있는데 기저질환: 이 메시지에 포함되는 현상이 나타나서 length 조건 추가
      if (user.underlyingDisease && user.underlyingDisease.length > 0) {
        emergencyMessage += `기저질환: ${user.underlyingDisease.join(', ')} /`;
      }
      if (user.allergy && user.allergy.length > 0) {
        emergencyMessage += `알러지: ${user.allergy.join(', ')} /`;
      }
      if (user.medication && user.medication.length > 0) {
        emergencyMessage += `복용약: ${user.medication.join(', ')} /`;
      }
    }
    emergencyMessage += '긴급상황입니다.'

    // 생성한 메시지 반환
    return emergencyMessage;
  } catch (error) {
    // 에러 처리
    console.error('Error:', error.message);
    return null;
  }
}
