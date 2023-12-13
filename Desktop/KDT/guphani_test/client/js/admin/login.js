// 로그인 검정
// 지금은 그냥 apple abcd1234로 하겠음

const loginBtn = document.getElementById('loginBtn')

const originUserId = 'apple'
const originUserPw = 'abcd1234'

loginBtn.addEventListener('click',() => {
    userId = document.getElementById('userid').value
    userPw = document.getElementById('userpw').value

    if(userId !== originUserId || userPw !== originUserPw){
        document.querySelector('.red-font').style.display = 'block'
    }else{
        document.querySelector('.red-font').style.display = 'none'
        window.location.href = 'list.html';
    }
})