// 체크박스 전체선택
const allAgree = document.querySelector('.list-table-wrap #allAgree')
const agrees = document.querySelectorAll('.list-table-wrap tbody input[type="checkbox"]')

allAgree.addEventListener('change', () => {
    agrees.forEach((el) => {
        el.checked = allAgree.checked;
    });
});

// 개별 체크박스에 클릭 이벤트 리스너 추가
agrees.forEach(function (agree) {
    agree.addEventListener('change', () => {
        // 하나라도 체크가 해제되었을 때 "allAgree" 체크박스도 해제
        if (!agree.checked) {
            allAgree.checked = false;
        } else {
            // 모든 체크박스가 체크되었을 때 "allAgree" 체크박스도 체크
            const allChecked = Array.from(agrees).every((cb) => cb.checked);
            allAgree.checked = allChecked;
        }
    });
});
