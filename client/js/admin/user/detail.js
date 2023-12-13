let layerText = ''
const modifyBtn = document.getElementById('modifyBtn')
const delBtn = document.getElementById('delBtn')
const textArea = document.querySelector('.layer-pop .inner-text')
const layerBtnArea = document.querySelector('.layer-pop .btn-wrap')

function fn_delete() {
    const deleteButton = document.getElementById('delBtn');
    // Get the user ID from localStorage or wherever it's stored
    const token = localStorage.getItem('token');

    try {
        fetch(`https://www.guphani.com/auth/user/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

            },
        });
    } catch (error) {
        console.error('Error during deletion:', error);
        makePopup2('Error during user deletion.');
    }
}

modifyBtn.addEventListener('click',()=>{
    layerOn('userDetailLayer')
    layerText = `회원정보가<br><strong class="point-txt">수정</strong> 되었습니다.`
    textArea.innerHTML = layerText
})

delBtn.addEventListener('click',()=>{
    layerOn('userDetailLayer')
    layerText = `회원정보가 <strong class="point-txt">영구적으로 삭제됩니다</strong><br>삭제 하시겠습니까?`
    textArea.innerHTML = layerText
    layerBtnArea.innerHTML = `
        <button type="button" class="black-btn" onclick="layerOut('userDetailLayer')">닫기</button>
        <button type="button" class="point-btn del" onclick="fn_delete()">삭제</button>
    `
})

document.addEventListener('click',(e)=>{
    if (e.target.matches('.layer-pop .point-btn.del')) {
        layerText = `회원정보가 <strong class="point-txt">삭제</strong><br>되었습니다.`
        textArea.innerHTML = layerText
        layerBtnArea.innerHTML = `
            <button type="button" class="black-btn" onclick="location.reload()">닫기</button>
        `
    }
})

// 각 회원 기존의 데이터 불러오기 
const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token')

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
};

fetch(`https://www.guphani.com/auth/user/detail/${userId}`, {
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
        const userData = {
            result: '성공',
            message: '각 회원 정보 조회 성공',
            users: user 
        };

        if (user) {
        
    

            // Assuming 'user' contains the user details fetched from the API
            const basicInfoTable = document.querySelector('.detail-wrap section:nth-child(1) table');
            basicInfoTable.innerHTML = `
                <tr>
                    <th>회원번호</th>
                    <td>1</td>
                    <th>이름</th>
                    <td><div class="input-area">
                    <input type="text" name="name" id="name" class="txt-box" value="${user.user.name}"></td>
                </tr>
                <tr>
                    <th>성별</th>
                    <td><div class="input-area">
                    <input type="text" name="gender" id="gender" class="txt-box" value="${user.user.gender}"></td>
                    <th>생년월일</th>
                    <td><div class="input-area">
                    <input type="text" name="birthdate" id="birthdate" class="txt-box" value="${user.user.birthdate}"></td>
                </tr>
                <tr>
                    <th>아이디</th>
                    <td>${user.user.id}</td>
                    <th>비밀번호</th>
                    <td>${user.user.password}</td>
                </tr>
                <tr>
                    <th>핸드폰번호</th>
                    <td><div class="input-area">
                    <input type="text" name="phoneNumber" id="phoneNumber" class="txt-box" value="${user.user.phoneNumber}"></td>
                    <th>관리자여부</th>
                    <td>
                        <div class="radio-wrap">
                            <input type="radio" name="admin" id="admin1" value="Y" class="type1" ${user.user.isAdmin === 'Y' ? 'checked' : ''}>
                            <label for="admin1">Y</label>
                        </div>
                        <div class="radio-wrap">
                            <input type="radio" name="admin" id="admin2" value="N" class="type1" ${user.user.isAdmin === 'N' ? 'checked' : ''}>
                            <label for="admin2">N</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>회원상태</th>
                    <td colspan="3">
                    <div class="radio-wrap">
                    <select name="isUser" id="isUser">
                                <option value="n" ${user.user.isUser === 'N' ? 'selected' : ''}>탈퇴</option>
                                <option value="y" ${user.user.isUser === 'Y' ? 'selected' : ''}>정상</option>
                            </select>
                        </div>
                    </td>
                </tr>
            `;
        

            // Additional Information Section
            const additionalInfoTable = document.querySelector('.detail-wrap section:nth-child(2) table');
            additionalInfoTable.innerHTML = `
                <tr>
                    <th>기저질환</th>
                    <td colspan="3"><div class="input-area">
                    <input type="text" name="underlyingDisease" id="underlyingDisease" class="txt-box" value="${user.user.underlyingDisease.join(', ')}"></td>
                </tr>
                <tr>
                    <th>알러지</th>
                    <td colspan="3"><div class="input-area">
                    <input type="text" name="allergy" id="allergy" class="txt-box" value="${user.user.allergy.join(', ')}"></td>
                </tr>
                <tr>
                    <th>평소 복용약</th>
                    <td colspan="3"><div class="input-area">
                    <input type="text" name="medication" id="medication" class="txt-box" value="${user.user.medication.join(', ')}"></td>
                </tr>
                <tr>
                    <th>보호자 연락처</th>
                    <td><div class="input-area">
                    <input type="text" name="guardianPhoneNumber" id="guardianPhoneNumber" class="txt-box" value="${user.user.guardianPhoneNumber == "undefined" ? '' : user.user.guardianPhoneNumber}"></td>
                    <th>보호자관계</th>
                    <td><div class="input-area">
                    <input type="text" name="guardianRelationship" id="guardianRelationship" class="txt-box" value="${user.user.guardianRelationship == "undefined" ? '' : user.user.guardianRelationship}"></td>
                </tr>
            `;
        } else {
            console.error('Error: User data is not in the expected format.');
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });

// 관리자가 회원 정보 수정하기 
// 수정할 수 있는 항목들: 이름, 성별, 생년월일, 핸드폰번호, 관리자 여부, 회원상태, 
// 기저질환, 알러지, 평소 복용약, 보호자 연락처, 보호자 관계 
// PUT
// 사용할 Router: 'auth/user/updateAll/:id'

document.addEventListener('DOMContentLoaded', function () {

    function getListValues(listClassName) {
        const list = document.querySelector(`.${listClassName}`);
        if (list) {
            const listItems = list.querySelectorAll('li span');
            return Array.from(listItems).map(item => item.innerText);
        }
        return [];
    }
 
    async function handleServerClientConnection() {
        const userName = document.getElementById('name').value;
        const userGender = document.getElementById('gender').value;
        const userBirthdate = document.getElementById('birthdate').value;
        const userPhoneNumber = document.getElementById('phoneNumber').value;
        const userguardianRelationship = document.getElementById('guardianRelationship').value;
        const userguardianPhoneNumber = document.getElementById('guardianPhoneNumber').value;
        const userAllergy = document.getElementById('allergy').value;
        const userMedication = document.getElementById('medication').value; 
        const userUnderlyingDisease = document.getElementById('underlyingDisease').value; 



         // Assuming user.user.isAdmin is either 'Y' or 'N'
        const isAdminYes = document.getElementById('admin1').checked;
        const isAdminNo = document.getElementById('admin2').checked;

        // Convert the boolean values to 'Y' or 'N'
        const isAdmin = isAdminYes ? 'Y' : (isAdminNo ? 'N' : '');
        

        // Assuming user.user.isUser is either 'N' or 'Y'   


        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`https://www.guphani.com/auth/user/updateAll/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: userName,
                    gender: userGender, 
                    birthdate: userBirthdate,
                    phoneNumber: userPhoneNumber,
                    isAdmin: isAdmin,
                    guardianRelationship: userguardianRelationship, 
                    guardianPhoneNumber: userguardianPhoneNumber, 
                    allergy: userAllergy, 
                    medication: userMedication, 
                    underlyingDisease: userUnderlyingDisease


 
                    
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

    const updateOtherForm = document.getElementById('modifyBtn');
    if (updateOtherForm) {
        updateOtherForm.addEventListener('click', handleServerClientConnection);
    }
});










