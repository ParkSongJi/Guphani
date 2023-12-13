// 버튼 클릭시 회원 탈퇴 서버랑 연결 

function hideDiv(divId) {
    const element = document.getElementById(divId);
    if (element) {
        element.style.display = 'none';
    }
}

function showDiv(divId) {
    const element = document.getElementById(divId);
    if (element) {
        element.style.display = 'block';
    }
}

function navigateTo(url) {
    window.location.href = url;
}

// client.js (or your client-side JavaScript file)


// document.addEventListener('DOMContentLoaded', function () {
    
// });