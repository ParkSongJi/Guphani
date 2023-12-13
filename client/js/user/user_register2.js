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

let [idBool, pwBool, nameBool, birthBool] = [false,false,false,false]

// 팝업멘트 만들고 이벤트 발생시키는 코드
function makePopup(popupMessage){
    const message = document.getElementById('message');
    message.innerText = popupMessage;

    // 팝업창 열기
    layerOn('register2Layer');
}

function validatePhoneNumber(phoneNumber) {
    const sanitizedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    return sanitizedPhoneNumber.length >= 10 && sanitizedPhoneNumber.length <= 11;
}

idCheck.addEventListener('click', async () => {
    const useridInput = document.getElementById('userid');
    const userId = useridInput.value.trim();
    let popupMessage;

    // 정규표현식을 사용하여 아이디 검증
    const idPattern = /^[a-z][a-z0-9]{3,11}$/;
    const isValidId = idPattern.test(userId);

    try {
        const response = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/duplicateIdTest', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            // If the response is successful, parse the JSON
            const data = await response.json();
            allUserIds = data.map(user => user.id);
        } else {
            throw new Error('Failed to fetch user IDs');
        }
    } catch (error) {
        console.error('Error fetching user IDs:', error);
        // Handle the error, show a message, or perform other actions
        return;
    }

    // 중복확인 -> 추후에 조정 필요
    // Check if the array includes the userId
    const isDuplicate = allUserIds.some(user => user === userId);

    // 팝업창에 표시될 메시지
    if (userId === '') {
        popupMessage = '아이디를 입력해주세요.';
    } else if (isDuplicate) {
        popupMessage = '중복된 아이디입니다.';
        useridInput.value = '';
    } else if (!isValidId) {
        popupMessage = '아이디 형식에 맞지 않습니다';
        useridInput.value = '';
    } else {
        popupMessage = `아이디 ${userId}는 사용 가능합니다`;
        useridInput.disabled = true;
        idBool = true;
    }
    makePopup(popupMessage);
});



//아이디 검증
const idInput = document.getElementById('userid')

idInput.addEventListener('input',() => {

    const userId = idInput.value.trim()
    localStorage.setItem('userId', userId);

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

// 휴대전화 인증 문자부분
hpCheck.addEventListener('click', async function(event) {
    event.preventDefault()
    const hp = document.getElementById('hp').value.replace(/[^0-9]/g, '')
    if(hp.length < 10 || hp.length > 11){
        makePopup('번호를 확인해주세요')
    }else{
        const phnumber = document.getElementById('hp').value;
        try {
            // phnumber로 인증번호 전송
            const response = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/sendVerification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  
                },
                body: JSON.stringify({ phnumber: phnumber})
            });
            if (response.status === 200) {
                document.querySelector('.hp-check').style.display ='flex'
                document.getElementById('hp').disabled = 'true'
                makePopup('인증번호 전송 되었습니다. 최대 5분 정도 걸릴 수 있습니다..')
            }else{
                makePopup('인증번호 전송에 실패했습니다.')
            }  
        }catch(error){
            makePopup('인증번호 전송에 실패했습니다.')
}
        
hpCheckNumber.addEventListener('click',async function(event) {
    event.preventDefault();
    const phnumber = `${document.getElementById('hp').value}`;
    const inputVerificationCode = `${document.getElementById('verficateCode').value}`;
    
    try{
        const response = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/verifyCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phnumber, verificationCode: inputVerificationCode})
        });
        if (response.status === 200) {
            // 인증이 성공하면 인증받기 -> 인증완료로 바뀌고 버튼 기능 사라짐
            hpCheck.textContent = '인증완료';
            hpCheck.disabled = true;
            // 인증이 성공하면 인증번호 입력칸, 인증버튼 숨김
            document.getElementById('verification').style.display='none'; 
            makePopup('인증 성공')
        }else{
            makePopup('인증 실패')
        }
    }catch (error) {
        makePopup('인증 실패')
    }
        })
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const signUpForm = document.getElementById('signUpForm');

    if (signUpForm) {
        signUpForm.addEventListener('click', async () => {
            const userId = document.getElementById('userid').value;
            const userPw = document.getElementById('userpw').value;
            const userName = document.getElementById('username').value;
            const birthday = document.getElementById('birthday').value;
            const genderInputs = document.querySelectorAll('input[name="gender"]');
            let genderValue = '';
            
            // Check if a gender option is selected
            let isGenderSelected = false;
            genderInputs.forEach((el) => {
                if (el.checked) {
                    genderValue = el.value;
                    isGenderSelected = true;
                }
            });

            // Display a pop-up if gender is not selected
            if (!isGenderSelected) {
                makePopup('성별을 선택해주세요');
                return;
            }

            try {
                // Validate phone number
                const phoneNumber = document.getElementById('hp').value;
                const isValidPhoneNumber = validatePhoneNumber(phoneNumber);
                if (!isValidPhoneNumber) {
                    makePopup('휴대폰 번호를 확인해주세요');
                    return;
                }

                // Check other conditions before sending data to the server
                if (!idBool) {
                    makePopup('아이디 중복확인을 해주세요');
                    return;
                }

                if (!pwBool) {
                    makePopup('비밀번호를 확인해주세요');
                    return;
                }

                if (!nameBool) {
                    makePopup('이름을 확인해주세요');
                    return;
                }

                if (!birthBool) {
                    makePopup('생년월일을 확인해주세요');
                    return;
                }

                // If all conditions are met, send data to the server
                const response = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/signUp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: userId,
                        password: userPw,
                        name: userName,
                        birthdate: birthday,
                        gender: genderValue,
                        phoneNumber: phoneNumber,
                    }),
                });

                const data = await response.json();
                console.log(data);

                // Check for a successful response from the server
                if (response.ok) {
                    const userData = {
                        userId: userId,
                        userPw: userPw,
                        userName: userName,
                        userBirth: birthday,
                        userHp: phoneNumber,
                        userGender: genderValue,
                    };

                    console.log(userData);
                    window.location.href = 'register3.html';
                } else {
                    // Handle an error response from the server
                    makePopup('서버에서 오류가 발생했습니다.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

});
