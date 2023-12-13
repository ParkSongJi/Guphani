
// JSON 데이터 받아와주세요 여기서는 가라데이터를 쓰겠어요
let data = {
    "Sick" : ["고혈압", "당뇨"],
    "Allergy" : ["딸기", "땅콩"],
    "Medicine" : ["타이레놀", "아스피린"],
    "GuardHp" : '01011111111',
    "GuardRel" : '남편'
};

const originGuardHp = data.GuardHp
const originGuardRel = data.GuardRel

const inputGuardHp = document.getElementById('guard_hp')
const inputGuardRel = document.getElementById('guard_rel')

inputGuardHp.value = originGuardHp
inputGuardRel.value = originGuardRel

// 함수 호출: 버튼 클릭 이벤트 리스너 등록
insertBtnFunc('inputSick', 'btnSick', 'sickList', data.Sick);
insertBtnFunc('inputAllergy', 'btnAllergy', 'allergyList', data.Allergy);
insertBtnFunc('inputMedicine', 'btnMedicine', 'medicineList', data.Medicine);

// 함수 정의: 수정사항 저장 버튼 클릭 시 처리하는 함수
const submitFormButton = document.getElementById('submitForm');

submitFormButton.addEventListener('click', () => {
    const sickListValues = getListValues('sickList');
    const allergyListValues = getListValues('allergyList');
    const medicineListValues = getListValues('medicineList');
    const guard_hp = document.getElementById('guard_hp').value.replace(/[^0-9]/g, '')
    const guard_rel = document.getElementById('guard_rel').value.trim()

    const SickChangeBool = JSON.stringify(data.Sick) == JSON.stringify(sickListValues)
    const AllergyChangeBool = JSON.stringify(data.Allergy) == JSON.stringify(allergyListValues)
    const MedicineChangeBool = JSON.stringify(data.Medicine) == JSON.stringify(medicineListValues)
    

    if(guard_hp === originGuardHp && guard_rel === originGuardRel && SickChangeBool && AllergyChangeBool && MedicineChangeBool){
        makePopup('변경된 정보가 없습니다')
    }else if(guard_hp.length < 10 && guard_hp.length > 0){
        makePopup(`[${guard_hp}]번호를 확인해주세요${guard_hp.length}`)
     }else if(guard_hp !== '' && guard_rel === ''){
        makePopup('보호자와의 관계를 입력해주세요')
    }else{
        makePopup('저장되었습니다')
        // const storedUserData = localStorage.getItem('userData');
        // if (storedUserData) {
        //     console.log(storedUserData);
        //     const userData = JSON.parse(storedUserData);
    
        //         // 새로운 사용자 데이터를 생성
        //     if (sickListValues.length > 0 || allergyListValues.length > 0 || medicineListValues.length > 0 || guard_hp.length >= 10 || guard_rel !== '') {
        //         const newData = {};

        //         if (sickListValues.length > 0) {
        //             newData.sickList = sickListValues;
        //         }

        //         if (allergyListValues.length > 0) {
        //             newData.allergyList = allergyListValues;
        //         }

        //         if (medicineListValues.length > 0) {
        //             newData.medicineList = medicineListValues;
        //         }

        //         if (guard_hp.length >= 10) {
        //             newData.guard_hp = guard_hp;
        //         }

        //         if (guard_rel !== '') {
        //             newData.guard_rel = guard_rel;
        //         }

        //         // 업데이트된 userData를 다시 로컬 스토리지에 저장합니다.
        //         console.log(newData);
        //         console.log(userData); // 확인을 위해 출력
        //         window.location.href = 'register4.html';
        //     }else{
        //         window.location.href = 'register4.html';
        //     }
        //     }else {
        //         makePopup('오류가 발생했습니다. 회원가입을 다시 진행해주세요')
        // }
            
        }
    
})

// 함수 정의: 리스트에서 값을 가져오는 도우미 함수
function getListValues(listClassName) {
    const list = document.querySelector(`.${listClassName}`);
    if (list) {
        const listItems = list.querySelectorAll('li span');
        return Array.from(listItems).map(item => item.innerText);
    }
    return [];
}
    
    

function makePopup(popupMessage){
    const message = document.getElementById('message');
    message.innerText = popupMessage;

    // 팝업창 열기
    layerOn('register3Layer');
}

// 맨처음 질병버튼 추가하고 이벤트리스너 발생함수
function insertBtnFunc(inputClassName, btnClassName, insertBoxName, data) {
    const btnElement = document.querySelector('.' + btnClassName);
    const inputElement = document.querySelector('.' + inputClassName);
    const insertBox = document.querySelector('.' + insertBoxName);

    // JSON 데이터를 받아와서 리스트에 추가
    if (data === undefined) {
    } else {
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




