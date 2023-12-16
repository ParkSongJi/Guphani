// JSON 데이터 받아와주세요 여기서는 가라데이터를 쓰겠어요
const userId = localStorage.getItem('userId')
const token = localStorage.getItem('token')

// 인풋들
const bloodType = document.getElementsByName('bloodType')
const sickList = document.querySelector('.sickList')
const sickListLi = sickList.querySelectorAll('li')
const allergyList = document.querySelector('.allergyList')
const medicineList = document.querySelector('.medicineList')
const guardHp = document.getElementById('guard_hp')
const guardRel = document.getElementById('guard_rel')

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

function del_fn(el) {
    el.addEventListener('click',()=>{
        el.remove()
    })
}

async function infoFetch() {
    try {
        const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/detail/${userId}`, {
            method: 'GET',
            headers
        });
        const data = await response.json();
        const user = data.user;

        // 혈액형
        bloodType.forEach((el) => {
            if (el.value == user.bloodType) {
                el.checked = true;
            }
        });

        // 기저질환
        updateList('sickList', user.underlyingDisease);

        // 알러지
        updateList('allergyList', user.allergy);

        // 평소복용약
        updateList('medicineList', user.medication);

        // 보호자번호
        guardHp.value = user.guardianPhoneNumber;

        // 보호자관계
        guardRel.value = user.guardianRelationship;

    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

// 리스트 업데이트 함수
function updateList(listClassName, items) {
    const list = document.querySelector(`.${listClassName}`);
    list.innerHTML = ""; // Clear existing content

    items.forEach((el) => {
        list.innerHTML += `<li><span>${el}</span><button type="button" class="xi-close del-btn"></button></li>`;
    });
}


// 질병, 알러지, 평소복용약 추가 함수
function addList(btn, input, list) {
    const insertBtn = document.getElementById(btn)
    const listUl = document.querySelector(`.${list}`)

    insertBtn.addEventListener('click',()=>{
        const inputArea = document.getElementById(input)
        let innerList = listUl.innerHTML
        let addVal = ''
        
        const val = inputArea.value

        const elements = listUl.querySelectorAll('li span');
        if (elements.length === 0) {
            // el이 없을 때 val을 addVal에 추가
            console.log(val);
            addVal = val;
        } else {
            elements.forEach((el) => {
                if (val !== el.innerText || val !== '') {
                    console.log(val);
                    addVal = val;
                }
            });
        }

        if(val == ''){
            if(listUl != ''){
                listUl.innerHTML = innerList
            }
        }else{
            innerList += `
                    <li><span>${addVal}</span><button type="button" class="xi-close del-btn"></button></li>
            `
            listUl.innerHTML = innerList
            innerList = ''
        }    
    })    
}

// 기저질환
addList('insertSick', 'sick', 'sickList')
// 알려지
addList('insertAllergy', 'allergy', 'allergyList')
// 평소 복용약
addList('insertMedicine', 'medicine', 'medicineList')


// 삭제버튼
document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('del-btn')) {
        event.target.parentElement.remove()
    }
});


infoFetch()

// 업데이트
let sickListValues = []
let allergyListValues = []
let medicineListValues = []

async function setData() {
    try {
        const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/updateOther`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id: userId,
                guardianPhoneNumber: guardHp.value.replace(/[^0-9]/g, ''),
                guardianRelationship: guardRel.value,
                underlyingDisease: sickListValues,
                allergy: allergyListValues,
                medication: medicineListValues,
                bloodType: bloodValue,
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
        console.error('Error:', error);
    }
}

function makePopup(popupMessage) {
    document.getElementById('message').innerText = popupMessage;
    layerOn('register3Layer');
}

function makePopup(popupMessage){
    const message = document.getElementById('message');
    message.innerText = popupMessage;

    // 팝업창 열기
    layerOn('register3Layer');
}


// 업데이트 버튼
const submitFormButton = document.getElementById('submitForm');
submitFormButton.addEventListener('click',()=>{
    sickList.querySelectorAll('li').forEach((el)=>{
        sickListValues.push(el.innerText)
    })
    allergyList.querySelectorAll('li').forEach((el)=>{
        allergyListValues.push(el.innerText)
    })
    medicineList.querySelectorAll('li').forEach((el)=>{
        medicineListValues.push(el.innerText)
    })

    let bloodValue = ''
    bloodType.forEach((el)=>{
        if(el.checked){
            bloodValue = el.value
        }
    })
    setData()
    makePopup('추가정보가 수정되었습니다.')       
})

infoFetch()