const loginUserData = JSON.parse(localStorage.getItem('user'));
(function () {
    try {
        function includeHtml() {
            const includeTarget = document.querySelectorAll('.includeJs');
            includeTarget.forEach(function (el, idx) {
                const targetFile = el.dataset.includeFile;
                if (targetFile) {
                    let xhttp = new XMLHttpRequest();

                    xhttp.onreadystatechange = function () {
                        if (this.readyState === XMLHttpRequest.DONE) {
                            this.status === 200 ? (el.innerHTML = this.responseText) : null
                            this.status === 404 ? (el.innerHTML = 'include not found.') : null
                        }
                    }
                    xhttp.open('GET', targetFile, true);
                    xhttp.send();
                    return;
                }
            });
        };

        includeHtml();
    } catch (error) {
        console.error('includeHtml 함수 실행 중 오류 발생:', error);
    }
})();

// 레이어 팝업창
function layerOn(el) {
    try {
        const layer = document.
            getElementById(el)
        layer.classList.add('fadeIn')
        layer.classList.remove('fadeOut')
    } catch (error) {
        console.error('레이어 팝업창을 표시하는 도중 오류 발생:', error);
    }
}
function layerOut(el) {
    try {
        const layer = document.getElementById(el)
        layer.classList.add('fadeOut')
        layer.classList.remove('fadeIn')
    } catch (error) {
        console.error('레이어 팝업창을 표시하는 도중 오류 발생:', error);
    }
}

// 마이페이지
const bodyTag = document.querySelector('body')
function mypageOn() {
    try {
        layerOn('mypage')
        bodyTag.style.overflow = 'hidden'
    } catch (error) {
        console.error('마이페이지를 표시하는 도중 오류 발생:', error);
    }
}
function mypageOut() {
    try {
        layerOut('mypage')
        bodyTag.style.overflow = 'unset'
    } catch (error) {
        console.error('마이페이지를 닫는 도중 오류 발생:', error);
    }
}



function withdrawal() {
    const userId = loginUserData.id
    layerOn('withdrawalLayer')
    const withdrawalBtn = document.querySelector('.withdrawalBtn')
    const txtWrap = document.querySelector('.txt-wrap')
    const btnWrap = document.querySelector('.btn-wrap')
    withdrawalBtn.addEventListener('click', () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        try {
            const response = fetch(`http://localhost:8080/auth/user/withdraw/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.ok) {
                console.log('탈퇴완료');
            }
        } catch (error) {
            console.error('Error during deletion:', error);
        }

        txtWrap.innerText = '회원탈퇴가 완료되었습니다.'
        btnWrap.innerHTML = `<button type="button" class="black-btn" onclick="location='./index.html'">닫기</button>`
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
    })

}
