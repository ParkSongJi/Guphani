document.addEventListener('DOMContentLoaded', function () {
    // 함수 정의: 버튼 클릭 시 리스트에 값을 추가하는 함수
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

    // 함수 호출: 버튼 클릭 이벤트 리스너 등록
    insertBtnFunc('inputSick', 'btnSick', 'sickList');
    insertBtnFunc('inputAllergy', 'btnAllergy', 'allergyList');
    insertBtnFunc('inputMedicine', 'btnMedicine', 'medicineList');

    // 함수 정의: "다음" 버튼 클릭 시 처리하는 함수
    const submitFormButton = document.getElementById('submitForm');
    
    submitFormButton.addEventListener('click', () => {
        const sickListValues = getListValues('sickList');
        const allergyListValues = getListValues('allergyList');
        const medicineListValues = getListValues('medicineList');
        const guard_hp = document.getElementById('guard_hp').value.replace(/[^0-9]/g, '')
        const guard_rel = document.getElementById('guard_rel').value.trim()
        if(guard_hp.length < 10 && guard_hp.length > 0){
            makePopup(`[${guard_hp}]번호를 확인해주세요${guard_hp.length}`)
            }else if(guard_hp !== '' && guard_rel === ''){
            makePopup('보호자와의 관계를 입력해주세요')
            }else{
                const storedUserData = localStorage.getItem('userData');
                if (storedUserData) {
                    console.log(storedUserData);
                    const userData = JSON.parse(storedUserData);
            
                    // 새로운 사용자 데이터를 생성
                if (sickListValues.length > 0 || allergyListValues.length > 0 || medicineListValues.length > 0 || guard_hp.length >= 10 || guard_rel !== '') {
                    const newData = {};

                    if (sickListValues.length > 0) {
                        newData.sickList = sickListValues;
                    }

                    if (allergyListValues.length > 0) {
                        newData.allergyList = allergyListValues;
                    }

                    if (medicineListValues.length > 0) {
                        newData.medicineList = medicineListValues;
                    }

                    if (guard_hp.length >= 10) {
                        newData.guard_hp = guard_hp;
                    }

                    if (guard_rel !== '') {
                        newData.guard_rel = guard_rel;
                    }

                    // 업데이트된 userData를 다시 로컬 스토리지에 저장합니다.
                    // localStorage.setItem('userData', JSON.stringify(userData));
                    console.log(newData);
                    console.log(userData); // 확인을 위해 출력
                    window.location.href = 'register4.html';
                }else{
                    window.location.href = 'register4.html';
                }
                }else {
                    makePopup('오류가 발생했습니다. 회원가입을 다시 진행해주세요')
                    
            }
                
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
    
})







