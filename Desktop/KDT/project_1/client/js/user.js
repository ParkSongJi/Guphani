// 로그인 유효성 검사
const loginBtn = document.getElementById('loginBtn');
function fn_login(params) { 
    const userid = document.getElementById('userid');
    const userpw = document.getElementById('userpw');
    const error = document.querySelector('#login .error')

    if(userid.value == ''){
        error.innerText = '아이디를 입력해주세요.'
        userid.focus()
        error.style.display = 'block'
        return false
    }
    if(userpw.value == ''){
        error.innerText = '비밀번호를 입력해주세요.'
        userpw.focus()
        error.style.display = 'block'

        return false
    }
}

// 회원가입 이용약관동의
function viewMore(el) {
    let detail = el.parentElement.nextElementSibling

    if(detail.classList.contains('fadeIn')){
        detail.classList.add('fadeOut')
        detail.classList.remove('fadeIn')
        el.style.transform = 'rotate(360deg)'
    }else{
        detail.classList.add('fadeIn')
        detail.classList.remove('fadeOut')
        el.style.transform = 'rotate(270deg)'
    }
}