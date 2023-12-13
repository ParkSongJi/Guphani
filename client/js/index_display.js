
// 

const userId = localStorage.getItem('userId'); 
const token = localStorage.getItem('token');

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

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
        const name = user.user.name;
        const birthdate = user.user.birthdate;
        const underlyingDisease = user.user.underlyingDisease;
        const allergy = user.user.allergy;
        const bloodType = user.user.bloodType;


        // Use the extracted information as needed
        console.log('이름:', name);
        console.log('나이:', birthdate);
        console.log('기저질환:', underlyingDisease);
        console.log('알러지:', allergy);

        // Use the extracted information to generate HTML content
        const userInfoElement = document.querySelector('.user-info');
        const userUtilWrap = document.querySelector('.util-wrap');
        let html = ''
        if (user) {
            html += `
            <div class="login-on">
                <div class="name">${name ? `${name}님` : ''}</div>
                <div class="user-sub">
                    ${bloodType ? `<span>${bloodType}형</span>` : ''}
                    ${birthdate ? `<span>${calculateAge(birthdate)}세</span>` : ''}
                </div>
                <ul>
                    ${generateListItems('disease', underlyingDisease) } 
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
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Function to calculate age from birthdate
function calculateAge(birthdate) {
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
}

// Function to generate list items for diseases and allergies
function generateListItems(className, items) {
    if (items[0] !== ''){
        return items.map(item => `<li class="${className}"><span>${item}</span></li>`).join('');
    }
    return ''
}



window.addEventListener('click',(e)=>{
    const logoutBtn = document.getElementById('logoutBtn')
    if(e.target.id == 'logoutBtn'){
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        location.reload()
    }
});