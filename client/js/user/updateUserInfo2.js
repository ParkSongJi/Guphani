function insertBtnFunc(inputClassName, btnClassName, insertBoxName) {
    try {
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
    } catch (error) {
        console.error('에러:', error.message);
    }
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
        try {
            const sickListValues = getListValues('sickList');
            const allergyListValues = getListValues('allergyList');
            const medicineListValues = getListValues('medicineList');
            const guard_hp = document.getElementById('guard_hp').value.replace(/\D/g, '');
            const guard_rel = document.getElementById('guard_rel').value.trim();
            const storedUserData = localStorage.getItem('userData');
            // console.log(guard_hp.length);
            if (guard_hp.length < 11 && guard_hp.length >= 1) {
                makePopup(`숫자 11자리로 이루어진 유효한 번호를 입력해주세요 `);
                return;
            } else if (guard_hp.length !== 0 && guard_rel === '') {
                makePopup('보호자와의 관계를 입력해주세요');
                return;
            } else if (storedUserData) {
                const userData = JSON.parse(storedUserData);
                const newData = {};

                if (sickListValues.length > 0) newData.sickList = sickListValues;
                if (allergyListValues.length > 0) newData.allergyList = allergyListValues;
                if (medicineListValues.length > 0) newData.medicineList = medicineListValues;
                if (guard_hp.length > 10) newData.guard_hp = guard_hp;
                if (guard_rel !== '') newData.guard_rel = guard_rel;

                console.log(newData);
                console.log(userData);
                handleServerClientConnection();
            } else {
                makePopup('오류가 발생했습니다. 추가 정보 수정을 다시 진행해주세요');
            }
        } catch (error) {
            console.error('에러:', error.message);
        }
    }

    async function handleServerClientConnection() {
        try {
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

            console.log('Sick List Values:', sickListValues);
            console.log('Allergy List Values:', allergyListValues);
            console.log('Medicine List Values:', medicineListValues);
            console.log('Guardian Phone Number:', guard_hp);
            console.log('Guardian Relationship:', guard_rel);

            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            console.log('UserId in user_register3:', userId);
            console.log('Token', token);

            if (JSON.stringify(sickListValues) === JSON.stringify(OriginUnderlyingDisease) &&
                JSON.stringify(OriginAllergy) === JSON.stringify(allergyListValues) &&
                JSON.stringify(OriginMedication) === JSON.stringify(medicineListValues)) {
                return makePopup('변경된 정보가 없습니다');
            }

            const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/updateOther`, {
                
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: userId,
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
                location.reload();
            } else {
                const errorMessage = await response.text();
                console.error('Server Error:', errorMessage);
            }
        } catch (error) {
            console.error('에러:', error.message);
        }
    }

    const submitFormButton = document.getElementById('submitForm');
    if (submitFormButton) {
        submitFormButton.addEventListener('click', handleFormSubmission);
    }
});

// 회원 정보 기본값으로 넣어주기
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

let OriginUnderlyingDisease
let OriginAllergy 
let OriginMedication 
let OriginGuardianPhoneNumber 
let OriginGuardianRelationship
let OriginBloodType 


fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/detail/${userId}`, {
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
        const guardianPhoneNumber = user.user.guardianPhoneNumber !== undefined ? user.user.guardianPhoneNumber : '';
        const guardianRelationship = user.user.guardianRelationship !== undefined ? user.user.guardianRelationship : '';
        const bloodType = user.user.bloodType;

        OriginUnderlyingDisease = user.user.underlyingDisease;
        OriginAllergy = user.user.allergy;
        OriginMedication = user.user.medication;
        OriginGuardianPhoneNumber = user.user.guardianPhoneNumber !== undefined ? user.user.guardianPhoneNumber : '';
        OriginGuardianRelationship = user.user.guardianRelationship !== undefined ? user.user.guardianRelationship : '';
        OriginBloodType = user.user.bloodType;

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
        } else if (bloodType === 'AB') {
            Is_AB.checked = true;
        } else {
            // Uncheck all checkboxes
            Is_O.checked = false;
            Is_A.checked = false;
            Is_B.checked = false;
            Is_AB.checked = false;
        }

        console.log('혈액형:', bloodType);
        console.log('기저질환:', underlyingDisease);
        console.log('알러지:', allergy);
        console.log('복용약:', medication);
        console.log('보호자 전화번호:', guardianPhoneNumber);
        console.log('보호자 관계:', guardianRelationship);

        let data = {
            "Sick": underlyingDisease,
            "Allergy": allergy,
            "Medicine": medication,
            "GuardHp": guardianPhoneNumber,
            "GuardRel": guardianRelationship
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
        console.error('에러:', error.message);
    });