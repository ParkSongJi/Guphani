const modal = document.getElementById('inquirysh');
const btn = document.querySelector('.input-area button');
const input = document.querySelector('.input-area input[type="text"]');

// 모달 외부 클릭 시 모달 닫기
window.addEventListener('click', (event) => {
  if (
    event.target !== modal &&
    event.target !== btn &&
    event.target !== input &&
    !modal.contains(event.target)
  ) {
    modal.classList.add('fadeOut');
    modal.classList.remove('fadeIn');
  }
});

function changeInquiryType(type) {
  const inquiryTypeSpan = document.getElementById('inquiry-type');
  inquiryTypeSpan.textContent = type;
}