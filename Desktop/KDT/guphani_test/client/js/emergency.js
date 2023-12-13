const modal = document.getElementById('searchSelect');
const btn = document.querySelector('.input-area button');
const quickBtn = document.querySelectorAll('.quick-ul li');
const schList = document.querySelectorAll('#emergencymap .list li')


// 리스트 클릭 시 모달
const detailBack = document.getElementById('detailBack')
const infoWrap = document.querySelector('.info-wrap' )

schList.forEach((el)=>{
  el.addEventListener('click',()=>{
    layerOn('emergencyDetail')
    bodyTag.style.overflow = 'hidden'
    infoWrap.scrollTop = 0;
    setKakaoMap("detailMap", 37.492786, 127.046410);
  })
})

detailBack.addEventListener('click',()=>{
  layerOut('emergencyDetail')
  bodyTag.style.overflow = 'unset'
})
