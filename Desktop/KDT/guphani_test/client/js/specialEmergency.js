const modal = document.getElementById('searchSelect');
const btn = document.querySelector('.input-area button');
const input = document.querySelector('.input-area input[type="text"]');
const quickBtn = document.querySelectorAll('.quick-ul li');
const selectUl = document.querySelector('.select-ul');
const checkbox = modal.querySelectorAll('input[type="checkbox"]')
const schList = document.querySelectorAll('#specialEmergencySh .list li')

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

quickBtn.forEach((el) => {
  el.addEventListener('click', () => {
    createLi = document.createElement('li');
    const quickBtnText = el.innerText;

    if (el.classList.contains('on')) {
      el.classList.remove('on');

      // .on 클래스가 제거될 때 해당 텍스트를 가진 li를 찾아 삭제
      const liList = selectUl.querySelectorAll('li');
      liList.forEach((li) => {
        const liSpanText = li.querySelector('span').innerText;
        if (liSpanText === quickBtnText && li.querySelector('.del-btn')) {
          li.remove();
        }
      });
    } else {
      el.classList.add('on');
      createLi.innerHTML = `<span>${quickBtnText}</span><button type="button" class="xi-close del-btn"></button>`;
      selectUl.appendChild(createLi);
    }
  });
});

selectUl.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('del-btn')) {
    const liToRemove = target.closest('li');
    const correspondingQuickBtnText = liToRemove.querySelector('span').innerText;

    quickBtn.forEach((quickEl) => {
      if (quickEl.innerText === correspondingQuickBtnText) {
        quickEl.classList.remove('on');
      }
    });
    liToRemove.remove();

    checkbox.forEach((el)=>{
        checkText = el.nextElementSibling.innerText;
        if(correspondingQuickBtnText == checkText){
            el.checked = false;
        }
    })
  }
});

checkbox.forEach((checkbox) => {
  checkbox.addEventListener('change', (event) => {
    const checkboxText = event.target.nextElementSibling.innerText;
    const isChecked = event.target.checked;
    if (isChecked) {
      // 체크된 경우, selectUl에 해당 텍스트 추가
      const selectedLi = document.createElement('li');
      selectedLi.innerHTML = `<span>${checkboxText}</span><button type="button" class="xi-close del-btn"></button>`;
      selectUl.appendChild(selectedLi);
    } else {
      // 체크 해제된 경우, selectUl에서 해당 텍스트를 가진 li 삭제
      const liList = selectUl.querySelectorAll('li');
      liList.forEach((li) => {
        const liSpanText = li.querySelector('span').innerText;
        if (liSpanText === checkboxText && li.querySelector('.del-btn')) {
          li.remove();
        }
      });
    }
  });
});

input.addEventListener('input', () => {
  const searchValue = input.value.toLowerCase();
  const lis = modal.querySelectorAll('ul li');
  modal.classList.add('fadeIn');
  lis.forEach((li) => {
    const label = li.querySelector('label').innerText.toLowerCase();
    if (label.includes(searchValue)) {
      li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
});
// 리스트 클릭 시 모달
const detailBack = document.getElementById('detailBack')
const infoWrap = document.querySelector('.info-wrap' )

schList.forEach((el)=>{
  el.addEventListener('click',()=>{
    layerOn('specialEmergencyDetail')
    bodyTag.style.overflow = 'hidden'
    infoWrap.scrollTop = 0;
  })
})

detailBack.addEventListener('click',()=>{
  layerOut('specialEmergencyDetail')
  bodyTag.style.overflow = 'unset'
})
