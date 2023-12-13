const findIdBtn = document.getElementById('findIdBtn')
const pwCheck = document.getElementById('newPw');
const pwDoubleCheck = document.getElementById('newPwCheck');

//popup 발생이벤트
function makePopup(popupMessage){
    const message = document.getElementById('message');
    message.innerText = popupMessage;

    // 팝업창 열기
    layerOn('register2Layer');
}
function maskUserId(userId) {
    const maskLength = Math.floor(userId.length / 3) + 1;
    const startIndex = Math.ceil((userId.length - maskLength) / 2);
    
    const maskedUserId =
        userId.substring(0, startIndex) +
        '*'.repeat(maskLength) +
        userId.substring(startIndex + maskLength);

    return maskedUserId;
}

findIdBtn.addEventListener('click',()=>{
    const inputName = document.getElementById('username').value
    const inputHp = document.getElementById('findid-userhp').value.replace(/[^0-9]/g, '')
    
    const userName = '김사과'
    const userHp = '01011111111'
    if(inputName === '' || inputHp === ''){
        makePopup('이름과 전화번호를 모두 입력해주세요')
    }else if(userName === inputName &&  userHp === inputHp ){
        //여기에 db에 있는 이름과 비번이 일치하면 아이디를 리턴하는 기능을 넣어주세요
        // 지금은 임시로 김사과 010-1111-1111으로 하고 matchName을 만들어놓을게요
        const userId = 'apple'
        const maskedUserId = maskUserId(userId);
        makePopup(`아이디는 ${maskedUserId}입니다`);
    }else{
        makePopup(`일치하는 사용자가 없습니다`)
        document.getElementById('username').value = ''
        document.getElementById('findid-userhp').value = ''
    }

})


// 비밀번호 찾기 버튼을 클릭했을 때의 이벤트 리스너
document.getElementById('findpw-onestepBtn').addEventListener('click', function() {
    // 입력된 아이디와 전화번호 가져오기
    const inputId = document.getElementById('userid').value;
    const inputHp = document.getElementById('findpw-onetwostep').value.replace(/[^0-9]/g, '');
    //샘플 아이디와 전화번호 추후에 db데이터로 바꿔주세요
    const userId = 'apple'; // 
    const userHp = '01011111111';
    

    // 입력이 비어 있는 경우 팝업으로 오류 메시지 표시
    if(inputId === '' || inputHp === ''){
        makePopup('아이디와 전화번호를 모두 입력해주세요');
    } else if (inputId === userId && inputHp === userHp) {
        // 아이디, 전화번호 입력 창 숨기고, 인증번호 입력 창 보이기
        document.getElementById('findpw-onetwostep').value = inputHp; 
        document.getElementById('findpw-onetwostep').disabled = true; 

        Array.from(document.getElementsByClassName('findpw-onestep')).forEach(function(element) {
            element.style.display = 'none';
        });
        
        Array.from(document.getElementsByClassName('findpw-twostep')).forEach(function(element) {
            element.style.display = 'block';
        });
        // 인증확인 버튼을 클릭했을 때의 이벤트 리스너
        document.getElementById('findpw-twostepBtn').addEventListener('click', function() {
            // 입력된 인증번호 가져오기
            const inputAuthCode = document.getElementById('findpw-twostep').value;
            // 샘플 인증번호
            const authCode = '111111'; 
            // 입력된 인증번호와 샘플 인증번호 비교
            if (inputAuthCode === authCode) {
                // 인증번호 확인 성공 메시지 표시

                Array.from(document.getElementsByClassName('findpw-onetwostep')).forEach(function(element) {
                    element.style.display = 'none';
                });
                Array.from(document.getElementsByClassName('findpw-twostep')).forEach(function(element) {
                    element.style.display = 'none';
                });
                Array.from(document.getElementsByClassName('findpw-threestep')).forEach(function(element) {
                    element.style.display = 'block';
                });
                
                // 비밀번호 재설정 버튼을 클릭했을 때의 이벤트 리스너
                document.getElementById('resetPwBtn').addEventListener('click', function() {
                    const userpwInput = document.getElementById('newPw').value.trim();
                    const userpwInputAgain = document.getElementById('newPwCheck').value.trim();
                    const pwPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{6,20}$/;
                    const isValidPw = pwPattern.test(userpwInput);
                    if(!isValidPw){
                        makePopup('비밀번호 양식을 확인해주세요')
                    }else if(userpwInput !== userpwInputAgain){
                        makePopup('비밀번호가 일치하지 않습니다')
                    }else{
                        // 여기에서 userpwInput으로 비밀번호 변경해주세요!
                        // 재설정 완료 페이지로 이동
                        window.location.href = 'finishChangePw.html'
                    }
                    
                });

            } else {
                // 인증번호 확인 실패 메시지 표시
                makePopup('인증번호가 일치하지 않습니다.');
            }
        });
    } else {
        // 오류 메시지 표시
        makePopup('일치하는 사용자가 없습니다.');
    }
});




//비밀번호 양식 검증
pwCheck.addEventListener('input', () => {
    const userpwInput = document.getElementById('newPw').value.trim();

    // 정규표현식을 사용하여 비밀번호 검증
    const pwPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{6,20}$/;
    const isValidPw = pwPattern.test(userpwInput);

    // 팝업창에 표시될 메시지
    if (!isValidPw) {
        document.getElementById('pw_info').style.display = 'block'
    } else {
        document.getElementById('pw_info').style.display = 'none'
    }
});

// 비밀번호 확인 검증
pwDoubleCheck.addEventListener('input', () => {
    const userpwInput = document.getElementById('newPw').value.trim()
    const userpwInputAgain = document.getElementById('newPwCheck').value.trim()
    // const userpwCheckInput = document.getElementById('userpw_check');

    // 팝업창에 표시될 메시지
    if (userpwInput !== userpwInputAgain) {
        console.log('NoMatch');
        document.getElementById('pwCheck_info').style.display = 'block'
        document.getElementById('resetPwBtn').style.marginBottom = '0'
    } else {
        console.log('Match');
        document.getElementById('pwCheck_info').style.display = 'none'
        
    }
    if(userpwInputAgain===''){
        document.getElementById('pwCheck_info').style.display = 'none'
    }
});