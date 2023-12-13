function insertBtnFunc(inputClassName, btnClassName, insertBoxName) {
    
    const btnElement = document.querySelector('.' + btnClassName);
    const inputElement = document.querySelector('.' + inputClassName);
    const insertBox = document.querySelector('.' + insertBoxName);

    btnElement.addEventListener('click', () => {
        const quickBtnText = inputElement.value.trim();
        const liList = insertBox.querySelectorAll('li');
        let exists = false;

        liList.forEach((li) => {
            const liSpanText = li.querySelector('span').innerText;
            if (liSpanText === quickBtnText) {
                exists = true;
                inputElement.value = '';
            }
        });

        if (!exists) {
            const createLi = document.createElement('li');
            createLi.innerHTML = `<span>${quickBtnText}</span><button type="button" class="xi-close del-btn"></button>`;
            insertBox.appendChild(createLi);
            inputElement.value = '';

            const delBtn = createLi.querySelector('.del-btn');
            delBtn.addEventListener('click', () => {
                insertBox.removeChild(createLi);

            });
        }
    });
} 

document.addEventListener('DOMContentLoaded', function () {
    function getListValues(listClassName) {
        const list = document.querySelector(`.${listClassName}`);
        if (list) {
            const listItems = list.querySelectorAll('li span');
            return Array.from(listItems).map(item => item.innerText);
        }
        return [];
    }
    
    function makePopup(popupMessage) {
        const message = document.getElementById('message');
        message.innerText = popupMessage;
        layerOn('register3Layer');
    }

    async function handleFormSubmission() {
        const sickListValues = getListValues('sickList');
        const allergyListValues = getListValues('allergyList');
        const medicineListValues = getListValues('medicineList');
        const guard_hp = document.getElementById('guard_hp').value.replace(/\D/g, '');
        const guard_rel = document.getElementById('guard_rel').value.trim();

        if (guard_hp.length !== 11) {
            makePopup(`[${guard_hp}]유효한 번호를 입력해주세요 (숫자 11자리)`);
            return;
        }

        if (guard_rel === '') {
            makePopup('보호자와의 관계를 입력해주세요');
            return;
        }
        
        const storedUserData = localStorage.getItem('userData');

        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            const newData = {};

            if (sickListValues.length > 0) newData.sickList = sickListValues;
            if (allergyListValues.length > 0) newData.allergyList = allergyListValues;
            if (medicineListValues.length > 0) newData.medicineList = medicineListValues;
            if (guard_hp.length > 10) newData.guard_hp = guard_hp;
            if (guard_rel !== '') newData.guard_rel = guard_rel;

            console.log(newData);
            console.log(userData);
            window.location.href = '../index.html';
        } else {
         //   makePopup('오류가 발생했습니다. 추가 정보 수정을 다시 진행해주세요');
        }
    }

    async function handleServerClientConnection() {
        const sickListValues = getListValues('sickList');
        const allergyListValues = getListValues('allergyList');
        const medicineListValues = getListValues('medicineList');
        const guard_hp = document.getElementById('guard_hp').value.replace(/[^0-9]/g, '');
        const guard_rel = document.getElementById('guard_rel').value.trim();
        const bloodInputs = document.querySelectorAll('input[name="bloodType"]');
        let bloodValue = '';

        let isBloodSelected = false;
        bloodInputs.forEach((el) => {
            if (el.checked) {
                bloodValue = el.value;
                isBloodSelected = true;
            }
        });

        if (!isBloodSelected) {
            makePopup('혈액형을 선택해주세요');
            return;
        }

        console.log('Sick List Values:', sickListValues);
        console.log('Allergy List Values:', allergyListValues);
        console.log('Medicine List Values:', medicineListValues);
        console.log('Guardian Phone Number:', guard_hp);
        console.log('Guardian Relationship:', guard_rel);

        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        console.log('UserId in user_register3:', userId);
        console.log('Token', token);

        try {
            const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app//auth/user/updateOther/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify({
                    guardianPhoneNumber: guard_hp,
                    guardianRelationship: guard_rel,
                    underlyingDisease: sickListValues,
                    allergy: allergyListValues,
                    medication: medicineListValues,
                    bloodType: bloodValue
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Server Response:', data);
                window.location.href = '../index.html';
            } else {
                const errorMessage = await response.text();
                console.error('Server Error:', errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const submitFormButton = document.getElementById('submitForm');
    if (submitFormButton) {
        submitFormButton.addEventListener('click', handleFormSubmission);
    }

    const updateOtherForm = document.getElementById('submitForm');
    if (updateOtherForm) {
        updateOtherForm.addEventListener('click', handleServerClientConnection);
    }
});

// 회원 정보 기본값으로 넣어주기
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app//auth/user/detail/${userId}`, {
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
        // Handle the user data here
        console.log('User Data:', user);

        // Extract specific information
        const underlyingDisease = user.user.underlyingDisease;
        const allergy = user.user.allergy;
        const medication = user.user.medication;
        const guardianPhoneNumber = user.user.guardianPhoneNumber;
        const guardianRelationship = user.user.guardianRelationship;
        const bloodType = user.user.bloodType;
        
        const Is_A = document.getElementById('bloodType_A'); 
        const Is_B = document.getElementById('bloodType_B'); 
        const Is_O = document.getElementById('bloodType_O'); 
        const Is_AB = document.getElementById('bloodType_AB'); 
        
        if (bloodType === 'O') {
            Is_O.checked = true;
        } else if (bloodType === 'A') {
            Is_A.checked = true;
        } else if (bloodType === 'B') {
            Is_B.checked = true;
        } else {
            Is_AB.checked = true;
        }

        console.log('혈액형:', bloodType);
        console.log('기저질환:', underlyingDisease);
        console.log('알러지:', allergy);
        console.log('복용약:', medication); 
        console.log('보호자 전화번호:', guardianPhoneNumber); 
        console.log('보호자 관계:', guardianRelationship); 
        
        let data = {
            "Sick" : underlyingDisease,
            "Allergy" : allergy,
            "Medicine" : medication,
            "GuardHp" : guardianPhoneNumber,
            "GuardRel" : guardianRelationship
        };

    const originGuardHp = data.GuardHp
    const originGuardRel = data.GuardRel

    const inputGuardHp = document.getElementById('guard_hp')
    const inputGuardRel = document.getElementById('guard_rel')

    inputGuardHp.value = originGuardHp
    inputGuardRel.value = originGuardRel
    
    insertBtnFunc('inputSick', 'btnSick', 'sickList', data.Sick);
    insertBtnFunc('inputAllergy', 'btnAllergy', 'allergyList', data.Allergy);
    insertBtnFunc('inputMedicine', 'btnMedicine', 'medicineList', data.Medicine);

    // 맨처음 질병버튼 추가하고 이벤트리스너 발생함수
    function insertBtnFunc(inputClassName, btnClassName, insertBoxName, data) {
        const btnElement = document.querySelector('.' + btnClassName);
        const inputElement = document.querySelector('.' + inputClassName);
        const insertBox = document.querySelector('.' + insertBoxName);
        
        if (data === undefined) { } 
        else {
        data.forEach(item => {
            const createLi = document.createElement('li');
            createLi.innerHTML = `<span>${item}</span><button type="button" class="xi-close del-btn"></button>`;
            insertBox.appendChild(createLi);

            const delBtn = createLi.querySelector('.del-btn');
            delBtn.addEventListener('click', () => {
                insertBox.removeChild(createLi);
            });
        });
    }

    btnElement.addEventListener('click', () => {
        const quickBtnText = inputElement.value.trim();

        const liList = insertBox.querySelectorAll('li');
        let exists = false;

        liList.forEach((li) => {
            const liSpanText = li.querySelector('span').innerText;
            if (liSpanText === quickBtnText) {
                exists = true;
                inputElement.value = '';
            }
        });

        if (!exists) {
            const createLi = document.createElement('li');
            createLi.innerHTML = `<span>${quickBtnText}</span><button type="button" class="xi-close del-btn"></button>`;
            insertBox.appendChild(createLi);
            inputElement.value = '';

            const delBtn = createLi.querySelector('.del-btn');
            delBtn.addEventListener('click', () => {
                insertBox.removeChild(createLi);
            });
        }
    });
} 
})
    .catch(error => {
        console.error('Error:', error);
    
    });


