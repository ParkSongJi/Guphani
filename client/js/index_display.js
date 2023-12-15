
try {
    if (loginUserData) {

        const name = loginUserData["name"];
        const birthdate = loginUserData["birthdate"];
        const underlyingDisease = loginUserData["underlyingDisease"];
        const allergy = loginUserData["allergy"];
        const bloodType = loginUserData["bloodType"];

        console.log(loginUserData);
        // Use the extracted information as needed
        console.log('이름:', name);
        console.log('나이:', birthdate);
        console.log('기저질환:', underlyingDisease);
        console.log('알러지:', allergy);

        // Use the extracted information to generate HTML content
        const userInfoElement = document.querySelector('.user-info');
        const userUtilWrap = document.querySelector('.util-wrap');
        let html = ''
        if (loginUserData) {
            html += `
        <div class="login-on">
            <div class="name">${name ? `${name}님` : ''}</div>
            <div class="user-sub">
                ${bloodType ? `<span>${bloodType}형</span>` : ''}
                ${birthdate ? `<span>${calculateAge(birthdate)}세</span>` : ''}
            </div>
            <ul>
                ${generateListItems('disease', underlyingDisease)} 
                ${generateListItems('allergy', allergy)}
            </ul>
        </span>`;


            userUtilWrap.innerHTML = `<button type="button" class="mypageBtn" onclick="mypageOn()">마이페이지</button>
        <button type="button" class="logout" id="logoutBtn">로그아웃</button>`
        }
        userInfoElement.innerHTML = html

        const mypageElement = document.querySelector('.mypage-info');
        if (mypageElement) {
            mypageElement.innerHTML = `
            <p class="mypagename">${name} 님</p>
            <ul class="info-list">
                <li class="info-firstlist">${calculateAge(birthdate)}세</li>
                <li class="info-secondlist">${bloodType} 형</li>
            </ul>`

        }
    }
} catch (error) {
    console.error('사용자 정보 처리 중 오류 발생:', error.message);
}

const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};


// Function to calculate age from birthdate
function calculateAge(birthdate) {
    try {
        // Parse the birthdate string into a Date object
        const birthDateObject = new Date(
            parseInt(birthdate.substr(0, 4)),
            parseInt(birthdate.substr(4, 2)) - 1,
            parseInt(birthdate.substr(6, 2))
        );

        // Get the current date
        const currentDate = new Date();

        // Calculate the difference in years
        let age = currentDate.getFullYear() - birthDateObject.getFullYear();

        // Adjust age if the birthday hasn't occurred yet this year
        if (
            currentDate.getMonth() < birthDateObject.getMonth() ||
            (currentDate.getMonth() === birthDateObject.getMonth() &&
                currentDate.getDate() < birthDateObject.getDate())
        ) {
            age--;
        }

        return age;
    } catch (error) {
        console.error('나이 계산 중 오류 발생:', error.message);
        return null; // 또는 오류 처리에 맞게 값을 반환
    }
}

// Function to generate list items for diseases and allergies
function generateListItems(className, items) {
    try {
        if (items[0] !== '') {
            return items.map(item => `<li class="${className}"><span>${item}</span></li>`).join('');
        }
        return ''
    } catch (error) {
        console.error('리스트 아이템 생성 중 오류 발생:', error.message);
        return ''; // 또는 오류 처리에 맞게 값을 반환
    }
}



window.addEventListener('click', (e) => {
    try {
        const logoutBtn = document.getElementById('logoutBtn')
        if (e.target.id == 'logoutBtn') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('userId')
            location.reload()
        }
    } catch (error) {
        console.error('로그아웃 중 오류 발생:', error.message);
    }
});