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
            const response = await fetch('https://www.guphani.com/auth/user/signIn', {
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
                    let message = document.getElementById('message')
                    message.innerHtml = '로그인 정보가 정확하지 않습니다.<br>다시 확인해주세요'
                    layerOn('loginLayer')
                } else {
                    alert('서버에서 오류가 발생했습니다.');
                }
                console.log('failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});