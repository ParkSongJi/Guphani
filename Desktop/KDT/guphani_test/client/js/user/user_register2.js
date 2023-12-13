// 아이디 검증

const idCheck = document.getElementById('idCheck')
const pwCheck = document.getElementById('userpw');
const pwDoubleCheck = document.getElementById('userpw_check');
const birthCheck = document.getElementById('birthday');
const username = document.getElementById('username');
const hp = document.getElementById('hp');
const hpBtn = document.getElementById('hpBtn')
const hpCheck = document.getElementById('hpCheck');
const hpCheckBtn = document.getElementById('hpCheckBtn')
const submitForm = document.getElementById('submitForm');

let [idBool, pwBool, nameBool, birthBool, hpBool] = [false,false,false,false,false]

// 팝업멘트 만들고 이벤트 발생시키는 코드
function makePopup(popupMessage){
    const message = document.getElementById('message');
    message.innerText = popupMessage;

    // 팝업창 열기
    layerOn('register2Layer');
}

idCheck.addEventListener('click',()=>{
    const useridInput = document.getElementById('userid');
    const userId = useridInput.value.trim();
    let popupMessage;
    // 아이디 입력값이 비어있는 경우

    // 정규표현식을 사용하여 아이디 검증
    const idPattern = /^[a-z][a-z0-9]{3,11}$/;
    const isValidId = idPattern.test(userId);

    // 중복확인 -> 추후에 조정 필요
    const isDuplicate = '반하나'

    // 팝업창에 표시될 메시지
    if(userId === ''){
        popupMessage = '아이디를 입력해주세요.'
    } else if (userId  === isDuplicate) {
        popupMessage = '중복된 아이디입니다.';
        useridInput.value = ''
    } else if(!isValidId) {
        popupMessage = '아이디 형식에 맞지 않습니다';
        useridInput.value = '';        
    } else{
        popupMessage = `아이디 ${userId}는 사용 가능합니다`;
        useridInput.disabled = true; 
        idBool = true
    }
    makePopup(popupMessage)

})

//아이디 검증
const idInput = document.getElementById('userid')
idInput.addEventListener('input',() => {
    const userId = idInput.value.trim()
    const idPattern = /^[a-z][a-z0-9]{3,11}$/;
    const isValidId = idPattern.test(userId);
    if(isValidId){
        document.getElementById('id_info').style.display = 'none'
    }else{
        document.getElementById('id_info').style.display = 'block'
    }
})


//비밀번호 양식 검증
pwCheck.addEventListener('input', () => {
    const userpwInput = document.getElementById('userpw');
    const userpw = userpwInput.value.trim();

    // 정규표현식을 사용하여 비밀번호 검증
    const pwPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{6,20}$/;
    const isValidPw = pwPattern.test(userpw);

    // 팝업창에 표시될 메시지
    if (!isValidPw) {
        document.getElementById('pw_info').style.visibility = 'visible'
    } else {
        document.getElementById('pw_info').style.visibility = 'hidden'
    }
});
// 비밀번호 확인 검증
pwDoubleCheck.addEventListener('input', () => {
    const userpwInput = document.getElementById('userpw');
    const userpwInputAgain = document.getElementById('userpw_check');
    const checkBox = document.getElementById('xi-check-circle');
    // const userpwCheckInput = document.getElementById('userpw_check');
    const userpw = userpwInput.value.trim();
    const userpwAgain = userpwInputAgain.value.trim();

    // 팝업창에 표시될 메시지
    if (userpw == userpwAgain) {
        document.getElementById('pwCheck_info').style.display = 'none'
        userpwInput.disabled = true;
        userpwInputAgain.disabled = true; 
        checkBox.classList.add('on')
        pwBool = true
    } else {
        document.getElementById('pwCheck_info').style.display = 'block'
    }
});

// 이름 받아오기 -> 다음 눌렀을때만 검증해서 팝업에 안내문구 뜨게
username.addEventListener('input',()=>{
    const username = document.getElementById('username').value.trim()
    const namePattern = /^[가-힣a-zA-Z]+$/;
    const isValidName = namePattern.test(username);
    nameBool = isValidName

})

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
// 생일 받아오기 -> 다음 눌렀을때만 검증해서 팝업에 안내문구 뜨게
birthCheck.addEventListener('input',()=>{
    const birthPatternCheckResult = birthPatternCheck()
    if (!birthPatternCheckResult){
        document.getElementById('hiddenBirth').style.display ='block'
        birthBool = false
    } else{
        document.getElementById('hiddenBirth').style.display ='none'
        birthBool = true
    }
})

// 상윤님이 해주실 부분
hpBtn.addEventListener('click',()=>{
    const hp = document.getElementById('hp').value.replace(/[^0-9]/g, '')
    if(hp.length < 10 || hp.length > 11){
        makePopup('번호를 확인해주세요')
        hpBool = false
    }else{
        document.querySelector('.hp-check').style.display ='flex'
        document.getElementById('hp').disabled = 'true'
        hpCheckBtn.addEventListener('click',()=>{
            const input6Number = document.querySelector('.input6Number')
        // 여기에서 해주시면 됩니다 input6Number가 사용자가 입력한 인증번호6자리에요
        // 인증성공하면 hpBool = true로 해주세요
            makePopup('인증 성공했습니다')
            hpBool = true
        })
    }
})


// 다음버튼 누를때 
submitForm.addEventListener('click',()=>{
    //성별검증
    const gender = document.querySelectorAll('input[type="radio"]')
    let genderValue = ''
    gender.forEach((el)=>{
        if(el.checked){
            genderValue = el.value
        }
    })
    
    if(!idBool){
        makePopup('아이디 중복확인을 해주세요')
    }else if(!pwBool){
        makePopup('비밀번호를 확인해주세요')
    }else if(!nameBool){
        makePopup('이름을 확인해주세요')
    }else if(!birthBool){
        makePopup('생년월일을 확인해주세요')
    }else if(!hpBool){
        makePopup('휴대폰 번호 인증을 해주세요')
    }else if( genderValue !== 'male' && genderValue !== 'female'){
        makePopup('성별을 선택해주세요')
        console.log(genderValue),'error';
    }else{
        console.log(genderValue);
        // 현재 페이지에서 필요한 데이터를 딕셔너리로 만들어서 다음페이지에 전달합니다
        // 지금은 이런 형식이지만 나중에 백앤드할때 비밀번호 암호화하거나 다른 방식으로 해주세요
        const userData = {
            userId: userId,
            userPw: userpwAgain,
            userName: username,
            userBirth: birthday,
            userHp: hp,
            userGender: document.querySelector('input[type="radio"]:checked').value
        };

        // 딕셔너리 확인
        console.log(userData);
        // localStorage.setItem('userData', JSON.stringify(userData));
        window.location.href = 'register3.html';

    }

})






