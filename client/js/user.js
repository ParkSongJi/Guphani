/*
document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('loginBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', fn_login);
    }
    // 로그인 유효성 검사
    async function fn_login() {
        const userid = document.getElementById('userid');
        const userpw = document.getElementById('userpw');
        const error = document.querySelector('#login .error');

        if (userid.value === '') {
            error.innerText = '아이디를 입력해주세요.';
            userid.focus();
            error.style.display = 'block';
            return false;
        }

        if (userpw.value === '') {
            error.innerText = '비밀번호를 입력해주세요.';
            userpw.focus();
            error.style.display = 'block';
            return false;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/user/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userid.value,
                    password: userpw.value,
                }),
            });

            if (response == 200) {
                const data = await response.json();
                
                // Save the login ID in localStorage
                localStorage.setItem('userId', userid.value);

                // Store the token in localStorage
                localStorage.setItem('token', data.token);

                const userData = {
                    userId: userid.value,
                    userPw: userpw.value,
                };

                window.location.href = '../index.html'; 
            } else {
                if (response.status !== 200) {
                    makePopup('로그인 정보가 일치하지 않습니다.');

                } else {
                    makePopup('서버에서 오류가 발생했습니다.');
                }
                console.log('failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    // Function to make and display the popup
    function makePopup(popupMessage) {
        const message = document.getElementById('message');
        message.innerText = popupMessage;

        // Display the popup
        layerOn('loginLayer');
    }
});

*/ 

document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('loginBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', fn_login);
    }
    // 로그인 유효성 검사
    async function fn_login() {
        const userid = document.getElementById('userid');
        const userpw = document.getElementById('userpw');
        const error = document.querySelector('#login .error');

        if (userid.value === '') {
            error.innerText = '아이디를 입력해주세요.';
            userid.focus();
            error.style.display = 'block';
            return false;
        }

        if (userpw.value === '') {
            error.innerText = '비밀번호를 입력해주세요.';
            userpw.focus();
            error.style.display = 'block';
            return false;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/user/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userid.value,
                    password: userpw.value,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                
                // Save the login ID in localStorage
                localStorage.setItem('userId', userid.value);

                // Store the token in localStorage
                localStorage.setItem('token', data.token);

                const userData = {
                    userId: userid.value,
                    userPw: userpw.value,
                };

                window.location.href = '../index.html'; 
            } else {
                if (response.status !== 200) {
                    makePopup('로그인 정보가 일치하지 않습니다.');

                } else {
                    makePopup('서버에서 오류가 발생했습니다. 새로고침 후 다시 시도해주세요.');
                }
                console.log('failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
function makePopup(popupMessage){
    const message = document.getElementById('message');
    message.innerText = popupMessage;

    // 팝업창 열기
    layerOn('loginLayer');
}


/* 

  <div class="layer-pop" id="loginLayer">
                <div class="bg" onclick="layerOut('loginLayer')"></div>
                <div class="inner-layer">
                    <p id="message"></p>
                    <div class="btn-wrap two">
                        <button type="button" class="black-btn" onclick="layerOut('loginLayer')">닫기</button>
                    </div>
                </div>
            </div> */ 


