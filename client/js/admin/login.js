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
            const response = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/admin/login', {
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
                // localStorage.setItem('userId', userid.value);

                // Store the token in localStorage
                localStorage.setItem('token', data.token);

                const userData = {
                    userId: userid.value,
                    userPw: userpw.value,
                };

                window.location.href = 'list.html'; 
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
});

// 레이어 팝업창
function layerOn(el) {
    const layer = document.getElementById(el)
    layer.classList.add('fadeIn')
    layer.classList.remove('fadeOut')
}
function layerOut(el) {
    const layer = document.getElementById(el)
    layer.classList.add('fadeOut')
    layer.classList.remove('fadeIn')
}

function makePopup(popupMessage){
    const message = document.getElementById('message');
    message.innerText = popupMessage;

    // 팝업창 열기
    layerOn('loginLayer');
}