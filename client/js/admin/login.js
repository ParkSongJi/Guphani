document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('loginBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', fn_login);
    }

    // 로그인 유효성 검사
    async function fn_login() {
        try {
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

            const response = await fetch('http://localhost:8080/auth/admin/login', {
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
            console.error('Error in fn_login function:', error);
                        makePopup('로그인 중 오류가 발생했습니다.'); // 사용자에게 보여줄 메시지
        }
    }
});

// 레이어 팝업창
function layerOn(el) {
    try {
        const layer = document.getElementById(el);
        layer.classList.add('fadeIn');
        layer.classList.remove('fadeOut');
    } catch (error) {
        console.error('Error in layerOn function:', error);
            }
}

function layerOut(el) {
    try {
        const layer = document.getElementById(el);
        layer.classList.add('fadeOut');
        layer.classList.remove('fadeIn');
    } catch (error) {
        console.error('Error in layerOut function:', error);
            }
}

function makePopup(popupMessage) {
    try {
        const message = document.getElementById('message');
        message.innerText = popupMessage;

        // 팝업창 열기
        layerOn('loginLayer');
    } catch (error) {
        console.error('Error in makePopup function:', error);
            }
}
