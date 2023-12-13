// 퀵버튼
const quickBtns = document.querySelectorAll('.quick-ul li')
quickBtns.forEach((el) => {
  el.addEventListener('click', () => {
      document.querySelectorAll('.quick-ul li:not(:focus)').forEach((otherEl) => {
          if (otherEl !== el && otherEl.classList.contains('on')) {
              otherEl.classList.remove('on');
          }
      });

      if (el.classList.contains('on')) {
          el.classList.remove('on');
      } else {
          el.classList.add('on');
      }
  });
});

// 리스트 클릭 시 모달
const schList = document.querySelectorAll('#pharmacymap .list li')
const detailBack = document.getElementById('detailBack')
const infoWrap = document.querySelector('.info-wrap' )

schList.forEach((el)=>{
  el.addEventListener('click',()=>{
    layerOn('pharmacyDetail')
    bodyTag.style.overflow = 'hidden'
    infoWrap.scrollTop = 0;
    setKakaoMap("detailMap", 37.492786, 127.046410);
  })
})

detailBack.addEventListener('click',()=>{
  layerOut('pharmacyDetail')
  bodyTag.style.overflow = 'unset'
})
