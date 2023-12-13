const userId = document.getElementById('userid')
const hp = document.getElementById('hp')
const hpBtn = document.getElementById('hpBtn')
const hpCheck = document.getElementById('hpCheck')
const hpCheckBtn = document.getElementById('hpCheckBtn')
const birthCheck = document.getElementById('birthday');
const userName = document.getElementById('username');
const changeBtn = document.getElementById('submitForm')
const changeAndNextBtn = document.getElementById('changeAndNextBtn')
//마이페이지는 기본적으로 사용자 정보를 받아서 출력해줌
//여기서 받아온다고 가정해서 작성하겠습니다
const [originuserId, originName, originBirth, originHp, originGender] = ['apple','김사과','20000101','01011111111','female']
//얘는 다음눌렀을때 검증용


let [nameBool, birthBool, hpBool] = [false,false,false]

// 사용자 아이디받아와서 출력
// 지금은 그냥 apple로 받기
userId.value = originuserId
// 이름 받아오기 -> 다음 눌렀을때만 검증해서 팝업에 안내문구 뜨게

userName.value = originName
userName.addEventListener('input', () => {
    const username = document.getElementById('username').value.trim();

    // 추가된 조건: 한국어일 경우 한글만, 영어일 경우 영어만 허용
    const isKorean = /^[가-힣]+$/.test(username);
    const isEnglish = /^[a-zA-Z]+$/.test(username);

    // 조건을 만족하면서 추가된 조건도 충족하면 nameBool을 true로, 그렇지 않으면 false로 설정
    nameBool = (isKorean && !isEnglish) || (!isKorean && isEnglish);
});


// 생일 받아오기 -> 다음 눌렀을때만 검증해서 팝업에 안내문구 뜨게
birthCheck.value = originBirth
document.getElementById('hiddenBirth').style.display ='none'
birthCheck.addEventListener('input',()=>{
    const birthPatternCheckResult = birthPatternCheck()
    if (!birthPatternCheckResult || birthCheck.value === originBirth){
        document.getElementById('hiddenBirth').style.display ='block'
        birthBool = false
    } else{
        document.getElementById('hiddenBirth').style.display ='none'
        birthBool = true
    }
})

//사용자 전화번호 
hp.value = originHp
// 상윤님이 해주실 부분 - 인증번호 받기 및 검증
hpBtn.addEventListener('click',()=>{
    const hpInput = hp.value.replace(/[^0-9]/g, '')
    if(originHp === hpInput ){
        makePopup('고객님의 현재 번호입니다.')
    }else if(hpInput === ''){
        makePopup('핸드폰 번호를 입력해주세요')
        hpBool = false
    }else if(hpInput.length < 10 || hpInput.length > 11){
        makePopup('번호를 확인해주세요')
        hpBool = false
    }else{
        document.querySelector('.hp-check').style.display ='flex'
        document.getElementById('hp').disabled ='true'
        hpCheckBtn.addEventListener('click',()=>{
            const input6Number = document.querySelector('.input6Number').value
        // 여기에서 해주시면 됩니다 input6Number가 사용자가 입력한 인증번호6자리에요
        // 인증성공하면 hpBool = true로 해주세요
            makePopup('인증 성공했습니다')
            hpBool = true
        })
    }
})

//성별은 값 받아와서 checked 추가
//여기선 그냥 여자라고 설정
const IsMale = document.getElementById('male')
const IsFemale = document.getElementById('female')
//맨처음화면 셋팅
if(originGender === 'female'){
    IsFemale.checked = true
}else{
    IsMale.checked = true
}

// 수정사항 저장버튼
changeBtn.addEventListener('click',()=>{
    if(checkChange(true) ? !checkChange(true) : false){
        makePopup2('수정되었습니다')
    }
    

})
// 추가정보 수정
changeAndNextBtn.addEventListener('click',()=>{
    if(!(checkChange(false) ? true : false)){
        window.location.href = 'updateUserInfo2.html'
        
    }else{
        console.log(checkChange(false) ? true : false);
        makePopup2('수정사항을 아직 저장하지 않았습니다')
    }
})


// 생년월일 검증함수
function birthPatternCheck(){
    const birthday = document.getElementById('birthday').value.trim()
    const birthPattern = /^[0-9]{8}$/;
    let isValidBirth = birthPattern.test(birthday);
    if(isValidBirth){
        if(birthday <= 19000000 || birthday >= 20500000 ){
            isValidBirth = false
            birthBool = false
        }
        
    }
    return isValidBirth
}

// 수정된거 있는지 확인하는 함수
function checkChange(stopbool) {
    const gender = document.querySelectorAll('input[type="radio"]')
    hpInput = hp.value.replace(/[^0-9]/g, '')
    let genderValue = ''
    gender.forEach((el)=>{
        if(el.checked){
            genderValue = el.value
        }
    })
    if(userName.value.trim() === originName && birthday.value.trim() === originBirth && genderValue === originGender && hpInput === originHp){
        if(stopbool){
            makePopup('변경된 정보가 없습니다') 
            return false
        } return false
    }else if(birthday.value !== originBirth && !birthBool){
        makePopup('생년월일 양식에 맞게 입력해주세요')
    }else if(userName.value !== originName && !nameBool){
        makePopup('이름을 확인해주세요')
        //hpBool가 false이고 기존이랑 같을때 + hpBool이 true일때
    }else if (hpInput === originHp) {
        hpBool = true;
        const NewInfo = {
            userId,
            userName,
            userBirth: birthday.value.trim(),
            userHp: hpInput,
            userGender: genderValue
        };
        
        makePopup2('수정되었습니다')
        //여기서 업데이트하면 됩니다
        return true
    }else if(!hpBool){
        makePopup('전화번호 인증을 완료해주세요')
    }else{
        const NewInfo = {
            userId,
            userName,
            userBirth: birthday.value.trim(),
            userHp: hpInput,
            userGender: genderValue
        };
        
        makePopup2('수정되었습니다')
        //여기서 업데이트하면 됩니다
        return true
    }
}


//팝업생성
// 팝업멘트 만들고 이벤트 발생시키는 코드
function makePopup(popupMessage){
    const message = document.getElementById('message');
    message.innerText = popupMessage;

    // 팝업창 열기
    layerOn('updateUserInfoLayer');

}
// 수정사항 저장용 버튼
function makePopup2(popupMessage){
    const message = document.getElementById('message1');
    message.innerText = popupMessage;

    // 팝업창 열기
    layerOn('goUpdateUserInfo2Layer');

}

const goNext = document.getElementById('goNext')
goNext.addEventListener('click',() =>{
    window.location.href = 'updateUserInfo2.html'
})

const closePopup2 = document.getElementById('closePopup2')
closePopup2.addEventListener('click',() =>{
    location.reload()
})
