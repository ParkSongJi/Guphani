const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

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