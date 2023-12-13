const userId = localStorage.getItem('userId');
const userIdInput = document.getElementById('userid');
const changeAndNextBtn = document.getElementById('changeAndNextBtn')
const hpBtn = document.getElementById('hpBtn')
const hpCheck = document.getElementById('hpCheck')
const hpCheckBtn = document.getElementById('hpCheckBtn')
const changeBtn = document.getElementById('submitForm')

let [nameBool, pwBool, birthBool, hpBool] = [false,false, false,false]

function checkChange(stopbool) {
    // 일단 지금은 비워둠
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

// 수정 사항 저장 후 추가 정보 수정 페이지로 이동 

const goNext = document.getElementById('goNext')
goNext.addEventListener('click',() =>{
    window.location.href = 'updateUserInfo2.html'
}); 

const closePopup2 = document.getElementById('closePopup2')
closePopup2.addEventListener('click',() =>{
    location.reload()
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

// 추가정보 수정
changeAndNextBtn.addEventListener('click',()=>{
        window.location.href = 'updateUserInfo2.html'
    
});

// 수정사항 저장
changeBtn.addEventListener('click', () => {
    const result = checkChange(true);
    if (!result) {
        makePopup2('수정되었습니다');
    }
});

if (userIdInput) {
    userIdInput.value = userId;
}

const token = localStorage.getItem('token');

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app:8080/auth/user/detail/${userId}`, {
    method: 'GET',
    headers: headers,
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(user => {
        console.log('User Data:', user);

        const name = user.user.name;
        const birthdate = user.user.birthdate;
        const gender = user.user.gender;
        const phoneNumber = user.user.phoneNumber;

        console.log('Name:', name);
        console.log('Birthdate:', birthdate);
        console.log('Gender:', gender);
        console.log('Phone Number:', phoneNumber);

        const originName = document.getElementById('name');
        const originBirth = document.getElementById('birthdate');
        const originHp = document.getElementById('phoneNumber');
        const originGender = document.getElementById('gender');
        const IsMale = document.getElementById('male');
        const IsFemale = document.getElementById('female');

        if (originName) originName.textContent = name;
        if (originBirth) originBirth.textContent = birthdate;
        if (originHp) originHp.textContent = phoneNumber;
        if (originGender) originGender.textContent = gender;
        
        // 회원가입할 때 입력한 기본 값을 텍스트 박스 안에 디폴트로 넣어줌 
        if (originName) {
            originName.value = name;
        }
        if (originBirth) {
            originBirth.value = birthdate; 
        }
        if (originHp) {
            originHp.value = phoneNumber; 
        }
        if (gender && gender === 'female') {
            IsFemale.checked = true;
        } else {
            IsMale.checked = true 
        }

        // 이름 받아오기 -> 다음 눌렀을때만 검증해서 팝업에 안내문구 뜨게
        const nameInput = document.getElementById('name');

        nameInput.addEventListener('input', () => {
            // Get the value of the name input
            const name = nameInput.value.trim();
    
            // 추가된 조건: 한국어일 경우 한글만, 영어일 경우 영어만 허용
            const isKorean = /^[가-힣]+$/.test(name);
            const isEnglish = /^[a-zA-Z]+$/.test(name);
    
            // 조건을 만족하면서 추가된 조건도 충족하면 nameBool을 true로, 그렇지 않으면 false로 설정
            nameBool = (isKorean && !isEnglish) || (!isKorean && isEnglish);
            
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.addEventListener('DOMContentLoaded', function () {
    
        async function handleServerClientConnection() {
            const userName = document.getElementById('name').value;
            const userGender = document.querySelector('input[name="gender"]:checked').value;
            const userBirthdate = document.getElementById('birthdate').value;
            const userPhoneNumber = document.getElementById('phoneNumber').value;

    
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
    
            try {
                const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app:8080/auth/user/updateMain/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: userName,
                        gender: userGender,
                        birthdate: userBirthdate,
                        phoneNumber: userPhoneNumber
                    }),
                });
    
                if (response.ok) {
                    const data = await response.json();
                    console.log('Server Response:', data);
    
                } else {
                    const errorMessage = await response.text();
                    console.error('Server Error:', errorMessage);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    
        const updateOtherForm = document.getElementById('submitForm');
        if (updateOtherForm) {
            updateOtherForm.addEventListener('click', handleServerClientConnection);
        }
    });